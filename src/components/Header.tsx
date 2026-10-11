import React from 'react';
import { Sparkles, Bell, Volume2, VolumeX } from 'lucide-react';

interface HeaderProps {
  currentTab: 'immersion' | 'custom' | 'journal' | 'reminder' | 'philosophy';
  onSelectTab: (tab: 'immersion' | 'custom' | 'journal' | 'reminder' | 'philosophy') => void;
  onInstantMa: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  reminderActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onInstantMa,
  isMuted,
  onToggleMute,
  reminderActive,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display serif */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('immersion');
          }}
          className="text-xl md:text-2xl font-serif tracking-tight text-stone-900 hover:text-stone-700 transition-colors"
        >
          間刻 · Ma
        </a>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('immersion')}
            className={`transition-colors hover:text-stone-900 ${
              currentTab === 'immersion'
                ? 'text-stone-900 underline underline-offset-8 decoration-stone-800 decoration-1 font-semibold'
                : 'text-stone-600'
            }`}
          >
            留白體驗
          </button>
          <button
            onClick={() => onSelectTab('custom')}
            className={`transition-colors hover:text-stone-900 ${
              currentTab === 'custom'
                ? 'text-stone-900 underline underline-offset-8 decoration-stone-800 decoration-1 font-semibold'
                : 'text-stone-600'
            }`}
          >
            自創時刻
          </button>
          <button
            onClick={() => onSelectTab('journal')}
            className={`transition-colors hover:text-stone-900 ${
              currentTab === 'journal'
                ? 'text-stone-900 underline underline-offset-8 decoration-stone-800 decoration-1 font-semibold'
                : 'text-stone-600'
            }`}
          >
            間刻手帳
          </button>
          <button
            onClick={() => onSelectTab('reminder')}
            className={`flex items-center gap-1.5 transition-colors hover:text-stone-900 ${
              currentTab === 'reminder'
                ? 'text-stone-900 underline underline-offset-8 decoration-stone-800 decoration-1 font-semibold'
                : 'text-stone-600'
            }`}
          >
            提醒節律
            {reminderActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" title="定時提醒已啟動" />
            )}
          </button>
          <button
            onClick={() => onSelectTab('philosophy')}
            className={`transition-colors hover:text-stone-900 ${
              currentTab === 'philosophy'
                ? 'text-stone-900 underline underline-offset-8 decoration-stone-800 decoration-1 font-semibold'
                : 'text-stone-600'
            }`}
          >
            宮崎駿的「間」
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? '取消靜音' : '靜音'}
            title={isMuted ? '音效已靜音' : '環境音已開啟'}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-200/50 rounded-lg transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onInstantMa}
            className="px-4 py-2 text-xs md:text-sm font-medium text-[#FBF9F5] bg-[#292524] rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 opacity-80" />
            <span>進入間時刻</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar row for touch screens */}
      <div className="md:hidden flex items-center justify-around pt-3 mt-2 border-t border-stone-200/60 text-xs font-medium text-stone-600">
        <button
          onClick={() => onSelectTab('immersion')}
          className={`pb-1 ${currentTab === 'immersion' ? 'text-stone-900 font-bold border-b border-stone-900' : ''}`}
        >
          體驗
        </button>
        <button
          onClick={() => onSelectTab('custom')}
          className={`pb-1 ${currentTab === 'custom' ? 'text-stone-900 font-bold border-b border-stone-900' : ''}`}
        >
          自創
        </button>
        <button
          onClick={() => onSelectTab('journal')}
          className={`pb-1 ${currentTab === 'journal' ? 'text-stone-900 font-bold border-b border-stone-900' : ''}`}
        >
          手帳
        </button>
        <button
          onClick={() => onSelectTab('reminder')}
          className={`pb-1 flex items-center gap-1 ${currentTab === 'reminder' ? 'text-stone-900 font-bold border-b border-stone-900' : ''}`}
        >
          提醒
          {reminderActive && <span className="w-1 h-1 rounded-full bg-emerald-600" />}
        </button>
        <button
          onClick={() => onSelectTab('philosophy')}
          className={`pb-1 ${currentTab === 'philosophy' ? 'text-stone-900 font-bold border-b border-stone-900' : ''}`}
        >
          典故
        </button>
      </div>
    </header>
  );
};
