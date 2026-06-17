import { create } from 'zustand';
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
  TabType,
  SongStatus,
} from '@/types';
import { generateId, loadFromStorage, saveToStorage, StoredData } from '@/utils/storage';
import {
  mockSongs,
  mockSongVersions,
  mockLyrics,
  mockRehearsals,
  mockRehearsalTracks,
  mockContacts,
  mockReleases,
  mockReleaseTodos,
  mockCommunications,
} from '@/data/mockData';

interface AppState {
  activeTab: TabType;
  selectedSongId?: string;
  selectedRehearsalId?: string;
  selectedContactId?: string;
  selectedReleaseId?: string;
  
  songs: Song[];
  songVersions: SongVersion[];
  lyrics: LyricSection[];
  rehearsals: Rehearsal[];
  rehearsalTracks: RehearsalTrack[];
  contacts: Contact[];
  releases: ReleaseItem[];
  releaseTodos: ReleaseTodo[];
  communications: Communication[];
  
  setActiveTab: (tab: TabType) => void;
  setSelectedSongId: (id?: string) => void;
  setSelectedRehearsalId: (id?: string) => void;
  setSelectedContactId: (id?: string) => void;
  setSelectedReleaseId: (id?: string) => void;
  
  addSong: (song: Omit<Song, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSong: (id: string, updates: Partial<Song>) => void;
  deleteSong: (id: string) => void;
  
  addSongVersion: (version: Omit<SongVersion, 'id' | 'createdAt'>) => void;
  deleteSongVersion: (id: string) => void;
  
  addLyricSection: (lyric: Omit<LyricSection, 'id'>) => void;
  updateLyricSection: (id: string, updates: Partial<LyricSection>) => void;
  deleteLyricSection: (id: string) => void;
  
  addRehearsal: (rehearsal: Omit<Rehearsal, 'id'>) => void;
  updateRehearsal: (id: string, updates: Partial<Rehearsal>) => void;
  deleteRehearsal: (id: string) => void;
  
  addRehearsalTrack: (track: Omit<RehearsalTrack, 'id'>) => void;
  updateRehearsalTrack: (id: string, updates: Partial<RehearsalTrack>) => void;
  deleteRehearsalTrack: (id: string) => void;
  
  addContact: (contact: Omit<Contact, 'id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  addRelease: (release: Omit<ReleaseItem, 'id'>) => void;
  updateRelease: (id: string, updates: Partial<ReleaseItem>) => void;
  deleteRelease: (id: string) => void;
  
  addReleaseTodo: (todo: Omit<ReleaseTodo, 'id'>) => void;
  toggleReleaseTodo: (todoId: string) => void;
  updateReleaseTodo: (id: string, updates: Partial<ReleaseTodo>) => void;
  deleteReleaseTodo: (id: string) => void;
  
  addCommunication: (comm: Omit<Communication, 'id'>) => void;
  updateCommunication: (id: string, updates: Partial<Communication>) => void;
  deleteCommunication: (id: string) => void;
  
  loadFromStorage: () => void;
  saveToStorage: () => void;
  initWithMockData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'library',
  selectedSongId: undefined,
  selectedRehearsalId: undefined,
  selectedContactId: undefined,
  selectedReleaseId: undefined,
  
  songs: [],
  songVersions: [],
  lyrics: [],
  rehearsals: [],
  rehearsalTracks: [],
  contacts: [],
  releases: [],
  releaseTodos: [],
  communications: [],
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedSongId: (id) => set({ selectedSongId: id }),
  setSelectedRehearsalId: (id) => set({ selectedRehearsalId: id }),
  setSelectedContactId: (id) => set({ selectedContactId: id }),
  setSelectedReleaseId: (id) => set({ selectedReleaseId: id }),
  
  addSong: (song) => {
    const now = new Date().toISOString();
    const newSong: Song = {
      ...song,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ songs: [...state.songs, newSong] }));
    get().saveToStorage();
  },
  
  updateSong: (id, updates) => {
    set((state) => ({
      songs: state.songs.map((s) =>
        s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
      ),
    }));
    get().saveToStorage();
  },
  
  deleteSong: (id) => {
    set((state) => ({
      songs: state.songs.filter((s) => s.id !== id),
      songVersions: state.songVersions.filter((v) => v.songId !== id),
      lyrics: state.lyrics.filter((l) => l.songId !== id),
      selectedSongId: state.selectedSongId === id ? undefined : state.selectedSongId,
    }));
    get().saveToStorage();
  },
  
  addSongVersion: (version) => {
    const newVersion: SongVersion = {
      ...version,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ songVersions: [...state.songVersions, newVersion] }));
    get().saveToStorage();
  },
  
  deleteSongVersion: (id) => {
    set((state) => ({
      songVersions: state.songVersions.filter((v) => v.id !== id),
    }));
    get().saveToStorage();
  },
  
  addLyricSection: (lyric) => {
    const newLyric: LyricSection = {
      ...lyric,
      id: generateId(),
    };
    set((state) => ({ lyrics: [...state.lyrics, newLyric] }));
    get().saveToStorage();
  },
  
  updateLyricSection: (id, updates) => {
    set((state) => ({
      lyrics: state.lyrics.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
    get().saveToStorage();
  },
  
  deleteLyricSection: (id) => {
    set((state) => ({
      lyrics: state.lyrics.filter((l) => l.id !== id),
    }));
    get().saveToStorage();
  },
  
  addRehearsal: (rehearsal) => {
    const newRehearsal: Rehearsal = {
      ...rehearsal,
      id: generateId(),
    };
    set((state) => ({ rehearsals: [...state.rehearsals, newRehearsal] }));
    get().saveToStorage();
  },
  
  updateRehearsal: (id, updates) => {
    set((state) => ({
      rehearsals: state.rehearsals.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
    get().saveToStorage();
  },
  
  deleteRehearsal: (id) => {
    set((state) => ({
      rehearsals: state.rehearsals.filter((r) => r.id !== id),
      rehearsalTracks: state.rehearsalTracks.filter((t) => t.rehearsalId !== id),
      selectedRehearsalId: state.selectedRehearsalId === id ? undefined : state.selectedRehearsalId,
    }));
    get().saveToStorage();
  },
  
  addRehearsalTrack: (track) => {
    const newTrack: RehearsalTrack = {
      ...track,
      id: generateId(),
    };
    set((state) => ({ rehearsalTracks: [...state.rehearsalTracks, newTrack] }));
    get().saveToStorage();
  },
  
  updateRehearsalTrack: (id, updates) => {
    set((state) => ({
      rehearsalTracks: state.rehearsalTracks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    get().saveToStorage();
  },
  
  deleteRehearsalTrack: (id) => {
    set((state) => ({
      rehearsalTracks: state.rehearsalTracks.filter((t) => t.id !== id),
    }));
    get().saveToStorage();
  },
  
  addContact: (contact) => {
    const newContact: Contact = {
      ...contact,
      id: generateId(),
    };
    set((state) => ({ contacts: [...state.contacts, newContact] }));
    get().saveToStorage();
  },
  
  updateContact: (id, updates) => {
    set((state) => ({
      contacts: state.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    get().saveToStorage();
  },
  
  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
      communications: state.communications.filter((c) => c.contactId !== id),
      selectedContactId: state.selectedContactId === id ? undefined : state.selectedContactId,
    }));
    get().saveToStorage();
  },
  
  addRelease: (release) => {
    const newRelease: ReleaseItem = {
      ...release,
      id: generateId(),
    };
    set((state) => ({ releases: [...state.releases, newRelease] }));
    get().saveToStorage();
  },
  
  updateRelease: (id, updates) => {
    set((state) => ({
      releases: state.releases.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
    get().saveToStorage();
  },
  
  deleteRelease: (id) => {
    set((state) => ({
      releases: state.releases.filter((r) => r.id !== id),
      releaseTodos: state.releaseTodos.filter((t) => t.releaseId !== id),
      selectedReleaseId: state.selectedReleaseId === id ? undefined : state.selectedReleaseId,
    }));
    get().saveToStorage();
  },
  
  addReleaseTodo: (todo) => {
    const newTodo: ReleaseTodo = {
      ...todo,
      id: generateId(),
    };
    set((state) => ({ releaseTodos: [...state.releaseTodos, newTodo] }));
    get().saveToStorage();
  },
  
  toggleReleaseTodo: (todoId) => {
    set((state) => ({
      releaseTodos: state.releaseTodos.map((t) =>
        t.id === todoId ? { ...t, completed: !t.completed } : t
      ),
    }));
    get().saveToStorage();
  },
  
  updateReleaseTodo: (id, updates) => {
    set((state) => ({
      releaseTodos: state.releaseTodos.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
    get().saveToStorage();
  },
  
  deleteReleaseTodo: (id) => {
    set((state) => ({
      releaseTodos: state.releaseTodos.filter((t) => t.id !== id),
    }));
    get().saveToStorage();
  },
  
  addCommunication: (comm) => {
    const newComm: Communication = {
      ...comm,
      id: generateId(),
    };
    set((state) => ({ communications: [...state.communications, newComm] }));
    get().saveToStorage();
  },
  
  updateCommunication: (id, updates) => {
    set((state) => ({
      communications: state.communications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
    get().saveToStorage();
  },
  
  deleteCommunication: (id) => {
    set((state) => ({
      communications: state.communications.filter((c) => c.id !== id),
    }));
    get().saveToStorage();
  },
  
  loadFromStorage: () => {
    const data = loadFromStorage();
    if (data) {
      set({
        songs: data.songs,
        songVersions: data.songVersions,
        lyrics: data.lyrics,
        rehearsals: data.rehearsals,
        rehearsalTracks: data.rehearsalTracks,
        contacts: data.contacts,
        releases: data.releases,
        releaseTodos: data.releaseTodos,
        communications: data.communications,
      });
    }
  },
  
  saveToStorage: () => {
    const state = get();
    const data: StoredData = {
      songs: state.songs,
      songVersions: state.songVersions,
      lyrics: state.lyrics,
      rehearsals: state.rehearsals,
      rehearsalTracks: state.rehearsalTracks,
      contacts: state.contacts,
      releases: state.releases,
      releaseTodos: state.releaseTodos,
      communications: state.communications,
    };
    saveToStorage(data);
  },
  
  initWithMockData: () => {
    set({
      songs: mockSongs,
      songVersions: mockSongVersions,
      lyrics: mockLyrics,
      rehearsals: mockRehearsals,
      rehearsalTracks: mockRehearsalTracks,
      contacts: mockContacts,
      releases: mockReleases,
      releaseTodos: mockReleaseTodos,
      communications: mockCommunications,
    });
    get().saveToStorage();
  },
}));

export const useSongVersions = (songId?: string) => {
  return useAppStore((state) =>
    songId ? state.songVersions.filter((v) => v.songId === songId) : []
  );
};

export const useSongLyrics = (songId?: string) => {
  return useAppStore((state) =>
    songId
      ? state.lyrics
          .filter((l) => l.songId === songId)
          .sort((a, b) => a.orderIndex - b.orderIndex)
      : []
  );
};

export const useRehearsalTracks = (rehearsalId?: string) => {
  return useAppStore((state) =>
    rehearsalId
      ? state.rehearsalTracks
          .filter((t) => t.rehearsalId === rehearsalId)
          .sort((a, b) => a.orderIndex - b.orderIndex)
      : []
  );
};

export const useReleaseTodos = (releaseId?: string) => {
  return useAppStore((state) =>
    releaseId ? state.releaseTodos.filter((t) => t.releaseId === releaseId) : []
  );
};

export const useContactCommunications = (contactId?: string) => {
  return useAppStore((state) =>
    contactId
      ? state.communications
          .filter((c) => c.contactId === contactId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : []
  );
};

export const useFilteredSongs = (status?: SongStatus, search?: string) => {
  return useAppStore((state) => {
    let result = state.songs;
    if (status) {
      result = result.filter((s) => s.status === status);
    }
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(lowerSearch) ||
          s.mood?.toLowerCase().includes(lowerSearch) ||
          s.inspiration?.toLowerCase().includes(lowerSearch)
      );
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  });
};
