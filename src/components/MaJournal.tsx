import React, { useState } from 'react';
import { Feather, Plus, Download, Upload, Trash2, Share2, Search, Filter, BookOpen, Clock, MapPin, Sparkles, Image, Video, Film } from 'lucide-react';
import { MaRecord, SceneTheme } from '../types';
import { ArtisticSceneCanvas } from './ArtisticSceneCanvas';

interface MaJournalProps {
  records: MaRecord[];
  onAddRecord: (record: Omit<MaRecord, 'id' | 'timestamp'>) => void;
  onDeleteRecord: (id: string) => void;
  onImportRecords: (records: MaRecord[]) => void;
  prefillDraft?: { durationSeconds: number; sceneTheme: SceneTheme } | null;
  onClearPrefill?: () => void;
}

const EVOCATIVE_PROMPTS = [
  '午後微風吹拂窗簾的一瞬',
  '看著熱茶蒸氣在光束中散開',
  '雨中等紅綠燈時傘頂的滴答聲',
  '電車越過水面時窗外的無名飛鳥',
  '仰望晴空時積雨雲微妙的變形',
  '傍晚大樓外牆漸漸暗淡的晚霞',
];

const MOOD_TAGS = ['全部', '澄澈', '靜謐', '釋然', '微風', '孤獨之美', '茶香', '無思'];

export const MaJournal: React.FC<MaJournalProps> = ({
  records,
  onAddRecord,
  onDeleteRecord,
  onImportRecords,
  prefillDraft,
  onClearPrefill,
}) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(!!prefillDraft);
  const [activeMoodFilter, setActiveMoodFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCardForShare, setSelectedCardForShare] = useState<MaRecord | null>(null);

  // Form State
  const [title, setTitle] = useState<string>(prefillDraft ? '剛才的靜默片刻' : '');
  const [note, setNote] = useState<string>('');
  const [observation, setObservation] = useState<string>('');
  const [location, setLocation] = useState<string>('窗邊');
  const [moodTag, setMoodTag] = useState<string>('靜謐');
  const [sceneTheme, setSceneTheme] = useState<SceneTheme>(prefillDraft?.sceneTheme || 'tea');
  const [durationSeconds, setDurationSeconds] = useState<number>(prefillDraft?.durationSeconds || 60);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('none');
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [mediaFileName, setMediaFileName] = useState<string>('');

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? 40 * 1024 * 1024 : 8 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(isVideo ? '影片檔案較大，請選擇 40MB 以內的短影片' : '照片請選擇 8MB 以內檔案');
        return;
      }
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          setMediaUrl(event.target?.result as string);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddRecord({
      title: title.trim(),
      note: note.trim() || '在這個靜謐的時刻，什麼也沒有做，只是安靜地呼吸與凝視。',
      observation: observation.trim() || '微風在光影間留下了安靜的痕跡。',
      location: location.trim() || '未記錄之地',
      moodTag,
      sceneTheme,
      durationSeconds,
      mediaType: mediaType !== 'none' ? mediaType : undefined,
      mediaUrl: mediaUrl || undefined,
    });

    // Reset Form
    setTitle('');
    setNote('');
    setObservation('');
    setLocation('窗邊');
    setMediaType('none');
    setMediaUrl('');
    setMediaFileName('');
    setIsFormOpen(false);
    if (onClearPrefill) onClearPrefill();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ma-journal-records-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportRecords(parsed);
          }
        } catch (err) {
          alert('匯入格式不正確');
        }
      };
    }
  };

  // Filtered Records
  const filteredRecords = records.filter((r) => {
    const matchesMood = activeMoodFilter === '全部' || r.moodTag === activeMoodFilter;
    const matchesSearch =
      searchQuery === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.observation && r.observation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMood && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header and Action Ribbon */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-serif text-stone-500 mb-1">
            <span>VOL. 留白誌</span>
            <span aria-hidden="true">·</span>
            <span>共有 {records.length} 則間刻記錄</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif text-stone-900 font-medium tracking-tight">
            間刻手帳 · 捕捉日常的留白
          </h2>
          <p className="text-sm text-stone-600 font-serif mt-1 max-w-xl">
            記錄那些「沒有台詞、沒有動作」的片刻。當你在水滴、茶煙或風聲裡駐足，你的時間便在此駐留。
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg cursor-pointer transition-colors flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>匯入</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          <button
            onClick={handleExportJSON}
            className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="備份手帳為 JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>備份</span>
          </button>

          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2 text-xs md:text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>手動記下一刻</span>
          </button>
        </div>
      </div>

      {/* Write New Record Modal / Drawer Form */}
      {isFormOpen && (
        <div className="bg-[#F7F4EE] border border-stone-300 rounded-2xl p-6 md:p-8 shadow-sm transition-all animate-fadeIn">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-200/80">
            <div className="flex items-center gap-2">
              <Feather className="w-4 h-4 text-stone-700" />
              <h3 className="text-lg font-serif font-medium text-stone-900">
                記下一段「間」時刻
              </h3>
            </div>
            <button
              onClick={() => {
                setIsFormOpen(false);
                if (onClearPrefill) onClearPrefill();
              }}
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              取消收起
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Quick Inspiration Pills */}
            <div>
              <label className="block text-xs font-serif text-stone-500 mb-2">
                捕捉靈感（點擊快速代入）：
              </label>
              <div className="flex flex-wrap gap-2">
                {EVOCATIVE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => {
                      setTitle(prompt);
                      if (prompt.includes('茶')) setSceneTheme('tea');
                      else if (prompt.includes('雨')) setSceneTheme('rain');
                      else if (prompt.includes('風') || prompt.includes('草')) setSceneTheme('grass');
                      else if (prompt.includes('電車') || prompt.includes('水面')) setSceneTheme('train');
                    }}
                    className="text-xs bg-white/80 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif text-stone-600 mb-1">
                  刻度標題 (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如：午後窗欞上映著的樹影"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-sm focus:outline-none focus:ring-1 focus:ring-stone-600 text-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 mb-1">
                  發生地點或情境 (Location)
                </label>
                <input
                  type="text"
                  placeholder="例如：捷運車廂、書房窗前、山林步道"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-sm focus:outline-none focus:ring-1 focus:ring-stone-600 text-stone-800"
                />
              </div>
            </div>

            {/* Observation: What did you hear/see */}
            <div>
              <label className="block text-xs font-serif text-stone-600 mb-1">
                靜默中的微小感知 (Observation)
              </label>
              <input
                type="text"
                placeholder="在那個無聲的片刻裡，你注意到了什麼細節？（例如：水滴在冷杉葉梢凝聚成圓形的一刻）"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-sm focus:outline-none focus:ring-1 focus:ring-stone-600 text-stone-800"
              />
            </div>

            {/* Note & Reflections */}
            <div>
              <label className="block text-xs font-serif text-stone-600 mb-1">
                心境隨筆 (Reflections)
              </label>
              <textarea
                rows={3}
                placeholder="寫下你的呼吸、這段空白帶給大腦的舒展..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-stone-300 text-sm focus:outline-none focus:ring-1 focus:ring-stone-600 text-stone-800 font-serif leading-relaxed"
              />
            </div>

            {/* Media Upload: Photo or Video */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-stone-800">
                    <Film className="w-3.5 h-3.5 text-stone-600" />
                    <span>上傳留白瞬間的照片或微影片</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    支援現場拍攝的照片（JPG/PNG）或短影片（MP4/WebM，靜音留白循環）
                  </p>
                </div>
                <label className="px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md cursor-pointer transition-colors flex items-center gap-1 shrink-0 self-start sm:self-center">
                  {mediaType === 'video' ? <Video className="w-3.5 h-3.5" /> : <Image className="w-3.5 h-3.5" />}
                  <span>選擇照片/短片</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {mediaUrl && (
                <div className="mt-3 flex items-center justify-between text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <div className="flex items-center gap-2 truncate">
                    <span className="px-1.5 py-0.5 bg-stone-200 text-stone-800 rounded text-[10px] font-mono uppercase">
                      {mediaType === 'video' ? '短片' : '照片'}
                    </span>
                    <span className="truncate max-w-[240px] font-medium">
                      {mediaFileName || (mediaType === 'video' ? '自訂短影片' : '自訂照片')}
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

            {/* Theme, Mood & Duration Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-serif text-stone-600 mb-1">
                  畫卷意象 (Scene Theme)
                </label>
                <select
                  value={sceneTheme}
                  onChange={(e) => setSceneTheme(e.target.value as SceneTheme)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 text-xs focus:outline-none text-stone-800"
                >
                  <option value="tea">靜室清茶</option>
                  <option value="rain">簷下微雨</option>
                  <option value="train">水上電車</option>
                  <option value="grass">晴丘草風</option>
                  <option value="sea">碧海浪聲</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 mb-1">
                  心境調性 (Mood)
                </label>
                <select
                  value={moodTag}
                  onChange={(e) => setMoodTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-stone-300 text-xs focus:outline-none text-stone-800"
                >
                  {MOOD_TAGS.filter((t) => t !== '全部').map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif text-stone-600 mb-1">
                  留白時間 (Duration)
                </label>
                <div className="flex gap-2">
                  {[60, 120, 180, 300].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setDurationSeconds(sec)}
                      className={`flex-1 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                        durationSeconds === sec
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {sec < 60 ? `${sec}秒` : `${sec / 60}分鐘`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  if (onClearPrefill) onClearPrefill();
                }}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs md:text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs transition-colors"
              >
                儲存間刻
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
        {/* Mood filter tabs (Interactive Segmented Buttons) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {MOOD_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveMoodFilter(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeMoodFilter === tag
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋記憶與細節..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-stone-100/80 border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-stone-500 text-stone-800"
          />
        </div>
      </div>

      {/* Records Timeline Grid */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white/60 border border-stone-200/80 rounded-2xl">
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <h4 className="text-base font-serif text-stone-700 font-medium">尚未找到相符的間刻記錄</h4>
          <p className="text-xs text-stone-500 font-serif mt-1">
            你可以嘗試切換心境標籤，或點擊上方「手動記下一刻」記下你今天的留白。
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => {
            const dateObj = new Date(record.timestamp);
            const dateStr = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;
            const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;

            return (
              <article
                key={record.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                {/* Mini Artistic Theme Header */}
                <div className="h-28 relative overflow-hidden border-b border-stone-100">
                  <ArtisticSceneCanvas
                    theme={record.sceneTheme}
                    mediaType={record.mediaType}
                    mediaUrl={record.mediaUrl}
                  />

                  {/* Media Indicator Badge */}
                  {record.mediaType === 'video' && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] rounded font-mono">
                      <Video className="w-2.5 h-2.5" />
                      <span>動態留白</span>
                    </div>
                  )}
                  {record.mediaType === 'image' && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] rounded font-mono">
                      <Image className="w-2.5 h-2.5" />
                      <span>相片記錄</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90">
                    <button
                      onClick={() => setSelectedCardForShare(record)}
                      title="生成美學卡片"
                      className="p-1.5 bg-stone-900/60 hover:bg-stone-900 text-white rounded-md backdrop-blur-xs transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteRecord(record.id)}
                      title="刪除記錄"
                      className="p-1.5 bg-stone-900/60 hover:bg-rose-900 text-white rounded-md backdrop-blur-xs transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Zero-Pill Metadata Line (Strict Section 1.A Compliance) */}
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                      <span className="font-mono tabular-nums">{dateStr} {timeStr}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.location}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-stone-700 font-medium">{record.moodTag}</span>
                    </div>

                    <h3 className="text-lg font-serif font-medium text-stone-900 leading-snug mb-2 group-hover:text-stone-700 transition-colors">
                      {record.title}
                    </h3>

                    {/* Quiet sensory observation */}
                    {record.observation && (
                      <div className="text-xs font-serif italic text-stone-600 mb-3 pl-3 border-l-2 border-stone-300 leading-relaxed">
                        「{record.observation}」
                      </div>
                    )}

                    <p className="text-xs md:text-sm text-stone-600 font-serif leading-relaxed line-clamp-3">
                      {record.note}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-serif">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>留白 {Math.round(record.durationSeconds / 60)} 分鐘</span>
                    </div>
                    <button
                      onClick={() => setSelectedCardForShare(record)}
                      className="text-stone-800 hover:underline text-xs"
                    >
                      明信片視角 →
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Aesthetic Postcard Modal (間刻明信片) */}
      {selectedCardForShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-stone-300 rounded-2xl p-8 shadow-2xl">
            <button
              onClick={() => setSelectedCardForShare(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 p-1"
            >
              ✕
            </button>

            {/* Postcard Layout */}
            <div className="border border-stone-300/80 p-6 bg-[#FBF9F5] shadow-inner relative">
              {/* Header stamp */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 text-xs font-serif text-stone-500">
                <span>間刻記憶 · STILLNESS RECORD</span>
                <span className="font-mono">
                  {new Date(selectedCardForShare.timestamp).toLocaleDateString('zh-TW')}
                </span>
              </div>

              {/* Scene banner */}
              <div className="my-4 h-36 rounded-lg overflow-hidden border border-stone-200 relative">
                <ArtisticSceneCanvas
                  theme={selectedCardForShare.sceneTheme}
                  mediaType={selectedCardForShare.mediaType}
                  mediaUrl={selectedCardForShare.mediaUrl}
                />
              </div>

              {/* Title & Observation */}
              <h3 className="text-xl font-serif font-semibold text-stone-900 mt-2 mb-2">
                {selectedCardForShare.title}
              </h3>

              {selectedCardForShare.observation && (
                <div className="text-sm font-serif italic text-stone-700 bg-stone-100/80 p-3 rounded-lg mb-3">
                  {selectedCardForShare.observation}
                </div>
              )}

              <p className="text-xs text-stone-600 font-serif leading-relaxed mb-4">
                {selectedCardForShare.note}
              </p>

              {/* Stamp and Details */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <div>
                  地點：{selectedCardForShare.location} · 留白 {selectedCardForShare.durationSeconds} 秒
                </div>
                <div className="w-10 h-10 rounded-full border border-red-800/60 text-red-800/80 flex items-center justify-center text-[10px] font-serif font-bold rotate-12">
                  間刻
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCardForShare(null)}
                className="px-4 py-1.5 text-xs text-stone-600 hover:text-stone-900 font-medium"
              >
                關閉
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `【間刻 · 宮崎駿的空白時刻】\n標題：${selectedCardForShare.title}\n感知：${selectedCardForShare.observation || ''}\n地點：${selectedCardForShare.location}\n留白時間：${selectedCardForShare.durationSeconds}秒`
                  );
                  alert('已複製手帳文字至剪貼簿！');
                }}
                className="px-4 py-1.5 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors"
              >
                複製文字隨筆
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
