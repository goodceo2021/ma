import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Play,
  Trash2,
  Edit3,
  Image,
  Video,
  Film,
  Volume2,
  Wind,
  Droplets,
  Flame,
  Moon,
  Sun,
  Eye,
  Check,
  RotateCcw,
  Copy,
  Clock,
  Feather
} from 'lucide-react';
import {
  CustomMaMoment,
  AmbientSoundType,
  VisualAtmosphere,
  ParticleEffect,
  BreathCadence,
} from '../types';
import { ArtisticSceneCanvas } from './ArtisticSceneCanvas';
import { soundEngine } from '../utils/audioEngine';

interface CustomMomentCreatorProps {
  customMoments: CustomMaMoment[];
  onSaveMoment: (moment: CustomMaMoment) => void;
  onDeleteMoment: (id: string) => void;
  onLaunchMoment: (moment: CustomMaMoment) => void;
  preferredMomentId?: string;
  onSetPreferredReminderMoment?: (id: string) => void;
}

export const CustomMomentCreator: React.FC<CustomMomentCreatorProps> = ({
  customMoments,
  onSaveMoment,
  onDeleteMoment,
  onLaunchMoment,
  preferredMomentId,
  onSetPreferredReminderMoment,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState<string>('陽台曬太陽的貓');
  const [subtitle, setSubtitle] = useState<string>('微風吹拂窗欞的午後');
  const [description, setDescription] = useState<string>(
    '看著貓咪在陽光裡舒展身軀，什麼事也不必趕，讓日光慢慢移動。'
  );
  const [guidingQuote, setGuidingQuote] = useState<string>(
    '「閉上眼，聽身邊最微弱的一種聲音，感受陽光的溫度。」'
  );
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('wind');
  const [ambientFreq, setAmbientFreq] = useState<number>(432);
  const [visualAtmosphere, setVisualAtmosphere] = useState<VisualAtmosphere>('summer');
  const [particleEffect, setParticleEffect] = useState<ParticleEffect>('dust');
  const [defaultDurationSeconds, setDefaultDurationSeconds] = useState<number>(180);
  const [breathCadence, setBreathCadence] = useState<BreathCadence>('4-4-6');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaFileName, setMediaFileName] = useState<string>('');
  const [isTestingSound, setIsTestingSound] = useState<boolean>(false);

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
    setGuidingQuote('');
    setAmbientSound('wind');
    setAmbientFreq(432);
    setVisualAtmosphere('summer');
    setParticleEffect('dust');
    setDefaultDurationSeconds(120);
    setBreathCadence('4-4-6');
    setMediaType('none');
    setMediaUrl('');
    setMediaFileName('');
    setEditingId(null);
  };

  const handleOpenNew = () => {
    resetForm();
    setTitle('窗外的一朵行雲');
    setSubtitle('午後四點半的放空');
    setDescription('凝視天空一朵積雨雲的邊緣，看它在微風裡慢慢分解、變形。');
    setGuidingQuote('「雲不知道自己要飄去哪裡，但它從來不慌張。」');
    setIsEditorOpen(true);
  };

  const handleEdit = (moment: CustomMaMoment) => {
    setEditingId(moment.id);
    setTitle(moment.title);
    setSubtitle(moment.subtitle || '');
    setDescription(moment.description);
    setGuidingQuote(moment.guidingQuote || '');
    setAmbientSound(moment.ambientSound);
    setAmbientFreq(moment.ambientFreq || 432);
    setVisualAtmosphere(moment.visualAtmosphere);
    setParticleEffect(moment.particleEffect);
    setDefaultDurationSeconds(moment.defaultDurationSeconds);
    setBreathCadence(moment.breathCadence);
    const existingUrl = moment.mediaUrl || moment.customImageUrl || '';
    setMediaUrl(existingUrl);
    setMediaType(moment.mediaType || (existingUrl.startsWith('data:video') ? 'video' : existingUrl ? 'image' : 'none'));
    setMediaFileName(existingUrl ? (moment.mediaType === 'video' ? '自訂影片' : '自訂相片') : '');
    setIsEditorOpen(true);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? 40 * 1024 * 1024 : 8 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(isVideo ? '影片檔案較大，請選擇 40MB 以內的短影片' : '圖片請選擇 8MB 以內檔案');
        return;
      }
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setMediaUrl(result);
          setMediaType(isVideo ? 'video' : 'image');
          setMediaFileName(file.name);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        console.error(err);
        alert('檔案讀取失敗，請重試');
      }
    }
  };

  const handleTestSound = () => {
    if (isTestingSound) return;
    setIsTestingSound(true);
    soundEngine.playSingingBowl(ambientFreq, 4.5);

    let stopAmbient: (() => void) | null = null;
    if (ambientSound === 'wind') stopAmbient = soundEngine.startWind();
    else if (ambientSound === 'rain') stopAmbient = soundEngine.startRain();
    else if (ambientSound === 'stream') stopAmbient = soundEngine.startStream();
    else if (ambientSound === 'crickets') stopAmbient = soundEngine.startCrickets();
    else if (ambientSound === 'fireplace') stopAmbient = soundEngine.startFireplace();

    setTimeout(() => {
      if (stopAmbient) stopAmbient();
      setIsTestingSound(false);
    }, 4500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMoment: CustomMaMoment = {
      id: editingId || `custom-ma-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim() || '刻意安排的靜謐時光，放下手邊一切，回歸呼吸。',
      guidingQuote: guidingQuote.trim() || '「重要的東西，往往存在於那些看似沒有用處的安靜時光之中。」',
      ambientSound,
      ambientFreq,
      visualAtmosphere,
      particleEffect,
      defaultDurationSeconds,
      breathCadence,
      mediaType: mediaType !== 'none' ? mediaType : undefined,
      mediaUrl: mediaUrl || undefined,
      customImageUrl: mediaUrl || undefined,
      isUserCreated: true,
      createdAt: editingId ? Date.now() : Date.now(),
    };

    onSaveMoment(newMoment);
    setIsEditorOpen(false);
    resetForm();
  };

  // Temporary mock object for live preview
  const livePreviewMoment: CustomMaMoment = {
    id: 'live-preview',
    title: title || '自創間時刻標題',
    subtitle: subtitle || '情境副標題',
    description: description || '留白說明',
    ambientSound,
    ambientFreq,
    visualAtmosphere,
    particleEffect,
    defaultDurationSeconds,
    breathCadence,
    mediaType,
    mediaUrl: mediaUrl || undefined,
    customImageUrl: mediaUrl || undefined,
    isUserCreated: true,
    createdAt: Date.now(),
  };

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Header and Introduction */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif text-stone-500 mb-1">
            <span>自訂間時刻工坊</span>
            <span aria-hidden="true">·</span>
            <span>CREATE YOUR STILLNESS</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium tracking-tight">
            創造屬於你的「間」時刻
          </h2>
          <p className="text-sm text-stone-600 font-serif mt-1 max-w-xl">
            每一個人的生命裡，都有專屬於自己的安靜錨點。
            是一杯手沖咖啡的香氣、陽台曬太陽的貓，還是雨天窗欞上的水珠？
            自由編排視覺氛圍、動態微塵、自然聲景與呼吸節奏。
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>創造新的間時刻</span>
        </button>
      </div>

      {/* Interactive Moment Creator / Editor Modal */}
      {isEditorOpen && (
        <div className="bg-[#FAF7F0] border border-stone-300 rounded-2xl p-6 md:p-8 shadow-md animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-stone-700" />
              <h3 className="text-lg font-serif font-medium text-stone-900">
                {editingId ? '編輯自訂間時刻' : '設計專屬的「間」時刻'}
              </h3>
            </div>
            <button
              onClick={() => setIsEditorOpen(false)}
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              取消關閉
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 7 Columns: Form Controls */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Naming & Philosophy */}
              <div className="space-y-4">
                <div className="text-xs uppercase font-serif tracking-widest text-stone-500">
                  01. 時刻命題與留白意圖
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-serif text-stone-700 mb-1">
                      時刻名稱 (Title) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="例如：陽台曬太陽的貓、手沖咖啡的三分鐘"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-serif text-stone-700 mb-1">
                      情境副標 (Context)
                    </label>
                    <input
                      type="text"
                      placeholder="例如：客廳陽台 · 15:30 暖陽"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-serif text-stone-700 mb-1">
                    留白的意圖與心境描寫 (Intention)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="描述這個時刻為什麼值得停下來，例如：看著熱氣在窗前斜射的光束裡散開，不看手機，任思緒放空..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-600 font-serif"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif text-stone-700 mb-1">
                    留白體驗時的凝視導引句 (Guiding Prompt)
                  </label>
                  <input
                    type="text"
                    placeholder="例如：「聽身邊最微弱的一種聲音，感受吸氣時清涼的空氣。」"
                    value={guidingQuote}
                    onChange={(e) => setGuidingQuote(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-600 font-serif italic"
                  />
                </div>
              </div>

              {/* Step 2: Visual Environment & Dynamic Particle */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <div className="text-xs uppercase font-serif tracking-widest text-stone-500">
                  02. 視覺畫卷與動態微塵
                </div>

                {/* Atmosphere Selection */}
                <div>
                  <label className="block text-xs font-serif text-stone-700 mb-1.5">
                    天色與環境光影 (Atmosphere)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'summer', label: '夏日晴空' },
                      { key: 'dawn', label: '晨曦微光' },
                      { key: 'dusk', label: '薄暮夕暮' },
                      { key: 'misty', label: '薄霧山嵐' },
                      { key: 'night', label: '深藍月夜' },
                      { key: 'forest', label: '幽深冷杉' },
                      { key: 'room', label: '靜室清茶' },
                    ].map((atm) => (
                      <button
                        key={atm.key}
                        type="button"
                        onClick={() => setVisualAtmosphere(atm.key as VisualAtmosphere)}
                        className={`py-1.5 px-2 text-xs rounded-md border text-center transition-colors cursor-pointer ${
                          visualAtmosphere === atm.key
                            ? 'bg-stone-900 text-white border-stone-900 font-medium'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {atm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Particle Overlay */}
                <div>
                  <label className="block text-xs font-serif text-stone-700 mb-1.5">
                    畫面動態微質 (Motion Particle)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'dust', label: '光束微塵' },
                      { key: 'steam', label: '蒸氣白煙' },
                      { key: 'grass_sway', label: '青草微波' },
                      { key: 'ripples', label: '水面漣漪' },
                      { key: 'leaves', label: '落葉飄舞' },
                      { key: 'rain_drops', label: '細雨連綿' },
                      { key: 'stars', label: '靜夜星辰' },
                    ].map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => setParticleEffect(p.key as ParticleEffect)}
                        className={`py-1.5 px-2 text-xs rounded-md border text-center transition-colors cursor-pointer ${
                          particleEffect === p.key
                            ? 'bg-stone-800 text-white border-stone-800 font-medium'
                            : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Custom Media (Photo or Video) */}
                <div className="bg-white p-3.5 rounded-lg border border-stone-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-stone-800">
                        <Film className="w-3.5 h-3.5 text-stone-600" />
                        <span>上傳自己的相片或短影片作為動態底圖</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        支援 JPG、PNG 照片，或 MP4、WebM 影片（影片將在留白時靜音循環播放）
                      </p>
                    </div>
                    <label className="px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md cursor-pointer transition-colors flex items-center gap-1 shrink-0">
                      {mediaType === 'video' ? <Video className="w-3.5 h-3.5" /> : <Image className="w-3.5 h-3.5" />}
                      <span>選擇照片/影片</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {mediaUrl && (
                    <div className="mt-3 flex items-center justify-between text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200/60">
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1.5 py-0.5 bg-stone-200 text-stone-800 rounded text-[10px] font-mono uppercase">
                          {mediaType === 'video' ? '影片' : '相片'}
                        </span>
                        <span className="truncate max-w-[220px] font-medium">
                          {mediaFileName || (mediaType === 'video' ? '自訂短影片' : '自訂相片')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaUrl('');
                          setMediaType('none');
                          setMediaFileName('');
                        }}
                        className="text-rose-700 hover:underline ml-2 shrink-0 cursor-pointer"
                      >
                        移除
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Ambient Soundscape & Frequency */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase font-serif tracking-widest text-stone-500">
                    03. 自然聲景與磬音共振
                  </div>
                  <button
                    type="button"
                    onClick={handleTestSound}
                    className="text-xs text-stone-700 hover:text-stone-950 font-medium flex items-center gap-1 cursor-pointer bg-white px-2 py-1 rounded border border-stone-200 shadow-xs"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{isTestingSound ? '播放中...' : '試聽聲景 4 秒'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { key: 'wind', label: '清風' },
                    { key: 'rain', label: '細雨' },
                    { key: 'stream', label: '溪流' },
                    { key: 'crickets', label: '夜蟬' },
                    { key: 'fireplace', label: '柴火' },
                    { key: 'none', label: '純寂' },
                  ].map((snd) => (
                    <button
                      key={snd.key}
                      type="button"
                      onClick={() => setAmbientSound(snd.key as AmbientSoundType)}
                      className={`py-1.5 px-2 text-xs rounded-md border text-center transition-colors cursor-pointer ${
                        ambientSound === snd.key
                          ? 'bg-stone-900 text-white border-stone-900 font-medium'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {snd.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-600">
                  <span className="font-serif">起止磬音頻率：</span>
                  {[
                    { freq: 261.63, label: '261Hz 質樸 C' },
                    { freq: 432, label: '432Hz 自然同調' },
                    { freq: 528, label: '528Hz 愛與修復' },
                  ].map((f) => (
                    <button
                      key={f.freq}
                      type="button"
                      onClick={() => setAmbientFreq(f.freq)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        ambientFreq === f.freq
                          ? 'bg-stone-800 text-white font-medium'
                          : 'bg-stone-200/80 hover:bg-stone-300 text-stone-700'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Duration & Breath Cadence */}
              <div className="space-y-4 pt-4 border-t border-stone-200">
                <div className="text-xs uppercase font-serif tracking-widest text-stone-500">
                  04. 呼吸引導與預設時長
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-serif text-stone-700 mb-1">
                      預設留白時長
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[60, 120, 180, 300].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setDefaultDurationSeconds(sec)}
                          className={`py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                            defaultDurationSeconds === sec
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                          }`}
                        >
                          {sec / 60} 分鐘
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-serif text-stone-700 mb-1">
                      呼吸引導節奏
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { key: '4-4-6', label: '4-4-6 平靜' },
                        { key: '5-5', label: '5-5 同調' },
                        { key: 'free', label: '自由放空' },
                      ].map((cad) => (
                        <button
                          key={cad.key}
                          type="button"
                          onClick={() => setBreathCadence(cad.key as BreathCadence)}
                          className={`py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                            breathCadence === cad.key
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                          }`}
                        >
                          {cad.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Live Real-time Visual Preview */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase font-serif tracking-widest text-stone-500 mb-2">
                  即時畫卷預覽 (Live Atmosphere Preview)
                </div>

                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-stone-300 relative">
                  <ArtisticSceneCanvas customMoment={livePreviewMoment} theme="custom" />
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 mt-4 text-xs font-serif text-stone-600 space-y-2">
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span>聲景配方：</span>
                    <span className="font-medium text-stone-900">
                      {ambientSound} · {ambientFreq}Hz
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span>動態效果：</span>
                    <span className="font-medium text-stone-900">{particleEffect}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 pb-1.5">
                    <span>留白時長：</span>
                    <span className="font-medium text-stone-900">
                      {defaultDurationSeconds / 60} 分鐘
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 italic pt-1">
                    {guidingQuote || '「重要的東西，往往存在於那些看似沒有用處的安靜時光之中。」'}
                  </p>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs md:text-sm font-medium transition-colors shadow-xs"
                >
                  {editingId ? '儲存變更' : '建立我的間時刻'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Saved Custom Moments & Presets */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2 text-xs font-serif text-stone-500">
            <span>已收納的留白時刻</span>
            <span aria-hidden="true">·</span>
            <span>共 {customMoments.length} 款情境</span>
          </div>
          <div className="text-xs text-stone-500 font-serif">
            點擊任一卡片立即沉浸體驗
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customMoments.map((moment) => {
            const isPreferred = preferredMomentId === moment.id;

            return (
              <div
                key={moment.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Visual Canvas Card Header */}
                <div
                  onClick={() => onLaunchMoment(moment)}
                  className="h-44 relative cursor-pointer overflow-hidden border-b border-stone-100"
                >
                  <ArtisticSceneCanvas customMoment={moment} theme="custom" />
                  <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors" />

                  {/* Play pill on hover */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1 bg-stone-900 text-white text-xs font-serif font-medium rounded-md shadow-sm flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" />
                      開啟留白
                    </span>
                  </div>

                  {/* Badges / Indicators */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {moment.isUserCreated ? (
                      <span className="bg-stone-900/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        自創
                      </span>
                    ) : (
                      <span className="bg-amber-900/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        吉卜力典藏
                      </span>
                    )}

                    {moment.mediaType === 'video' && (
                      <span className="bg-stone-900/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                        <Video className="w-2.5 h-2.5" />
                        短影片
                      </span>
                    )}

                    {moment.mediaType === 'image' && (
                      <span className="bg-stone-900/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono flex items-center gap-1">
                        <Image className="w-2.5 h-2.5" />
                        相片
                      </span>
                    )}

                    {isPreferred && (
                      <span className="bg-emerald-800 text-white text-[10px] px-2 py-0.5 rounded font-serif shadow-xs">
                        提醒預設
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Zero-Pill metadata row */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                      <span className="font-serif">{moment.subtitle || '日常留白'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{moment.defaultDurationSeconds / 60} 分鐘</span>
                      <span aria-hidden="true">·</span>
                      <span>{moment.ambientSound}</span>
                    </div>

                    <h3
                      onClick={() => onLaunchMoment(moment)}
                      className="text-lg font-serif font-medium text-stone-900 group-hover:text-stone-700 transition-colors cursor-pointer"
                    >
                      {moment.title}
                    </h3>

                    <p className="text-xs text-stone-600 font-serif mt-2 leading-relaxed line-clamp-2">
                      {moment.description}
                    </p>

                    {moment.guidingQuote && (
                      <div className="mt-2.5 text-[11px] font-serif italic text-stone-500 line-clamp-1 border-l border-stone-300 pl-2">
                        {moment.guidingQuote}
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => onLaunchMoment(moment)}
                      className="text-xs font-serif font-medium text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      進入體驗
                    </button>

                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      {onSetPreferredReminderMoment && (
                        <button
                          onClick={() => onSetPreferredReminderMoment(moment.id)}
                          title="將此時刻設為定時提醒喚醒對象"
                          className={`p-1.5 rounded transition-colors ${
                            isPreferred
                              ? 'text-emerald-800 font-medium'
                              : 'hover:text-stone-900 hover:bg-stone-100'
                          }`}
                        >
                          設為提醒
                        </button>
                      )}

                      {moment.isUserCreated && (
                        <>
                          <button
                            onClick={() => handleEdit(moment)}
                            title="編輯"
                            className="p-1.5 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteMoment(moment.id)}
                            title="刪除"
                            className="p-1.5 hover:text-rose-800 hover:bg-stone-100 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
