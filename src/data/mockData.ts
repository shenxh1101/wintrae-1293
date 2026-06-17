import {
  Song,
  SongVersion,
  LyricSection,
  Rehearsal,
  RehearsalTrack,
  Contact,
  ReleaseItem,
  ReleaseTodo,
  Communication,
} from '@/types';

const now = new Date();
const isoNow = now.toISOString();

export const mockSongs: Song[] = [
  {
    id: 'song-1',
    title: '城市夜曲',
    status: 'mixing',
    key: 'G大调',
    bpm: 118,
    mood: '忧郁 / 怀旧',
    inspiration: '深夜骑车穿过城市街道，看着霓虹闪烁，那种孤独又自由的感觉。参考了《夜空中最亮的星》的编曲结构。',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-06-10T14:20:00Z',
  },
  {
    id: 'song-2',
    title: '海岸线',
    status: 'arranging',
    key: 'D小调',
    bpm: 95,
    mood: '治愈 / 空灵',
    inspiration: '去年在青岛海边看日出时写的旋律，想用合成器营造海浪的感觉。',
    createdAt: '2024-02-20T08:15:00Z',
    updatedAt: '2024-06-08T09:45:00Z',
  },
  {
    id: 'song-3',
    title: '未命名Demo #7',
    status: 'idea',
    mood: '待定',
    inspiration: '手机里录的一段哼唱，还没想好主题。',
    createdAt: '2024-05-30T16:00:00Z',
    updatedAt: '2024-05-30T16:00:00Z',
  },
  {
    id: 'song-4',
    title: '午夜公路',
    status: 'completed',
    key: 'E大调',
    bpm: 128,
    mood: '热血 / 自由',
    inspiration: '写给正在追梦的朋友们，公路电影的感觉。',
    createdAt: '2023-11-10T12:00:00Z',
    updatedAt: '2024-04-15T18:30:00Z',
  },
  {
    id: 'song-5',
    title: '老房间',
    status: 'to_record',
    key: 'C大调',
    bpm: 76,
    mood: '温暖 / 怀旧',
    inspiration: '春节回家整理旧物时写的，关于童年和成长。',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-06-01T11:20:00Z',
  },
  {
    id: 'song-6',
    title: '银河列车',
    status: 'recorded',
    key: 'A小调',
    bpm: 140,
    mood: '梦幻 / 科幻',
    inspiration: '看了《银河铁道999》后写的，用了很多空间感的音效。',
    createdAt: '2024-03-05T14:30:00Z',
    updatedAt: '2024-06-12T10:00:00Z',
  },
];

export const mockSongVersions: SongVersion[] = [
  {
    id: 'version-1',
    songId: 'song-1',
    name: 'Demo v1 - 吉他弹唱',
    audioPath: 'demo_data/city_night_demo1.mp3',
    duration: 185,
    description: '最初的吉他弹唱版本，手机录音',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'version-2',
    songId: 'song-1',
    name: 'Demo v2 - 加了鼓点',
    audioPath: 'demo_data/city_night_demo2.mp3',
    duration: 192,
    description: '加了简单的鼓机和贝斯',
    createdAt: '2024-02-20T14:00:00Z',
  },
  {
    id: 'version-3',
    songId: 'song-1',
    name: '编曲版',
    audioPath: 'demo_data/city_night_arrangement.mp3',
    duration: 245,
    description: '完整编曲，加入弦乐和合成器',
    createdAt: '2024-04-10T16:30:00Z',
  },
  {
    id: 'version-4',
    songId: 'song-1',
    name: '混音版 v3',
    audioPath: 'demo_data/city_night_mix3.mp3',
    duration: 248,
    description: '最新混音，调整了人声和贝斯的平衡',
    createdAt: '2024-06-10T14:20:00Z',
  },
  {
    id: 'version-5',
    songId: 'song-2',
    name: '钢琴Demo',
    audioPath: 'demo_data/coastline_piano.mp3',
    duration: 160,
    description: '钢琴独奏版本，旋律骨架',
    createdAt: '2024-02-20T08:15:00Z',
  },
  {
    id: 'version-6',
    songId: 'song-4',
    name: '最终版',
    audioPath: 'demo_data/midnight_highway_final.mp3',
    duration: 256,
    description: '母带完成版',
    createdAt: '2024-04-15T18:30:00Z',
  },
];

export const mockLyrics: LyricSection[] = [
  {
    id: 'lyric-1',
    songId: 'song-1',
    type: 'verse',
    content: '霓虹灯在玻璃窗上折射\n我骑着车穿过无人的街\n风在耳边轻轻诉说着\n那些未完成的约定',
    orderIndex: 1,
    notes: '可以考虑把"玻璃窗"改成"后视镜"，更有行进感',
  },
  {
    id: 'lyric-2',
    songId: 'song-1',
    type: 'pre_chorus',
    content: '城市的夜太沉默\n谁在独自守候\n那盏不灭的灯火',
    orderIndex: 2,
  },
  {
    id: 'lyric-3',
    songId: 'song-1',
    type: 'chorus',
    content: '哦~ 城市夜曲\n唱给每个孤独的灵魂\n哦~ 不要哭泣\n黎明终将会来临',
    orderIndex: 3,
    notes: '副歌情绪需要再推上去，最后一句可以升key',
  },
  {
    id: 'lyric-4',
    songId: 'song-1',
    type: 'verse',
    content: '酒吧里传来熟悉的旋律\n是谁在弹着老歌曲\n记忆在酒精中发酵\n有些事再也回不去',
    orderIndex: 4,
  },
  {
    id: 'lyric-5',
    songId: 'song-1',
    type: 'bridge',
    content: '我们都是这座城市的过客\n寻找着属于自己的角落\n也许明天会更好\n也许还是一样的迷茫',
    orderIndex: 5,
  },
  {
    id: 'lyric-6',
    songId: 'song-2',
    type: 'verse',
    content: '海浪拍打着礁石\n海鸥在远处飞翔\n我站在这海岸线上\n等待着第一缕阳光',
    orderIndex: 1,
  },
  {
    id: 'lyric-7',
    songId: 'song-2',
    type: 'chorus',
    content: '海岸线 延伸到天边\n你的笑 还在我眼前\n海风啊 带走我的思念\n让它飘 飘向你身边',
    orderIndex: 2,
  },
];

export const mockRehearsals: Rehearsal[] = [
  {
    id: 'rehearsal-1',
    date: getDateString(addDays(now, 3)),
    startTime: '19:00',
    endTime: '22:00',
    location: '蜂巢排练室 B203',
    notes: '重点练新歌《海岸线》和《城市夜曲》的衔接部分',
  },
  {
    id: 'rehearsal-2',
    date: getDateString(addDays(now, 7)),
    startTime: '14:00',
    endTime: '18:00',
    location: '蜂巢排练室 B203',
    notes: '为月底的Live House演出做准备，过一遍所有曲目',
  },
  {
    id: 'rehearsal-3',
    date: getDateString(addDays(now, 14)),
    startTime: '19:00',
    endTime: '21:00',
    location: '录音棚',
    notes: '《老房间》正式录音前的排练',
  },
];

export const mockRehearsalTracks: RehearsalTrack[] = [
  {
    id: 'rt-1',
    rehearsalId: 'rehearsal-1',
    songId: 'song-5',
    orderIndex: 1,
    focusPoints: '开场热身，注意速度稳定在76BPM',
  },
  {
    id: 'rt-2',
    rehearsalId: 'rehearsal-1',
    songId: 'song-2',
    orderIndex: 2,
    focusPoints: '重点练副歌部分的贝斯线，合成器音色需要再调试',
  },
  {
    id: 'rt-3',
    rehearsalId: 'rehearsal-1',
    songId: 'song-1',
    orderIndex: 3,
    focusPoints: '桥段到最后副歌的衔接，鼓手注意渐强',
  },
  {
    id: 'rt-4',
    rehearsalId: 'rehearsal-1',
    songId: 'song-4',
    orderIndex: 4,
    focusPoints: '作为结束曲，要有力，结尾要干脆',
  },
  {
    id: 'rt-5',
    rehearsalId: 'rehearsal-2',
    songId: 'song-4',
    orderIndex: 1,
    focusPoints: '开场曲，气势要足',
  },
  {
    id: 'rt-6',
    rehearsalId: 'rehearsal-2',
    songId: 'song-5',
    orderIndex: 2,
  },
  {
    id: 'rt-7',
    rehearsalId: 'rehearsal-2',
    songId: 'song-2',
    orderIndex: 3,
  },
  {
    id: 'rt-8',
    rehearsalId: 'rehearsal-2',
    songId: 'song-6',
    orderIndex: 4,
  },
  {
    id: 'rt-9',
    rehearsalId: 'rehearsal-2',
    songId: 'song-1',
    orderIndex: 5,
  },
];

export const mockContacts: Contact[] = [
  {
    id: 'contact-1',
    name: '李明',
    category: 'musician',
    phone: '138-0000-1234',
    email: 'liming@example.com',
    expertise: '电吉他、木吉他、编曲',
    notes: '合作5年的吉他手，技术全面，擅长即兴solo',
  },
  {
    id: 'contact-2',
    name: '王芳',
    category: 'musician',
    phone: '139-0000-5678',
    email: 'wangfang@example.com',
    expertise: '贝斯、和声编写',
    notes: '音乐学院科班出身，理论扎实',
  },
  {
    id: 'contact-3',
    name: '张伟',
    category: 'musician',
    phone: '137-0000-9012',
    email: 'zhangwei@example.com',
    expertise: '架子鼓、打击乐',
    notes: '节奏稳，现场经验丰富',
  },
  {
    id: 'contact-4',
    name: '陈老师',
    category: 'engineer',
    phone: '136-0000-3456',
    email: 'chenaudio@example.com',
    expertise: '录音、混音、母带处理',
    notes: '拥有20年经验的资深录音师，合作过很多独立乐队',
  },
  {
    id: 'contact-5',
    name: '小林',
    category: 'designer',
    phone: '135-0000-7890',
    email: 'lindesign@example.com',
    expertise: '封面设计、海报设计、视觉设计',
    notes: '风格偏复古和赛博朋克，很有想法的设计师',
  },
  {
    id: 'contact-6',
    name: '周姐',
    category: 'manager',
    phone: '134-0000-2345',
    email: 'zhoumana@example.com',
    expertise: '演出经纪、版权管理、推广',
    notes: '帮我们联系过好几次Live House演出，资源很广',
  },
];

export const mockReleases: ReleaseItem[] = [
  {
    id: 'release-1',
    songId: 'song-1',
    title: '城市夜曲',
    coverPath: '',
    releaseDate: getDateString(addDays(now, 30)),
    copyrightInfo: '© 2024 独立音乐人工作室',
    isrc: 'CN-B34-24-00001',
    status: 'planning',
    platforms: ['netease', 'qq', 'spotify', 'apple'],
  },
  {
    id: 'release-2',
    songId: 'song-4',
    title: '午夜公路',
    coverPath: '',
    releaseDate: '2024-06-15',
    copyrightInfo: '© 2024 独立音乐人工作室',
    isrc: 'CN-B34-24-00002',
    status: 'published',
    platforms: ['netease', 'qq', 'spotify', 'apple', 'youtube'],
  },
];

export const mockReleaseTodos: ReleaseTodo[] = [
  {
    id: 'todo-1',
    releaseId: 'release-1',
    task: '完成最终混音和母带',
    completed: false,
    dueDate: getDateString(addDays(now, 10)),
  },
  {
    id: 'todo-2',
    releaseId: 'release-1',
    task: '和小林确认封面设计',
    completed: true,
    dueDate: getDateString(addDays(now, 15)),
  },
  {
    id: 'todo-3',
    releaseId: 'release-1',
    task: '写专辑介绍和歌词文案',
    completed: false,
    dueDate: getDateString(addDays(now, 20)),
  },
  {
    id: 'todo-4',
    releaseId: 'release-1',
    task: '注册ISRC码',
    completed: true,
  },
  {
    id: 'todo-5',
    releaseId: 'release-1',
    task: '联系各平台音乐人入驻',
    completed: false,
    dueDate: getDateString(addDays(now, 25)),
  },
  {
    id: 'todo-6',
    releaseId: 'release-1',
    task: '准备推广素材（短视频、海报）',
    completed: false,
    dueDate: getDateString(addDays(now, 28)),
  },
];

export const mockCommunications: Communication[] = [
  {
    id: 'comm-1',
    contactId: 'contact-4',
    projectId: 'song-1',
    projectType: 'song',
    content: '确认6月20日的混音档期，需要预留两天时间',
    date: '2024-06-10',
    followUp: true,
  },
  {
    id: 'comm-2',
    contactId: 'contact-5',
    projectId: 'release-1',
    projectType: 'release',
    content: '发送了3版封面草稿，等待反馈',
    date: '2024-06-08',
    followUp: false,
  },
  {
    id: 'comm-3',
    contactId: 'contact-6',
    projectId: 'rehearsal-2',
    projectType: 'rehearsal',
    content: '确认月底MAO Live House的演出时间和酬劳',
    date: '2024-06-05',
    followUp: true,
  },
  {
    id: 'comm-4',
    contactId: 'contact-1',
    content: '提醒他下周排练不要迟到，上次晚了半小时',
    date: '2024-06-12',
    followUp: false,
  },
];

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
