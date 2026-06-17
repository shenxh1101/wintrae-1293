export type SongStatus = 'idea' | 'arranging' | 'to_record' | 'recorded' | 'mixing' | 'completed';

export type LyricType = 'intro' | 'verse' | 'pre_chorus' | 'chorus' | 'bridge' | 'outro' | 'instrumental';

export type ContactCategory = 'musician' | 'engineer' | 'designer' | 'manager' | 'other';

export type ReleaseStatus = 'planning' | 'ready' | 'submitted' | 'published' | 'archived';

export type PlatformType = 'netease' | 'qq' | 'spotify' | 'apple' | 'youtube' | 'bandcamp' | 'other';

export type TabType = 'library' | 'rehearsals' | 'lyrics' | 'releases' | 'contacts';

export interface Song {
  id: string;
  title: string;
  status: SongStatus;
  key?: string;
  bpm?: number;
  mood?: string;
  inspiration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SongVersion {
  id: string;
  songId: string;
  name: string;
  audioPath: string;
  duration?: number;
  description?: string;
  createdAt: string;
}

export interface LyricSection {
  id: string;
  songId: string;
  type: LyricType;
  content: string;
  orderIndex: number;
  notes?: string;
}

export interface Rehearsal {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
  memberIds?: string[];
}

export interface RehearsalTrack {
  id: string;
  rehearsalId: string;
  songId: string;
  orderIndex: number;
  focusPoints?: string;
}

export interface Contact {
  id: string;
  name: string;
  category: ContactCategory;
  phone?: string;
  email?: string;
  expertise?: string;
  notes?: string;
}

export interface ReleaseItem {
  id: string;
  songId?: string;
  title: string;
  coverPath?: string;
  releaseDate?: string;
  copyrightInfo?: string;
  isrc?: string;
  status: ReleaseStatus;
  platforms: PlatformType[];
}

export interface ReleaseTodo {
  id: string;
  releaseId: string;
  task: string;
  completed: boolean;
  dueDate?: string;
}

export interface Communication {
  id: string;
  contactId: string;
  projectId?: string;
  projectType?: 'song' | 'rehearsal' | 'release';
  content: string;
  date: string;
  followUp: boolean;
}

export const SONG_STATUS_LABELS: Record<SongStatus, string> = {
  idea: '构思中',
  arranging: '编曲中',
  to_record: '待录制',
  recorded: '已录制',
  mixing: '混音中',
  completed: '已完成',
};

export const LYRIC_TYPE_LABELS: Record<LyricType, string> = {
  intro: '前奏',
  verse: '主歌',
  pre_chorus: '预副歌',
  chorus: '副歌',
  bridge: '桥段',
  outro: '尾奏',
  instrumental: '间奏',
};

export const CONTACT_CATEGORY_LABELS: Record<ContactCategory, string> = {
  musician: '乐手',
  engineer: '录音师',
  designer: '设计师',
  manager: '经纪人',
  other: '其他',
};

export const RELEASE_STATUS_LABELS: Record<ReleaseStatus, string> = {
  planning: '规划中',
  ready: '准备就绪',
  submitted: '已提交',
  published: '已发布',
  archived: '已归档',
};

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  netease: '网易云音乐',
  qq: 'QQ音乐',
  spotify: 'Spotify',
  apple: 'Apple Music',
  youtube: 'YouTube',
  bandcamp: 'Bandcamp',
  other: '其他平台',
};

export const TAB_LABELS: Record<TabType, string> = {
  library: '作品库',
  rehearsals: '排练表',
  lyrics: '歌词笔记',
  releases: '发布清单',
  contacts: '联系人',
};
