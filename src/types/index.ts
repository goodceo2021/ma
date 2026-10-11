export type SceneTheme = 'train' | 'rain' | 'grass' | 'tea' | 'sea' | 'wind' | 'custom';

export type AmbientSoundType = 'wind' | 'rain' | 'stream' | 'crickets' | 'fireplace' | 'none';
export type VisualAtmosphere = 'dawn' | 'dusk' | 'misty' | 'night' | 'summer' | 'room' | 'forest' | 'custom_color';
export type ParticleEffect = 'steam' | 'leaves' | 'rain_drops' | 'ripples' | 'dust' | 'grass_sway' | 'stars';
export type BreathCadence = '4-4-6' | '4-7-8' | '5-5' | 'free';

export interface CustomMaMoment {
  id: string;
  title: string;
  subtitle?: string;
  description: string; // The intention / what makes this quiet
  ambientSound: AmbientSoundType;
  ambientFreq?: number; // e.g. 261, 432, 528
  visualAtmosphere: VisualAtmosphere;
  customBgGradient?: string; // e.g. 'from-[#...]'
  particleEffect: ParticleEffect;
  defaultDurationSeconds: number; // e.g. 60, 180, 300
  breathCadence: BreathCadence;
  guidingQuote?: string; // Custom quote or reflection prompt shown during pause
  mediaType?: 'image' | 'video' | 'none';
  mediaUrl?: string; // Data URL or object URL
  customImageUrl?: string; // Legacy fallback
  isUserCreated: boolean;
  createdAt: number;
}

export interface MaRecord {
  id: string;
  timestamp: number;
  title: string;
  note: string;
  sceneTheme: SceneTheme;
  customMomentId?: string;
  durationSeconds: number;
  moodTag: string;
  location: string;
  observation?: string; // 靜默中所見或所感到的細節
  mediaType?: 'image' | 'video' | 'none';
  mediaUrl?: string;
}

export interface ReminderConfig {
  enabled: boolean;
  intervalMinutes: number; // e.g. 45
  mode: 'interval' | 'scheduled';
  scheduledTimes: string[]; // e.g. ['09:30', '12:30', '16:30', '21:30']
  soundEnabled: boolean;
  browserNotification: boolean;
  pauseDurationSeconds: number; // 60, 120, 180
  lastTriggeredAt?: number;
  preferredMomentId?: string; // Which Ma moment to invoke when triggered
}

export const PRESET_MOMENTS: CustomMaMoment[] = [
  {
    id: 'preset-train',
    title: '水上電車與無邊水面',
    subtitle: '《神隱少女》第六號車站',
    description: '千尋與無臉男靜坐前行。電車穿過無垠的水面，窗外只有水紋與孤單的站牌。',
    ambientSound: 'wind',
    ambientFreq: 261.63,
    visualAtmosphere: 'summer',
    particleEffect: 'ripples',
    defaultDurationSeconds: 120,
    breathCadence: '4-4-6',
    guidingQuote: '「那是無盡延伸的水面，與一節無聲前行的電車。」',
    isUserCreated: false,
    createdAt: 1700000000000,
  },
  {
    id: 'preset-rain',
    title: '簷下雨滴與破舊站牌',
    subtitle: '《龍貓》稻荷前鄉間站牌',
    description: '小月背著熟睡的小梅在雨夜等車。巨大水珠砸在雨傘頂部，森林大口呼吸。',
    ambientSound: 'rain',
    ambientFreq: 261.63,
    visualAtmosphere: 'misty',
    particleEffect: 'rain_drops',
    defaultDurationSeconds: 60,
    breathCadence: '5-5',
    guidingQuote: '「水滴滴在傘頂，那是大自然獨自發聲的時刻。」',
    isUserCreated: false,
    createdAt: 1700000001000,
  },
  {
    id: 'preset-grass',
    title: '晴丘青草與掠過之風',
    subtitle: '《魔女宅急便》山丘放空',
    description: '躺在繁花草坡上，收音機播著微風預報，白雲悠然掠過天際。',
    ambientSound: 'wind',
    ambientFreq: 432,
    visualAtmosphere: 'summer',
    particleEffect: 'grass_sway',
    defaultDurationSeconds: 180,
    breathCadence: '4-4-6',
    guidingQuote: '「什麼事也不做，只是躺著聽風吹過草尖。」',
    isUserCreated: false,
    createdAt: 1700000002000,
  },
  {
    id: 'preset-tea',
    title: '午後靜室一盞清茶',
    subtitle: '吉卜力生活日常',
    description: '茶水入杯，熱氣在窗前斜射的光束裡慢慢盤旋、消散，微塵似星塵。',
    ambientSound: 'none',
    ambientFreq: 528,
    visualAtmosphere: 'room',
    particleEffect: 'steam',
    defaultDurationSeconds: 180,
    breathCadence: '4-7-8',
    guidingQuote: '「一杯茶涼掉的時間，就是給心靈重新開門的縫隙。」',
    isUserCreated: false,
    createdAt: 1700000003000,
  },
  {
    id: 'preset-sea',
    title: '碧海港灣的沉睡浪花',
    subtitle: '《紅豬》亞得里亞海',
    description: '墨鏡下的眼瞼，陽光曬暖的鵝卵石灘，潮起潮落收納一切心事。',
    ambientSound: 'stream',
    ambientFreq: 432,
    visualAtmosphere: 'dawn',
    particleEffect: 'ripples',
    defaultDurationSeconds: 300,
    breathCadence: 'free',
    guidingQuote: '「在浪聲中，所有的喧囂都被大海收納成寂靜。」',
    isUserCreated: false,
    createdAt: 1700000004000,
  },
];

export interface GhibliSceneCase {
  id: string;
  filmTitle: string;
  filmYear: string;
  sceneName: string;
  description: string;
  maPhilosophy: string;
  theme: SceneTheme;
  quoteSnippet: string;
}

export const INITIAL_GHIBLI_SCENES: GhibliSceneCase[] = [
  {
    id: 'spirited-away-train',
    filmTitle: '神隱少女',
    filmYear: '2001',
    sceneName: '第六號車站的水上電車',
    description: '千尋與無臉男靜靜並肩坐在電車長椅上。電車行駛在沒入水中的鐵軌上，窗外是無邊無際的水面、孤單站立在小島上的無名月台與提著皮箱的旅人。沒有任何推進劇情的對白。',
    maPhilosophy: '宮崎駿刻意在此安排了長達數分鐘的空白。他曾說：「電影如果只是不停地說話與衝突，觀眾會變得麻木。這趟安靜的電車，是為了讓千尋的心情沉澱，也讓觀眾得以深呼吸。」',
    theme: 'train',
    quoteSnippet: '「那是無盡延伸的水面，與一節無聲前行的電車。」'
  },
  {
    id: 'totoro-bus-stop',
    filmTitle: '龍貓',
    filmYear: '1988',
    sceneName: '雨夜的鄉間公車站',
    description: '小月背著熟睡的小梅，在傾盆大雨中站在破舊木造站牌下等父親的公車。巨大的龍貓出現，一滴碩大的水珠滴落在雨傘上，發出「啪嗒」一聲，龍貓抖了抖毛茸茸的耳朵。',
    maPhilosophy: '在這個完全沒有背景音樂、只有淅淅瀝瀝雨聲的長鏡頭裡，「間」被具象化為水滴滑落屋簷的節奏。靜止的等待不再是焦慮，而轉化成了對世界神秘本質的凝視。',
    theme: 'rain',
    quoteSnippet: '「水滴滴在傘頂，那是大自然獨自發聲的時刻。」'
  },
  {
    id: 'kiki-grass',
    filmTitle: '魔女宅急便',
    filmYear: '1989',
    sceneName: '山丘草坡上的晴空發呆',
    description: '十三歲出發前夕，琪琪一個人躺在滿是野花的綠色草坡上。身旁的紅色便攜收音機正播放著天氣預報，風吹得青草如波浪般翻滾，白雲悠然漂移，她只是枕著雙手看著天空。',
    maPhilosophy: '沒有戰鬥，沒有目標，只有少女出發前不可言說的迷茫與期許。宮崎駿保留了青春中最真實的發呆時刻——正是在這種無所事事的空白中，人才能看清自己的內心。',
    theme: 'grass',
    quoteSnippet: '「什麼事也不做，只是躺著聽風吹過草尖。」'
  },
  {
    id: 'wind-rises-hill',
    filmTitle: '風起',
    filmYear: '2013',
    sceneName: '草坡上的風與白帽',
    description: '青翠欲滴的草坡上，陽光燦爛，風將野草壓得如同柔軟的波浪。白色的帽子在風中飛起，兩人的視線交會，只有風吹拂過林木的沙沙聲。',
    maPhilosophy: '「風起了，唯有努力生存。」風是看不見的，但藉由草的伏倒、帽子的飄動、被風掀起的裙角，「間」讓無形的時光與命運具體顯現。',
    theme: 'wind',
    quoteSnippet: '「風是無形的，但它掠過草坡時留下了呼吸的痕跡。」'
  },
  {
    id: 'porco-rosso-island',
    filmTitle: '紅豬',
    filmYear: '1992',
    sceneName: '亞得里亞海秘密港灣的午後',
    description: '波爾柯把水上飛機停在隱秘的環狀珊瑚島內。他戴著墨鏡，半躺在沙灘椅上，手裡捏著半支香菸。只有海浪輕輕拍打岸邊白色鵝卵石的聲響，陽光把海水曬得透明。',
    maPhilosophy: '這是中年浪子唯一的避難所。在那個沒有戰火、沒有懸賞的午後空白裡，他什麼也沒去想，任由歲月在潮起潮落中凝滯。',
    theme: 'sea',
    quoteSnippet: '「在浪聲中，所有的喧囂都被大海收納成寂靜。」'
  }
];

export const INITIAL_SAMPLE_RECORDS: MaRecord[] = [
  {
    id: 'sample-rec-1',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    title: '午後茶杯上升起的白煙',
    note: '工作進行到一半，熱水注入茶壺後，我決定關掉螢幕三分鐘。沒有碰手機，只是看著熱氣在窗邊的光線裡緩緩旋轉、消散。',
    sceneTheme: 'tea',
    durationSeconds: 180,
    moodTag: '澄澈',
    location: '書房窗邊',
    observation: '陽光斜射在白瓷杯壁上，微塵在光束中像星塵一樣浮動。'
  },
  {
    id: 'sample-rec-2',
    timestamp: Date.now() - 1000 * 60 * 60 * 26, // yesterday
    title: '雨中等紅綠燈的八十秒',
    note: '撐著黑傘站在十字路口，紅燈亮起。原本急促的步伐停了下來，耳邊只剩下水滴敲打傘布的悶響，世界像突然被降噪。',
    sceneTheme: 'rain',
    durationSeconds: 80,
    moodTag: '釋然',
    location: '敦化南路林蔭大道',
    observation: '柏油路面映著橘色的街燈，雨水聚成小溪流進水溝。'
  },
  {
    id: 'sample-rec-3',
    timestamp: Date.now() - 1000 * 60 * 60 * 50, // 2 days ago
    title: '傍晚捷運高架段的窗景',
    note: '文湖線穿出地下隧道那一刻，暮色正濃。車廂很安靜，我收起耳機，靜靜看著遠方山脈稜線被晚霞染成黛紫色。',
    sceneTheme: 'train',
    durationSeconds: 120,
    moodTag: '靜謐',
    location: '捷運文湖線車廂',
    observation: '飛掠而過的大樓窗台上一盆被晚風吹動的小天竺葵。'
  }
];

export const MIYAZAKI_MA_QUOTES = [
  {
    quote: '「拍手與拍手之間的空隙，就是『間』。若一味只有緊湊的動作而無呼吸的餘地，那就只是喧囂。」',
    source: '宮崎駿 接受電影評論家 Roger Ebert 訪談時的親身闡述 (2002)',
    context: '西方電影往往害怕安靜，急於填滿每一秒；而宮崎駿刻意留出「什麼事都沒發生」的段落，讓情感在留白中自然膨脹。'
  },
  {
    quote: '「如果一個人始終處在80度的緊張狀態，神經遲早會麻木。你必須有安靜下來的片刻，讓緊張能延展成更寬廣的維度。」',
    source: '吉卜力工作室創作備忘錄',
    context: '緊張需要留白來映襯，如同水滴落下的微響，只有在全然安靜的等待中才會撼動心靈。'
  },
  {
    quote: '「重要的東西，往往存在於那些看似沒有用處的安靜時光之中。」',
    source: '吉卜力美術館特展導覽詞',
    context: '觀察一片落葉的軌跡、注視一杯涼掉的茶、聆聽風掠過林梢——這不是浪費時間，而是找回生而為人的知覺。'
  }
];
