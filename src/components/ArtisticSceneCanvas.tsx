import React from 'react';
import { SceneTheme, CustomMaMoment, ParticleEffect, VisualAtmosphere } from '../types';

interface ArtisticSceneCanvasProps {
  theme?: SceneTheme;
  customMoment?: CustomMaMoment;
  mediaType?: 'image' | 'video' | 'none';
  mediaUrl?: string;
  interactive?: boolean;
}

export const ArtisticSceneCanvas: React.FC<ArtisticSceneCanvasProps> = ({
  theme = 'train',
  customMoment,
  mediaType: propMediaType,
  mediaUrl: propMediaUrl,
}) => {
  const activeMediaUrl = customMoment?.mediaUrl || customMoment?.customImageUrl || propMediaUrl;
  const isVideo =
    customMoment?.mediaType === 'video' ||
    propMediaType === 'video' ||
    (activeMediaUrl && (activeMediaUrl.startsWith('data:video') || activeMediaUrl.includes('.mp4') || activeMediaUrl.includes('.webm')));

  // If customMoment is provided, or theme is custom, or user uploaded custom media for this scene
  if (customMoment || theme === 'custom' || activeMediaUrl) {
    const atmosphere = customMoment?.visualAtmosphere || 'dawn';
    const particle = customMoment?.particleEffect || 'dust';
    const title = customMoment?.title || '留白時光';
    const subtitle = customMoment?.subtitle || customMoment?.description || '';

    // Atmospheric Backgrounds
    const getAtmosphereBg = (atm: VisualAtmosphere) => {
      switch (atm) {
        case 'dawn':
          return 'bg-gradient-to-b from-[#D49B8D] via-[#E2BFA8] to-[#8FA29A]';
        case 'dusk':
          return 'bg-gradient-to-b from-[#3E3048] via-[#784D63] to-[#C9806F]';
        case 'misty':
          return 'bg-gradient-to-b from-[#3E4C52] via-[#5C6E75] to-[#83979E]';
        case 'night':
          return 'bg-gradient-to-b from-[#0B132B] via-[#1C2541] to-[#080C1B]';
        case 'forest':
          return 'bg-gradient-to-b from-[#192A20] via-[#2D4536] to-[#121E17]';
        case 'room':
          return 'bg-gradient-to-b from-[#E5DEC7] via-[#D3C7A9] to-[#AD9E7F]';
        case 'summer':
        default:
          return 'bg-gradient-to-b from-[#7FB6CE] via-[#C4DEE8] to-[#99BF7C]';
      }
    };

    return (
      <div className={`relative w-full h-full overflow-hidden rounded-xl ${getAtmosphereBg(atmosphere)} select-none`}>
        {/* If user provided custom video or photo */}
        {activeMediaUrl ? (
          <div className="absolute inset-0">
            {isVideo ? (
              <video
                src={activeMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover filter brightness-90 contrast-95"
              />
            ) : (
              <img
                src={activeMediaUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter brightness-90 contrast-95"
              />
            )}
            <div className="absolute inset-0 bg-stone-950/30 backdrop-blur-[0.5px]" />
          </div>
        ) : (
          /* Subtle organic mountain/hill backdrop */
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <div className="absolute -bottom-10 -left-12 -right-12 h-36 bg-black/25 rounded-t-[100%] transform -rotate-1" />
            <div className="absolute top-10 left-10 w-64 h-24 bg-white/20 rounded-full blur-xl animate-float" />
          </div>
        )}

        {/* Dynamic Particle Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {particle === 'steam' && (
            <div className="absolute inset-0 flex justify-center items-end pb-8">
              <div className="w-1.5 h-36 bg-white/40 rounded-full blur-md animate-breathe" style={{ animationDuration: '4s' }} />
              <div className="w-2 h-44 bg-white/30 rounded-full blur-lg animate-breathe ml-3" style={{ animationDuration: '5.5s', animationDelay: '1s' }} />
              <div className="w-1.5 h-32 bg-white/35 rounded-full blur-sm animate-breathe -ml-6" style={{ animationDuration: '4.8s', animationDelay: '2s' }} />
            </div>
          )}

          {particle === 'leaves' && (
            <div className="absolute inset-0">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-2 bg-[#D97706]/70 rounded-full animate-float transform rotate-45"
                  style={{
                    top: `${(i * 9) % 85}%`,
                    left: `${(i * 13 + 5) % 90}%`,
                    animationDuration: `${7 + (i % 5) * 2}s`,
                    animationDelay: `${(i * 0.9)}s`,
                  }}
                />
              ))}
            </div>
          )}

          {particle === 'rain_drops' && (
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-[1px] bg-gradient-to-b from-transparent via-white/80 to-transparent"
                  style={{
                    height: `${24 + (i % 4) * 10}px`,
                    left: `${(i * 5) + 3}%`,
                    top: `${(i * 15) % 80}%`,
                    transform: 'rotate(12deg)',
                    animation: `breathe ${2 + (i % 3)}s infinite ease-in-out`
                  }}
                />
              ))}
              <div className="absolute bottom-6 left-1/3 w-32 h-6 border border-white/30 rounded-full animate-ripple" />
            </div>
          )}

          {particle === 'ripples' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 border border-white/30 rounded-full animate-ripple" style={{ animationDuration: '4.5s' }} />
              <div className="w-28 h-28 border border-white/25 rounded-full animate-ripple" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }} />
              <div className="w-28 h-28 border border-white/15 rounded-full animate-ripple" style={{ animationDuration: '4.5s', animationDelay: '3s' }} />
            </div>
          )}

          {particle === 'dust' && (
            <div className="absolute inset-0">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/75 rounded-full blur-[0.4px] animate-float"
                  style={{
                    top: `${15 + (i * 6)}%`,
                    left: `${20 + (i * 8)}%`,
                    animationDuration: `${6 + (i % 4) * 2}s`,
                    animationDelay: `${i * 0.6}s`,
                  }}
                />
              ))}
            </div>
          )}

          {particle === 'grass_sway' && (
            <div className="absolute bottom-0 left-0 right-0 h-28 flex justify-around px-4">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-white/40 rounded-t-full transform origin-bottom animate-sway"
                  style={{
                    height: `${32 + (i % 6) * 12}px`,
                    animationDelay: `${(i * 0.18) % 3}s`,
                    animationDuration: `${4 + (i % 3)}s`
                  }}
                />
              ))}
            </div>
          )}

          {particle === 'stars' && (
            <div className="absolute inset-0">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-amber-100 rounded-full animate-pulse"
                  style={{
                    top: `${(i * 17) % 75}%`,
                    left: `${(i * 23) % 92}%`,
                    animationDuration: `${2.5 + (i % 4) * 0.8}s`,
                    animationDelay: `${(i * 0.4)}s`,
                    opacity: 0.3 + (i % 5) * 0.15,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Ambient Warm Vignette & Horizon */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Scene Labels */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white/95 drop-shadow-sm">
          <div>
            <div className="text-xs font-serif tracking-widest font-medium">
              {title}
            </div>
            {subtitle && (
              <div className="text-[10px] text-white/75 font-serif line-clamp-1 max-w-sm mt-0.5">
                {subtitle}
              </div>
            )}
          </div>
          <div className="text-[10px] font-mono tracking-widest text-white/70 uppercase">
            自創留白
          </div>
        </div>
      </div>
    );
  }

  // Pre-set Classic Ghibli Scenes
  switch (theme) {
    case 'train':
      return (
        <div className="relative w-full h-full min-h-[280px] overflow-hidden rounded-xl bg-gradient-to-b from-[#8CAEC4] via-[#BFD5E2] to-[#6E95A8] select-none">
          {/* Subtle sky clouds */}
          <div className="absolute top-4 left-10 w-48 h-16 bg-white/40 rounded-full blur-md animate-float" style={{ animationDuration: '14s' }} />
          <div className="absolute top-12 right-12 w-64 h-20 bg-white/30 rounded-full blur-lg animate-float" style={{ animationDuration: '18s', animationDelay: '-4s' }} />

          {/* Distant horizon & tiny island platform */}
          <div className="absolute bottom-[38%] left-0 right-0 h-px bg-white/30" />
          <div className="absolute bottom-[38%] right-24 w-12 h-6 bg-[#3A505F]/50 rounded-t-sm" />
          <div className="absolute bottom-[38%] right-[100px] w-1 h-10 bg-[#3A505F]/70" />

          {/* Flooded rail tracks on shallow water */}
          <div className="absolute bottom-[24%] left-0 right-0 h-[2px] bg-[#2C4250]/40" />
          <div className="absolute bottom-[20%] left-0 right-0 h-[3px] bg-[#1E3340]/50" />

          {/* Submerged track sleepers pattern */}
          <div className="absolute bottom-[18%] left-0 right-0 h-8 flex justify-around opacity-30">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-1.5 h-6 bg-[#162732] -rotate-12 transform" />
            ))}
          </div>

          {/* Vintage Train Silhouette (Spirited Away Sea Railway) */}
          <div className="absolute bottom-[23%] left-[18%] w-44 md:w-56 h-20 bg-[#6E2A28] rounded-t-md shadow-md border-b-2 border-[#391211]">
            <div className="absolute -top-2 left-2 right-2 h-2 bg-[#4A1D1C] rounded-t-full" />
            <div className="absolute top-3 left-3 right-3 flex justify-between gap-1.5">
              {[0, 1, 2, 3].map((w) => (
                <div key={w} className="flex-1 h-9 bg-gradient-to-b from-[#FDE68A] to-[#F59E0B] rounded-sm relative overflow-hidden shadow-inner">
                  {w === 1 && (
                    <div className="absolute bottom-0 right-2 w-3.5 h-6 bg-[#2B1B17] rounded-t-full opacity-80" />
                  )}
                  {w === 2 && (
                    <div className="absolute bottom-0 left-2 w-4 h-7 bg-[#1F2937] rounded-t-full opacity-70" />
                  )}
                </div>
              ))}
            </div>
            <div className="absolute -bottom-1 left-0 w-2 h-2 bg-[#FDE68A] rounded-full shadow-[0_0_8px_#FDE68A]" />
          </div>

          {/* Train reflection in shallow water */}
          <div className="absolute bottom-[6%] left-[18%] w-44 md:w-56 h-12 bg-[#6E2A28]/25 blur-[1px] transform scale-y-[-1] opacity-60" />

          {/* Ripples on water surface */}
          <div className="absolute bottom-4 left-1/4 w-32 h-2 border-b border-white/50 rounded-full animate-ripple" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-8 right-1/3 w-48 h-2 border-b border-white/40 rounded-full animate-ripple" style={{ animationDelay: '1.8s' }} />

          {/* Poetic scene label */}
          <div className="absolute bottom-3 left-4 text-xs font-serif tracking-widest text-[#243B48]/90">
            第六號車站 · 寂靜的水上鐵道
          </div>
        </div>
      );

    case 'rain':
      return (
        <div className="relative w-full h-full min-h-[280px] overflow-hidden rounded-xl bg-gradient-to-b from-[#2E3C3F] via-[#3D4D51] to-[#283335] select-none">
          <svg className="absolute bottom-0 left-0 right-0 w-full h-44 text-[#1E282A]/80 fill-current" viewBox="0 0 400 120" preserveAspectRatio="none">
            <path d="M0,120 L0,50 Q40,10 80,45 Q120,0 170,35 Q220,5 280,40 Q330,15 370,35 Q390,20 400,30 L400,120 Z" />
          </svg>

          <div className="absolute inset-0 pointer-events-none opacity-40">
            {Array.from({ length: 18 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[1px] bg-gradient-to-b from-transparent via-white/70 to-transparent"
                style={{
                  height: `${28 + (i % 5) * 12}px`,
                  left: `${(i * 5.6) + 2}%`,
                  top: `${(i * 17) % 70}%`,
                  transform: 'rotate(10deg)',
                  animation: `breathe ${2.5 + (i % 3)}s infinite ease-in-out`
                }}
              />
            ))}
          </div>

          <div className="absolute bottom-6 left-16 md:left-24 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#E5DFD3] border-2 border-[#52443C] flex items-center justify-center shadow-md">
              <span className="text-[10px] font-serif text-[#3D3028] font-bold tracking-tighter">稻荷前</span>
            </div>
            <div className="w-2 h-28 bg-[#443831] rounded-b-sm" />
          </div>

          <div className="absolute bottom-28 left-12 md:left-20 w-20 h-20 bg-amber-400/20 rounded-full blur-xl animate-pulse" />

          <div className="absolute bottom-4 left-1/3 w-36 h-10 border border-white/30 rounded-full animate-ripple" style={{ animationDuration: '3.5s' }} />
          <div className="absolute bottom-5 left-1/3 ml-4 w-28 h-8 border border-white/20 rounded-full animate-ripple" style={{ animationDuration: '4.2s', animationDelay: '1.2s' }} />

          <div className="absolute bottom-3 right-4 text-xs font-serif tracking-widest text-[#D6CEBE]/80">
            簷下雨夜 · 水滴敲擊傘布之瞬
          </div>
        </div>
      );

    case 'grass':
      return (
        <div className="relative w-full h-full min-h-[280px] overflow-hidden rounded-xl bg-gradient-to-b from-[#87BBD3] via-[#CCE5EE] to-[#A3C686] select-none">
          <div className="absolute top-6 left-1/4 w-52 h-20 bg-white/80 rounded-full blur-sm animate-float" style={{ animationDuration: '16s' }} />
          <div className="absolute top-14 right-1/4 w-36 h-14 bg-white/70 rounded-full blur-sm animate-float" style={{ animationDuration: '22s', animationDelay: '-6s' }} />

          <div className="absolute bottom-16 -left-10 -right-10 h-36 bg-[#86AC67] rounded-t-[100%] opacity-85 transform -rotate-1" />

          <div className="absolute -bottom-6 -left-8 -right-8 h-40 bg-[#659145] rounded-t-[70%] shadow-inner">
            <div className="absolute top-2 left-0 right-0 flex justify-around px-8 opacity-80">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-[#4E7631] rounded-t-full transform origin-bottom animate-sway"
                  style={{
                    height: `${24 + (i % 6) * 6}px`,
                    animationDelay: `${(i * 0.22) % 3}s`,
                    animationDuration: `${3.5 + (i % 4) * 0.8}s`
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 right-16 md:right-28 flex flex-col items-center">
            <div className="w-24 h-2.5 bg-[#4A3828] rounded-sm shadow-sm" />
            <div className="w-20 h-2 bg-[#5E4834] rounded-sm mt-1" />
            <div className="w-18 flex justify-between px-2 mt-1">
              <div className="w-1.5 h-6 bg-[#36271A]" />
              <div className="w-1.5 h-6 bg-[#36271A]" />
            </div>
            <div className="absolute -top-3.5 right-4 w-3 h-3 bg-white rounded-b-sm shadow-xs">
              <div className="absolute -top-2 left-1 w-1 h-2 bg-white/60 rounded-full blur-[0.5px] animate-breathe" />
            </div>
          </div>

          <div className="absolute top-24 left-1/3 animate-float" style={{ animationDuration: '11s' }}>
            <div className="w-7 h-2 bg-white/90 rounded-full shadow-xs -rotate-12 transform" />
            <div className="w-4 h-2.5 bg-white/90 rounded-t-full mx-auto -mt-2 -rotate-12" />
          </div>

          <div className="absolute bottom-3 left-4 text-xs font-serif tracking-widest text-[#243F14]/90">
            晴丘微風 · 風吹過草尖無言的呼吸
          </div>
        </div>
      );

    case 'tea':
      return (
        <div className="relative w-full h-full min-h-[280px] overflow-hidden rounded-xl bg-gradient-to-b from-[#E7DFC6] via-[#D8CEB3] to-[#B3A484] select-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 pointer-events-none transform -skew-x-12" />

          <div className="absolute top-0 right-0 w-48 h-full border-l border-amber-900/15 flex flex-col">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 border-b border-amber-900/15" />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#3E3127] shadow-2xl border-t border-[#544336]" />

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="relative w-8 h-20 mb-1 flex justify-center">
              <div className="absolute w-2 h-16 bg-white/40 rounded-full blur-[2px] animate-breathe" style={{ animationDuration: '4.8s' }} />
              <div className="absolute w-1.5 h-12 bg-white/30 rounded-full blur-[1.5px] animate-breathe" style={{ animationDuration: '6.2s', animationDelay: '1.2s' }} />
            </div>

            <div className="w-14 h-12 bg-[#E2DCBE] rounded-b-xl border-t-2 border-[#8C6D46] shadow-lg relative flex items-center justify-center">
              <div className="absolute top-0.5 w-11 h-2 bg-[#72522B] rounded-full opacity-90" />
            </div>
            <div className="w-20 h-2 bg-[#28201A] rounded-full mt-0.5 shadow-md" />
          </div>

          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/70 rounded-full blur-[0.4px] animate-float"
              style={{
                top: `${20 + (i * 7)}%`,
                left: `${35 + (i * 5)}%`,
                animationDuration: `${7 + (i % 4) * 2}s`,
                animationDelay: `${(i * 0.7)}s`
              }}
            />
          ))}

          <div className="absolute bottom-3 left-4 text-xs font-serif tracking-widest text-[#EADBCA]/90">
            靜室茶煙 · 一杯熱茶在光影裡慢冷
          </div>
        </div>
      );

    case 'sea':
    default:
      return (
        <div className="relative w-full h-full min-h-[280px] overflow-hidden rounded-xl bg-gradient-to-b from-[#7AA4B8] via-[#A8C9D8] to-[#457287] select-none">
          <div className="absolute bottom-24 right-4 w-48 h-24 bg-[#69584D] rounded-t-[80%] opacity-70" />
          <div className="absolute bottom-24 right-32 w-36 h-18 bg-[#807062] rounded-t-[60%] opacity-60" />

          <div className="absolute bottom-12 left-0 right-0 h-16 bg-[#37657B]/70 rounded-t-full transform scale-x-125 animate-breathe" style={{ animationDuration: '9s' }} />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#2B5467] rounded-t-full transform scale-x-110" />

          <div className="absolute bottom-3 left-0 right-0 h-2 bg-white/40 blur-[1px] animate-ripple" style={{ animationDuration: '6s' }} />

          <div className="absolute bottom-16 left-16 flex items-center">
            <div className="w-16 h-4 bg-[#B91C1C] rounded-sm transform -rotate-6 shadow-sm" />
            <div className="w-6 h-6 rounded-full border-2 border-white/60 bg-white/20 -ml-2" />
          </div>

          <div className="absolute bottom-3 left-4 text-xs font-serif tracking-widest text-[#E6EFF5]/90">
            亞得里亞海 · 潮浪收納了所有喧囂
          </div>
        </div>
      );
  }
};
