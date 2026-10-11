import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Sparkles, Feather, Clock, Check, RefreshCw } from 'lucide-react';
import { SceneTheme, CustomMaMoment, AmbientSoundType, BreathCadence } from '../types';
import { soundEngine } from '../utils/audioEngine';
import { ArtisticSceneCanvas } from './ArtisticSceneCanvas';

interface MaImmersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordMoment: (data: {
    durationSeconds: number;
    sceneTheme: SceneTheme;
    customMomentId?: string;
    suggestedTitle?: string;
  }) => void;
  initialTheme?: SceneTheme;
  initialDuration?: number;
  activeCustomMoment?: CustomMaMoment | null;
}

const IMMERSION_QUOTES = [
  '「重要的東西，往往存在於那些看似沒有用處的安靜時光之中。」',
  '「拍手與拍手之間的空隙，就是『間』。若一味只有動作，那就只是喧囂。」',
  '「世界並不是只有向前奔跑一種姿態，風停下來的時候，青草依然在呼吸。」',
  '「給心靈留出一片水面，讓浮躁慢慢沉底，映照出澄澈的藍天。」',
  '「什麼事也不做，並不是浪費，而是找回我們作為人的敏銳知覺。」',
];

export const MaImmersionModal: React.FC<MaImmersionModalProps> = ({
  isOpen,
  onClose,
  onRecordMoment,
  initialTheme = 'train',
  initialDuration = 60,
  activeCustomMoment,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<SceneTheme>(initialTheme);
  const [targetSeconds, setTargetSeconds] = useState<number>(initialDuration); // 0 = freeflow
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('wind');
  const [breathPhase, setBreathPhase] = useState<'吸' | '屏息' | '呼'>('吸');
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  const ambientStopRef = useRef<(() => void) | null>(null);

  // Sync initial configuration
  useEffect(() => {
    if (isOpen) {
      if (activeCustomMoment) {
        setSelectedTheme('custom');
        setTargetSeconds(activeCustomMoment.defaultDurationSeconds || 120);
        setAmbientSound(activeCustomMoment.ambientSound || 'wind');
      } else {
        setSelectedTheme(initialTheme);
        setTargetSeconds(initialDuration);
        setAmbientSound(
          initialTheme === 'rain'
            ? 'rain'
            : initialTheme === 'sea'
            ? 'stream'
            : initialTheme === 'tea'
            ? 'none'
            : 'wind'
        );
      }

      setElapsedSeconds(0);
      setIsCompleted(false);
      setIsActive(true);

      // Bell chime with specified or default frequency
      const freq = activeCustomMoment?.ambientFreq || 261.63;
      soundEngine.playSingingBowl(freq, 6);
    } else {
      setIsActive(false);
      if (ambientStopRef.current) {
        ambientStopRef.current();
        ambientStopRef.current = null;
      }
    }
  }, [isOpen, initialTheme, initialDuration, activeCustomMoment]);

  // Handle ambient sound synthesis
  useEffect(() => {
    if (!isOpen || !isActive) {
      if (ambientStopRef.current) {
        ambientStopRef.current();
        ambientStopRef.current = null;
      }
      return;
    }

    if (ambientStopRef.current) {
      ambientStopRef.current();
      ambientStopRef.current = null;
    }

    if (ambientSound === 'wind') {
      ambientStopRef.current = soundEngine.startWind();
    } else if (ambientSound === 'rain') {
      ambientStopRef.current = soundEngine.startRain();
    } else if (ambientSound === 'stream') {
      ambientStopRef.current = soundEngine.startStream();
    } else if (ambientSound === 'crickets') {
      ambientStopRef.current = soundEngine.startCrickets();
    } else if (ambientSound === 'fireplace') {
      ambientStopRef.current = soundEngine.startFireplace();
    }

    return () => {
      if (ambientStopRef.current) {
        ambientStopRef.current();
        ambientStopRef.current = null;
      }
    };
  }, [isOpen, isActive, ambientSound]);

  // Timer interval
  useEffect(() => {
    if (!isOpen || !isActive || isCompleted) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (targetSeconds > 0 && next >= targetSeconds) {
          setIsCompleted(true);
          setIsActive(false);
          const completionFreq = (activeCustomMoment?.ambientFreq || 261.63) * 1.25;
          soundEngine.playSingingBowl(completionFreq, 7);
          return targetSeconds;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, targetSeconds, isCompleted, activeCustomMoment]);

  // Breathing guide cycle based on cadence
  const cadence: BreathCadence = activeCustomMoment?.breathCadence || '4-4-6';

  useEffect(() => {
    if (!isOpen || !isActive || cadence === 'free') return;

    let inDuration = 4000;
    let holdDuration = 4000;
    let outDuration = 6000;

    if (cadence === '5-5') {
      inDuration = 5000;
      holdDuration = 0;
      outDuration = 5000;
    } else if (cadence === '4-7-8') {
      inDuration = 4000;
      holdDuration = 7000;
      outDuration = 8000;
    }

    const totalCycle = inDuration + holdDuration + outDuration;

    const breathCycle = () => {
      setBreathPhase('吸');
      let t1: NodeJS.Timeout | null = null;
      let t2: NodeJS.Timeout | null = null;

      if (holdDuration > 0) {
        t1 = setTimeout(() => {
          setBreathPhase('屏息');
        }, inDuration);
        t2 = setTimeout(() => {
          setBreathPhase('呼');
        }, inDuration + holdDuration);
      } else {
        t2 = setTimeout(() => {
          setBreathPhase('呼');
        }, inDuration);
      }

      return () => {
        if (t1) clearTimeout(t1);
        if (t2) clearTimeout(t2);
      };
    };

    const cleanup = breathCycle();
    const interval = setInterval(breathCycle, totalCycle);

    return () => {
      cleanup();
      clearInterval(interval);
    };
  }, [isOpen, isActive, cadence]);

  // Quote rotation
  useEffect(() => {
    if (!isOpen) return;
    const qInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % IMMERSION_QUOTES.length);
    }, 25000);
    return () => clearInterval(qInterval);
  }, [isOpen]);

  if (!isOpen) return null;

  const remainingSeconds = targetSeconds > 0 ? Math.max(0, targetSeconds - elapsedSeconds) : elapsedSeconds;
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = targetSeconds > 0 ? Math.min(100, (elapsedSeconds / targetSeconds) * 100) : 100;

  const currentQuote = activeCustomMoment?.guidingQuote || IMMERSION_QUOTES[quoteIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md p-4 md:p-8 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FBF9F5] rounded-2xl shadow-2xl overflow-hidden border border-stone-300 flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F7F4EE]">
          <div className="flex items-center gap-3">
            <span className="text-base font-serif font-medium text-stone-900 tracking-wide">
              {activeCustomMoment ? activeCustomMoment.title : '間刻體驗 · Stillness'}
            </span>
            <span className="text-xs text-stone-500 hidden sm:inline">
              {activeCustomMoment?.subtitle || '刻意安排的靜謐時刻'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Ambient Sound Selector */}
            <div className="flex items-center bg-stone-200/70 p-1 rounded-lg text-xs font-medium text-stone-700">
              <button
                onClick={() => setAmbientSound('wind')}
                className={`px-2 py-1 rounded transition-colors ${
                  ambientSound === 'wind' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-950'
                }`}
              >
                微風
              </button>
              <button
                onClick={() => setAmbientSound('rain')}
                className={`px-2 py-1 rounded transition-colors ${
                  ambientSound === 'rain' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-950'
                }`}
              >
                細雨
              </button>
              <button
                onClick={() => setAmbientSound('stream')}
                className={`px-2 py-1 rounded transition-colors ${
                  ambientSound === 'stream' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-950'
                }`}
              >
                清泉
              </button>
              <button
                onClick={() => setAmbientSound('crickets')}
                className={`px-2 py-1 rounded transition-colors ${
                  ambientSound === 'crickets' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-950'
                }`}
              >
                夜蟬
              </button>
              <button
                onClick={() => setAmbientSound('fireplace')}
                className={`px-2 py-1 rounded transition-colors ${
                  ambientSound === 'fireplace' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-950'
                }`}
              >
                柴火
              </button>
              <button
                onClick={() => setAmbientSound('none')}
                className={`px-2 py-1 rounded transition-colors ${
                  ambientSound === 'none' ? 'bg-white text-stone-900 shadow-xs' : 'hover:text-stone-950'
                }`}
              >
                純寂
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 rounded-lg transition-colors cursor-pointer"
              aria-label="離開"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Canvas Presentation */}
        <div className="relative flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          {/* Visual Scene Canvas */}
          <div className="relative w-full aspect-[16/9] max-h-[380px] rounded-xl overflow-hidden shadow-inner border border-stone-300/80">
            {activeCustomMoment ? (
              <ArtisticSceneCanvas customMoment={activeCustomMoment} theme="custom" />
            ) : (
              <ArtisticSceneCanvas theme={selectedTheme} />
            )}

            {/* Breath Pacer Overlay */}
            {isActive && !isCompleted && cadence !== 'free' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-24 h-24 rounded-full border border-white/40 flex items-center justify-center transition-all duration-1000 backdrop-blur-[1px]"
                  style={{
                    transform:
                      breathPhase === '吸'
                        ? 'scale(1.35)'
                        : breathPhase === '屏息'
                        ? 'scale(1.35)'
                        : 'scale(0.85)',
                    backgroundColor:
                      breathPhase === '吸'
                        ? 'rgba(255,255,255,0.18)'
                        : breathPhase === '屏息'
                        ? 'rgba(255,255,255,0.25)'
                        : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <span className="text-white text-xs font-serif tracking-widest drop-shadow-sm font-medium">
                    {breathPhase}
                  </span>
                </div>
              </div>
            )}

            {/* Completion Screen Banner */}
            {isCompleted && (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white mb-3">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-white font-medium mb-1">
                  間刻已至 · 餘韻悠長
                </h3>
                <p className="text-sm text-stone-200 max-w-md font-serif-cjk">
                  在剛才這段空白裡，你感受到了什麼？讓這份平靜在接下來的生活裡繼續呼吸。
                </p>
              </div>
            )}
          </div>

          {/* Center Cadence & Quote */}
          <div className="mt-5 text-center px-4">
            <div className="text-3xl md:text-4xl font-serif font-light tracking-widest tabular-nums text-stone-800">
              {targetSeconds > 0 ? formattedTime : `+ ${formattedTime}`}
            </div>
            {targetSeconds > 0 && (
              <div className="w-48 h-1 bg-stone-200 rounded-full mx-auto mt-2 overflow-hidden">
                <div
                  className="h-full bg-stone-700 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}

            <p className="text-xs md:text-sm font-serif italic text-stone-600 mt-3 max-w-xl mx-auto transition-opacity duration-700 leading-relaxed">
              {currentQuote}
            </p>
          </div>

          {/* Scene Switcher & Time Selection (when not fixed custom moment) */}
          <div className="mt-6 pt-5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-4">
            {/* Scene Theme Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-500 font-serif mr-1">氛圍：</span>
              {[
                { key: 'train', label: '水上電車' },
                { key: 'rain', label: '簷下細雨' },
                { key: 'grass', label: '晴丘微風' },
                { key: 'tea', label: '靜室清茶' },
                { key: 'sea', label: '碧海潮息' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setSelectedTheme(item.key as SceneTheme);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                    selectedTheme === item.key
                      ? 'bg-stone-900 text-stone-50 font-medium'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-stone-500 font-serif mr-1">留白時長：</span>
              {[
                { sec: 60, label: '1 分鐘' },
                { sec: 180, label: '3 分鐘' },
                { sec: 300, label: '5 分鐘' },
                { sec: 0, label: '自由' },
              ].map((t) => (
                <button
                  key={t.sec}
                  onClick={() => {
                    setTargetSeconds(t.sec);
                    setElapsedSeconds(0);
                    setIsCompleted(false);
                    setIsActive(true);
                  }}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                    targetSeconds === t.sec
                      ? 'bg-stone-800 text-white font-medium'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="px-6 py-4 bg-[#F7F4EE] border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 font-serif">
            {isActive ? '聆聽環境聲，放鬆肩頸，凝視眼前的畫面' : isCompleted ? '完成留白' : '準備開始'}
          </div>

          <div className="flex items-center gap-3">
            {isCompleted ? (
              <>
                <button
                  onClick={() => {
                    setElapsedSeconds(0);
                    setIsCompleted(false);
                    setIsActive(true);
                    soundEngine.playSingingBowl(activeCustomMoment?.ambientFreq || 261.63, 6);
                  }}
                  className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-200/80 rounded-lg hover:bg-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  再次體驗
                </button>
                <button
                  onClick={() => {
                    onRecordMoment({
                      durationSeconds: targetSeconds > 0 ? targetSeconds : elapsedSeconds,
                      sceneTheme: selectedTheme,
                      customMomentId: activeCustomMoment?.id,
                      suggestedTitle: activeCustomMoment ? activeCustomMoment.title : undefined,
                    });
                    onClose();
                  }}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Feather className="w-3.5 h-3.5" />
                  記錄此時感悟
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onRecordMoment({
                    durationSeconds: Math.max(15, elapsedSeconds),
                    sceneTheme: selectedTheme,
                    customMomentId: activeCustomMoment?.id,
                    suggestedTitle: activeCustomMoment ? activeCustomMoment.title : undefined,
                  });
                  onClose();
                }}
                className="px-4 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg transition-colors cursor-pointer"
              >
                記下手帳並結束
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
