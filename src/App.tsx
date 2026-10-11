/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  Feather,
  Bell,
  BookOpen,
  ArrowRight,
  Compass,
  Play,
  Heart,
  Wind,
  Droplets,
  Coffee,
  Train,
  Waves,
  Plus,
  Palette
} from 'lucide-react';
import { Header } from './components/Header';
import { MaImmersionModal } from './components/MaImmersionModal';
import { ReminderManager } from './components/ReminderManager';
import { MaJournal } from './components/MaJournal';
import { GhibliMaPhilosophy } from './components/GhibliMaPhilosophy';
import { CustomMomentCreator } from './components/CustomMomentCreator';
import { ArtisticSceneCanvas } from './components/ArtisticSceneCanvas';
import {
  MaRecord,
  ReminderConfig,
  SceneTheme,
  CustomMaMoment,
  PRESET_MOMENTS,
  INITIAL_SAMPLE_RECORDS,
} from './types';
import { soundEngine } from './utils/audioEngine';

const STORAGE_KEY_RECORDS = 'ma_records_data_v1';
const STORAGE_KEY_REMINDER = 'ma_reminder_config_v1';
const STORAGE_KEY_CUSTOM_MOMENTS = 'ma_custom_moments_v1';

const INITIAL_MOMENTS: CustomMaMoment[] = [
  ...PRESET_MOMENTS,
  {
    id: 'user-sample-cat',
    title: '陽台曬太陽的貓',
    subtitle: '客廳陽台 · 15:30 暖陽',
    description: '看著貓咪在陽光裡舒展身軀，什麼事也不必趕，讓日光慢慢在木質地板上移動。',
    ambientSound: 'wind',
    ambientFreq: 432,
    visualAtmosphere: 'summer',
    particleEffect: 'dust',
    defaultDurationSeconds: 180,
    breathCadence: '4-4-6',
    guidingQuote: '「閉上眼，聽身邊最微弱的一種聲音，感受陽光的溫度。」',
    isUserCreated: true,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'user-sample-coffee',
    title: '手沖咖啡滴落的三分鐘',
    subtitle: '清晨廚房窗邊',
    description: '熱水注入深焙咖啡粉，深褐色咖啡液滴入壺中，香氣在清晨的冷空氣裡瀰漫。',
    ambientSound: 'fireplace',
    ambientFreq: 528,
    visualAtmosphere: 'room',
    particleEffect: 'steam',
    defaultDurationSeconds: 180,
    breathCadence: '4-7-8',
    guidingQuote: '「水滴落下的節奏，是這一天給自己的第一個禮物。」',
    isUserCreated: true,
    createdAt: Date.now() - 172800000,
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'immersion' | 'custom' | 'journal' | 'reminder' | 'philosophy'>('immersion');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Custom Moments State
  const [customMoments, setCustomMoments] = useState<CustomMaMoment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_MOMENTS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_MOMENTS;
  });

  // Immersion Modal State
  const [isImmersionOpen, setIsImmersionOpen] = useState<boolean>(false);
  const [activeTheme, setActiveTheme] = useState<SceneTheme>('train');
  const [activeDuration, setActiveDuration] = useState<number>(60);
  const [activeCustomMoment, setActiveCustomMoment] = useState<CustomMaMoment | null>(null);

  // Journal Prefill Draft
  const [prefillDraft, setPrefillDraft] = useState<{ durationSeconds: number; sceneTheme: SceneTheme } | null>(null);

  // Records state
  const [records, setRecords] = useState<MaRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return INITIAL_SAMPLE_RECORDS;
  });

  // Reminder configuration state
  const [reminderConfig, setReminderConfig] = useState<ReminderConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REMINDER);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      enabled: false,
      intervalMinutes: 45,
      mode: 'interval',
      scheduledTimes: ['09:30', '12:30', '16:30', '21:30'],
      soundEnabled: true,
      browserNotification: false,
      pauseDurationSeconds: 60,
      lastTriggeredAt: Date.now(),
      preferredMomentId: 'preset-train',
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_MOMENTS, JSON.stringify(customMoments));
    } catch (e) {
      console.error(e);
    }
  }, [customMoments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error(e);
    }
  }, [records]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REMINDER, JSON.stringify(reminderConfig));
    } catch (e) {
      console.error(e);
    }
  }, [reminderConfig]);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleStartImmersion = (theme: SceneTheme = 'train', durationSeconds: number = 60) => {
    setActiveCustomMoment(null);
    setActiveTheme(theme);
    setActiveDuration(durationSeconds);
    setIsImmersionOpen(true);
  };

  const handleLaunchCustomMoment = (moment: CustomMaMoment) => {
    setActiveCustomMoment(moment);
    setActiveTheme('custom');
    setActiveDuration(moment.defaultDurationSeconds);
    setIsImmersionOpen(true);
  };

  const handleSaveCustomMoment = (saved: CustomMaMoment) => {
    const exists = customMoments.some((m) => m.id === saved.id);
    if (exists) {
      setCustomMoments(customMoments.map((m) => (m.id === saved.id ? saved : m)));
    } else {
      setCustomMoments([saved, ...customMoments]);
    }
  };

  const handleDeleteCustomMoment = (id: string) => {
    if (window.confirm('確定要刪除這個自創間時刻嗎？')) {
      setCustomMoments(customMoments.filter((m) => m.id !== id));
      if (reminderConfig.preferredMomentId === id) {
        setReminderConfig({ ...reminderConfig, preferredMomentId: undefined });
      }
    }
  };

  const handleSetPreferredReminderMoment = (id: string) => {
    setReminderConfig({ ...reminderConfig, preferredMomentId: id });
    alert('已將此時刻設為定時提醒喚醒對象！');
  };

  const handleAddRecord = (newRec: Omit<MaRecord, 'id' | 'timestamp'>) => {
    const record: MaRecord = {
      ...newRec,
      id: `ma-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    setRecords([record, ...records]);
    setPrefillDraft(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('確定要刪除這則間刻記錄嗎？')) {
      setRecords(records.filter((r) => r.id !== id));
    }
  };

  const handleImportRecords = (imported: MaRecord[]) => {
    setRecords(imported);
    alert(`成功匯入 ${imported.length} 則間刻記錄！`);
  };

  const handleRecordFromImmersion = (data: {
    durationSeconds: number;
    sceneTheme: SceneTheme;
    customMomentId?: string;
    suggestedTitle?: string;
  }) => {
    setPrefillDraft({
      durationSeconds: data.durationSeconds,
      sceneTheme: data.sceneTheme,
    });
    setCurrentTab('journal');
  };

  const handleTriggerFromReminder = (duration = 60, preferredId?: string) => {
    if (preferredId) {
      const match = customMoments.find((m) => m.id === preferredId);
      if (match) {
        handleLaunchCustomMoment(match);
        return;
      }
    }
    handleStartImmersion('train', duration);
  };

  // Calculate stats
  const totalMinutesRecorded = Math.round(
    records.reduce((acc, r) => acc + (r.durationSeconds || 60), 0) / 60
  );

  const userCreatedMoments = customMoments.filter((m) => m.isUserCreated);

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#292524] flex flex-col font-sans selection:bg-[#EADBCA] selection:text-[#1C1917]">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onInstantMa={() => handleStartImmersion('train', 60)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        reminderActive={reminderConfig.enabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Tab 1: Immersion & Overview Hub */}
        {currentTab === 'immersion' && (
          <div className="space-y-16 animate-fadeIn">
            {/* Editorial Hero Banner */}
            <section className="relative rounded-3xl bg-[#F7F4EE] border border-stone-200/90 p-8 md:p-14 overflow-hidden shadow-xs">
              <div className="max-w-2xl relative z-10">
                <div className="flex items-center gap-2 text-xs font-serif text-stone-500 mb-3">
                  <span>日本美學 · 空間與時間的負空間</span>
                  <span aria-hidden="true">·</span>
                  <span>THE ART OF MA (間)</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-stone-900 font-medium tracking-tight leading-[1.15] mb-5 text-balance">
                  給心靈一刻<br />
                  刻意安排的靜謐
                </h1>

                <p className="text-base sm:text-lg text-stone-600 font-serif leading-relaxed mb-8 max-w-xl">
                  宮崎駿在電影中，總會留下那些沒有對白、沒有情節推動的空白：
                  水上電車劃過水面、熱茶冒出白煙、水滴敲擊雨傘。
                  現在，你不僅能沉浸其中，更能<strong>創造專屬於你的「間」時刻</strong>。
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => handleStartImmersion('train', 60)}
                    className="px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center gap-2 cursor-pointer group"
                  >
                    <Sparkles className="w-4 h-4 opacity-80" />
                    <span>立即體驗 1 分鐘間刻</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setCurrentTab('custom')}
                    className="px-5 py-3.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Palette className="w-4 h-4 text-stone-600" />
                    <span>創造我的間時刻</span>
                  </button>

                  <button
                    onClick={() => setCurrentTab('reminder')}
                    className="px-4 py-3.5 text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-stone-500" />
                    <span>定時提醒</span>
                  </button>
                </div>
              </div>

              {/* Decorative Subtle Watercolor Accent Right */}
              <div className="hidden lg:block absolute -right-12 -bottom-10 w-[460px] h-[340px] rounded-2xl overflow-hidden shadow-lg border border-stone-300/80 rotate-2 opacity-95">
                <ArtisticSceneCanvas theme="train" />
              </div>
            </section>

            {/* Quick Metrics Bar (Clean Unboxed Numbers) */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 border-y border-stone-200/80 text-stone-700">
              <div>
                <div className="text-xs font-serif text-stone-500 mb-1">已記錄的留白</div>
                <div className="text-2xl md:text-3xl font-serif text-stone-900 tabular-nums">
                  {records.length} <span className="text-xs text-stone-500 font-sans">刻</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-serif text-stone-500 mb-1">累積沉澱時間</div>
                <div className="text-2xl md:text-3xl font-serif text-stone-900 tabular-nums">
                  {totalMinutesRecorded} <span className="text-xs text-stone-500 font-sans">分鐘</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-serif text-stone-500 mb-1">專屬自創時刻</div>
                <div className="text-2xl md:text-3xl font-serif text-stone-900 tabular-nums">
                  {userCreatedMoments.length} <span className="text-xs text-stone-500 font-sans">款</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-serif text-stone-500 mb-1">定時提醒節奏</div>
                <div className="text-2xl md:text-3xl font-serif text-stone-900">
                  {reminderConfig.enabled ? (
                    <span className="text-emerald-800 text-lg md:text-xl font-medium">每 {reminderConfig.intervalMinutes} 分</span>
                  ) : (
                    <span className="text-stone-400 text-lg md:text-xl">未啟動</span>
                  )}
                </div>
              </div>
            </section>

            {/* Section: User Created Moments Callout Banner */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <div className="text-xs font-serif text-stone-500">自創留白空間 · USER CREATED MOMENTS</div>
                  <h2 className="text-2xl font-serif font-medium text-stone-900 mt-1">
                    你親手創造的「間」時刻
                  </h2>
                </div>
                <button
                  onClick={() => setCurrentTab('custom')}
                  className="text-xs font-serif font-medium text-stone-800 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>進入自創工坊 →</span>
                </button>
              </div>

              {userCreatedMoments.length === 0 ? (
                <div className="bg-[#FAF7F0] border border-dashed border-stone-300 rounded-2xl p-8 text-center">
                  <Palette className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                  <h3 className="text-base font-serif text-stone-800 font-medium">尚未創造自己的專屬時刻</h3>
                  <p className="text-xs text-stone-500 font-serif mt-1 max-w-md mx-auto">
                    你可以挑選晨曦、薄暮、深夜天色，調配微風、細雨或壁爐聲景，搭配自己的照片與呼吸引導。
                  </p>
                  <button
                    onClick={() => setCurrentTab('custom')}
                    className="mt-4 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                  >
                    立即創造第一個間時刻
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userCreatedMoments.slice(0, 3).map((moment) => (
                    <div
                      key={moment.id}
                      onClick={() => handleLaunchCustomMoment(moment)}
                      className="group bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="h-40 relative overflow-hidden border-b border-stone-100">
                        <ArtisticSceneCanvas customMoment={moment} theme="custom" />
                        <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                          自創時刻
                        </div>
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="px-3 py-1 bg-stone-900 text-white text-xs font-serif font-medium rounded-md shadow-sm flex items-center gap-1">
                            <Play className="w-3 h-3 fill-current" />
                            開始體驗
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-xs text-stone-500 font-serif mb-1">
                            {moment.subtitle || '日常留白'} · {moment.ambientSound}
                          </div>
                          <h3 className="text-base font-serif font-medium text-stone-900 group-hover:text-stone-700 transition-colors">
                            {moment.title}
                          </h3>
                          <p className="text-xs text-stone-600 font-serif mt-1.5 leading-relaxed line-clamp-2">
                            {moment.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-serif">
                          <span>{moment.defaultDurationSeconds / 60} 分鐘留白</span>
                          <span className="text-stone-800 font-medium group-hover:underline">
                            進入 →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Curated Atmospheric Scenes Grid */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <div className="text-xs font-serif text-stone-500">吉卜力五大經典意境 · CINEMATIC ATMOSPHERES</div>
                  <h2 className="text-2xl font-serif font-medium text-stone-900 mt-1">
                    宮崎駿的經典「間」畫卷
                  </h2>
                </div>
                <p className="text-xs text-stone-500 font-serif">
                  點擊任意卡片，即刻以該場景開啟專屬的靜默冥想
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    theme: 'train' as const,
                    title: '水上電車與積雨雲',
                    film: '《神隱少女》第6號車站',
                    quote: '電車劃過沒有邊際的水面，車廂裡只有水聲與風聲。',
                    icon: Train,
                    soundLabel: '微風與水紋',
                  },
                  {
                    theme: 'rain' as const,
                    title: '簷下細雨與破舊站牌',
                    film: '《龍貓》稻荷前公車站',
                    quote: '碩大的水珠敲擊在雨傘頂部，森林在雨氣裡靜靜呼吸。',
                    icon: Droplets,
                    soundLabel: '淅瀝雨聲',
                  },
                  {
                    theme: 'grass' as const,
                    title: '晴丘青草與掠過之風',
                    film: '《魔女宅急便》山丘草坡',
                    quote: '什麼都不做，只是枕著手看著青草隨風翻湧如波浪。',
                    icon: Wind,
                    soundLabel: '山原清風',
                  },
                  {
                    theme: 'tea' as const,
                    title: '午後靜室一盞清茶',
                    film: '吉卜力生活日常',
                    quote: '看著熱氣在窗前斜射的光束裡慢慢盤旋、消散。',
                    icon: Coffee,
                    soundLabel: '純粹寂靜',
                  },
                  {
                    theme: 'sea' as const,
                    title: '秘密海灣的潮聲',
                    film: '《紅豬》亞得里亞海',
                    quote: '在白色鵝卵石的沙灘上，潮浪收納了世間所有的喧囂。',
                    icon: Waves,
                    soundLabel: '碧海浪汐',
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.theme}
                      onClick={() => handleStartImmersion(item.theme, 60)}
                      className="group bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="h-44 relative overflow-hidden border-b border-stone-100">
                        <ArtisticSceneCanvas theme={item.theme} />
                        <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-3 left-3 bg-stone-900/70 backdrop-blur-xs text-white p-1.5 rounded-md">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="px-3 py-1 bg-white text-stone-900 text-xs font-serif font-medium rounded-md shadow-sm flex items-center gap-1">
                            <Play className="w-3 h-3 fill-current" />
                            開始留白
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="text-xs text-stone-400 font-serif mb-1">
                            {item.film} · {item.soundLabel}
                          </div>
                          <h3 className="text-lg font-serif font-medium text-stone-900 group-hover:text-stone-700 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-stone-600 font-serif mt-2 leading-relaxed">
                            {item.quote}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-serif">
                          <span>預設：1 分鐘體驗</span>
                          <span className="text-stone-800 font-medium group-hover:underline">
                            進入 →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Quick Ghibli Philosophy Teaser */}
            <section className="bg-[#FAF7F0] border border-stone-300/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="text-xs font-serif text-stone-500 mb-1">經典對話節錄</div>
                <h3 className="text-xl md:text-2xl font-serif text-stone-900 font-medium mb-2">
                  「拍手與拍手之間的空檔，就是『間』」
                </h3>
                <p className="text-sm text-stone-600 font-serif leading-relaxed">
                  宮崎駿曾親口向西方影評人解釋，為什麼日本文化如此珍視安靜的留白。
                  閱讀這篇深入的解析，了解為何適度的空白才能讓心靈真正復原。
                </p>
              </div>

              <button
                onClick={() => setCurrentTab('philosophy')}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap shadow-xs cursor-pointer"
              >
                閱讀「間」的哲學 →
              </button>
            </section>
          </div>
        )}

        {/* Tab 2: Custom Moment Studio */}
        {currentTab === 'custom' && (
          <CustomMomentCreator
            customMoments={customMoments}
            onSaveMoment={handleSaveCustomMoment}
            onDeleteMoment={handleDeleteCustomMoment}
            onLaunchMoment={handleLaunchCustomMoment}
            preferredMomentId={reminderConfig.preferredMomentId}
            onSetPreferredReminderMoment={handleSetPreferredReminderMoment}
          />
        )}

        {/* Tab 3: Journal */}
        {currentTab === 'journal' && (
          <MaJournal
            records={records}
            onAddRecord={handleAddRecord}
            onDeleteRecord={handleDeleteRecord}
            onImportRecords={handleImportRecords}
            prefillDraft={prefillDraft}
            onClearPrefill={() => setPrefillDraft(null)}
          />
        )}

        {/* Tab 4: Reminder Manager */}
        {currentTab === 'reminder' && (
          <ReminderManager
            config={reminderConfig}
            onChangeConfig={setReminderConfig}
            onTriggerMaNow={handleTriggerFromReminder}
            customMoments={customMoments}
          />
        )}

        {/* Tab 5: Ghibli Philosophy */}
        {currentTab === 'philosophy' && (
          <GhibliMaPhilosophy
            onEnterSceneExperience={(theme) => handleStartImmersion(theme, 60)}
          />
        )}
      </main>

      {/* Immersion Modal (Full Screen Meditative Space) */}
      <MaImmersionModal
        isOpen={isImmersionOpen}
        onClose={() => setIsImmersionOpen(false)}
        onRecordMoment={handleRecordFromImmersion}
        initialTheme={activeTheme}
        initialDuration={activeDuration}
        activeCustomMoment={activeCustomMoment}
      />

      {/* Quiet Minimal Footer (Section 1.B Anti-Slop Discipline) */}
      <footer className="border-t border-stone-200/80 bg-[#FBF9F5] py-8 px-6 text-stone-500 text-xs font-serif mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">間刻 · Ma</span>
            <span>—</span>
            <span>致敬宮崎駿與吉卜力工作室的留白美學 · 自由創造你的空白</span>
          </div>
          <div>
            「拍手與拍手之間的空隙，就是間。」· 刻意安排的靜謐
          </div>
        </div>
      </footer>
    </div>
  );
}
