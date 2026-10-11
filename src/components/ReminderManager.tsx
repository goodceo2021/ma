import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Sparkles, CheckCircle2, AlertCircle, Play, Volume2 } from 'lucide-react';
import { ReminderConfig, CustomMaMoment } from '../types';
import { soundEngine } from '../utils/audioEngine';

interface ReminderManagerProps {
  config: ReminderConfig;
  onChangeConfig: (newConfig: ReminderConfig) => void;
  onTriggerMaNow: (durationSeconds?: number, customMomentId?: string) => void;
  customMoments?: CustomMaMoment[];
}

export const ReminderManager: React.FC<ReminderManagerProps> = ({
  config,
  onChangeConfig,
  onTriggerMaNow,
  customMoments = [],
}) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [testFiredMessage, setTestFiredMessage] = useState<string | null>(null);
  const [secondsUntilNext, setSecondsUntilNext] = useState<number>(config.intervalMinutes * 60);

  // Handle countdown calculation
  useEffect(() => {
    if (!config.enabled) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const last = config.lastTriggeredAt || now;
      const intervalMs = config.intervalMinutes * 60 * 1000;
      const nextTime = last + intervalMs;
      const remainingMs = Math.max(0, nextTime - now);
      const remainingSec = Math.floor(remainingMs / 1000);

      setSecondsUntilNext(remainingSec);

      // Trigger reminder if due
      if (remainingSec <= 0) {
        triggerReminderAlert();
        onChangeConfig({
          ...config,
          lastTriggeredAt: now,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [config]);

  const requestPermission = async () => {
    if (typeof Notification === 'undefined') return;
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        onChangeConfig({ ...config, browserNotification: true });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerReminderAlert = (isTest = false) => {
    const selectedMoment = customMoments.find((m) => m.id === config.preferredMomentId);
    const bowlFreq = selectedMoment?.ambientFreq || 261.63;

    if (config.soundEnabled) {
      soundEngine.playSingingBowl(bowlFreq, 6);
    }

    if (
      config.browserNotification &&
      typeof Notification !== 'undefined' &&
      Notification.permission === 'granted'
    ) {
      try {
        const titleText = selectedMoment ? `間刻提醒 · ${selectedMoment.title}` : '間刻提醒 · 刻意留白之時';
        const notif = new Notification(titleText, {
          body: isTest
            ? '這是一次測試提醒：請放下手中的工作，給自己片刻空白，凝視窗外或安靜深呼吸。'
            : selectedMoment?.guidingQuote || '現在是刻意安排的靜謐時刻。放下手邊工作，給自己一片呼吸的縫隙。',
          icon: '/favicon.ico',
        });
        notif.onclick = () => {
          window.focus();
          onTriggerMaNow(config.pauseDurationSeconds, config.preferredMomentId);
        };
      } catch (err) {
        console.error(err);
      }
    }

    setTestFiredMessage(isTest ? '測試提醒已響起！已播放銅磬聲與通知。' : '間刻提醒已觸發！');
    setTimeout(() => {
      setTestFiredMessage(null);
    }, 5000);
  };

  const formatCountdown = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero Card */}
      <div className="bg-[#F7F4EE] border border-stone-200/90 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-serif text-stone-500 mb-2">
            <span>宮崎駿的節奏法則</span>
            <span aria-hidden="true">·</span>
            <span>對抗數位焦慮的空白設計</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium tracking-tight mb-3">
            定時提醒 · 把「間」帶進日常作息
          </h2>
          <p className="text-sm md:text-base text-stone-600 font-serif leading-relaxed mb-6">
            現代人的工作往往被無休止的通知與代辦事項塞滿。若一整天處於高度緊張中，大腦只會漸漸遲鈍。
            設定一個溫柔的間隔，讓銅磬聲提醒你停下片刻，享受 60 秒純粹的留白。
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                const nextState = !config.enabled;
                onChangeConfig({
                  ...config,
                  enabled: nextState,
                  lastTriggeredAt: Date.now(),
                });
              }}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer ${
                config.enabled
                  ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {config.enabled ? <CheckCircle2 className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              <span>{config.enabled ? '提醒運行中（點擊暫停）' : '啟動間刻提醒'}</span>
            </button>

            <button
              onClick={() => triggerReminderAlert(true)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-stone-600" />
              <span>測試提醒效果</span>
            </button>
          </div>
        </div>

        {/* Live Status Card on the right */}
        {config.enabled && (
          <div className="mt-6 md:mt-0 md:absolute md:top-8 md:right-8 bg-white/90 backdrop-blur-xs border border-stone-200 rounded-xl p-5 shadow-xs min-w-[220px]">
            <div className="text-xs text-stone-500 font-serif mb-1">距離下一次間刻留白</div>
            <div className="text-3xl font-serif font-light text-stone-900 tracking-wider tabular-nums">
              {formatCountdown(secondsUntilNext)}
            </div>
            <div className="text-xs text-stone-400 mt-2 flex items-center justify-between">
              <span>週期：{config.intervalMinutes} 分鐘</span>
              <button
                onClick={() => onTriggerMaNow(config.pauseDurationSeconds)}
                className="text-stone-800 font-medium hover:underline text-xs"
              >
                立即留白 →
              </button>
            </div>
          </div>
        )}
      </div>

      {testFiredMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{testFiredMessage}</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interval Cadence Setting */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-serif font-medium text-stone-900 mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-600" />
            間隔時間 (Interval)
          </h3>
          <p className="text-xs text-stone-500 font-serif mb-4">
            工作多長時間後，喚醒一次「間」的呼吸空檔？
          </p>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {[30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                onClick={() =>
                  onChangeConfig({
                    ...config,
                    intervalMinutes: mins,
                    lastTriggeredAt: Date.now(),
                  })
                }
                className={`py-2 px-3 text-xs md:text-sm rounded-lg font-medium transition-colors cursor-pointer ${
                  config.intervalMinutes === mins
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {mins} 分鐘
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
            <span>留白體驗推薦長度：</span>
            <div className="flex gap-2">
              {[60, 120, 180].map((sec) => (
                <button
                  key={sec}
                  onClick={() => onChangeConfig({ ...config, pauseDurationSeconds: sec })}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    config.pauseDurationSeconds === sec
                      ? 'bg-stone-800 text-white'
                      : 'bg-stone-100 hover:bg-stone-200'
                  }`}
                >
                  {sec} 秒
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Moment Selection */}
          <div className="pt-4 mt-4 border-t border-stone-100">
            <label className="block text-xs font-serif text-stone-600 mb-1.5">
              提醒時喚醒的間時刻：
            </label>
            <select
              value={config.preferredMomentId || ''}
              onChange={(e) => onChangeConfig({ ...config, preferredMomentId: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-none"
            >
              <option value="">預設吉卜力水上電車 (Spirited Away Train)</option>
              {customMoments.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} {m.isUserCreated ? '(自創)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notification & Sound Options */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
          <h3 className="text-base font-serif font-medium text-stone-900 mb-1 flex items-center gap-2">
            <Bell className="w-4 h-4 text-stone-600" />
            提醒方式 (Sensory Channels)
          </h3>
          <p className="text-xs text-stone-500 font-serif mb-4">
            使用不刺耳、具有寺廟磬音質感的聲響與系統通知。
          </p>

          <div className="space-y-3">
            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200/60">
              <div>
                <div className="text-sm font-medium text-stone-900">純粹銅磬音效 (Singing Bowl)</div>
                <div className="text-xs text-stone-500">提醒時緩慢敲響青銅磬，頻率 261Hz 悠長衰減</div>
              </div>
              <input
                type="checkbox"
                checked={config.soundEnabled}
                onChange={(e) => onChangeConfig({ ...config, soundEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-stone-900 focus:ring-stone-500 cursor-pointer"
              />
            </div>

            {/* Browser Notification Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-200/60">
              <div>
                <div className="text-sm font-medium text-stone-900">桌面推播提醒</div>
                <div className="text-xs text-stone-500">
                  {notificationPermission === 'granted'
                    ? '已授權桌面推播'
                    : notificationPermission === 'denied'
                    ? '瀏覽器權限已拒絕，請在網址列旁重新允許'
                    : '點擊以開啟瀏覽器通知許可'}
                </div>
              </div>
              {notificationPermission !== 'granted' ? (
                <button
                  onClick={requestPermission}
                  className="px-2.5 py-1 text-xs bg-stone-900 text-white rounded hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  授權
                </button>
              ) : (
                <input
                  type="checkbox"
                  checked={config.browserNotification}
                  onChange={(e) => onChangeConfig({ ...config, browserNotification: e.target.checked })}
                  className="w-4 h-4 rounded text-stone-900 focus:ring-stone-500 cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preset Daily Rhythms Section */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-xs">
        <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">
          一日四時之留白節律
        </h3>
        <p className="text-xs text-stone-500 font-serif mb-6 max-w-xl">
          日本傳統美學中將自然天色的轉變視為心靈的節點。你可以隨時手動點擊以下時段，直接進入對應氛圍的「間」。
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              time: '09:30',
              title: '晨光之隙',
              desc: '在開始收發信件前，給晨光三分鐘',
              theme: 'tea' as const,
              duration: 180,
            },
            {
              time: '12:30',
              title: '正午緩息',
              desc: '午餐後的空檔，放下手機注視遠方',
              theme: 'grass' as const,
              duration: 120,
            },
            {
              time: '16:30',
              title: '薄暮放空',
              desc: '天色漸暗，凝視夕暮或窗外雨痕',
              theme: 'rain' as const,
              duration: 180,
            },
            {
              time: '21:30',
              title: '深夜寂靜',
              desc: '睡前的安寧，讓海水收納一切波瀾',
              theme: 'sea' as const,
              duration: 300,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-xl border border-stone-200/90 bg-[#FBF9F5] hover:border-stone-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-mono text-stone-500">{item.time}</div>
                <div className="text-base font-serif font-medium text-stone-900 mt-1">{item.title}</div>
                <div className="text-xs text-stone-600 font-serif mt-1 leading-relaxed">{item.desc}</div>
              </div>

              <button
                onClick={() => onTriggerMaNow(item.duration)}
                className="mt-4 w-full py-1.5 text-xs font-medium text-stone-800 bg-stone-200/70 hover:bg-stone-300 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                進入 {item.duration / 60} 分鐘留白
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
