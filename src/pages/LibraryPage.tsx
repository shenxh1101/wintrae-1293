import { useState } from 'react';
import { Plus, Search, Filter, Upload, Music2, Clock, GripVertical, Trash2, Edit2, Lightbulb } from 'lucide-react';
import { useAppStore, useFilteredSongs, useSongVersions } from '@/store/useAppStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { Waveform } from '@/components/ui/Waveform';
import { Song, SongStatus, SONG_STATUS_LABELS } from '@/types';
import { formatDate } from '@/utils/date';
import { formatDuration } from '@/utils/storage';

export function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<SongStatus | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [newSong, setNewSong] = useState({
    title: '',
    status: 'idea' as SongStatus,
    key: '',
    bpm: '',
    mood: '',
    inspiration: '',
  });

  const { selectedSongId, setSelectedSongId, addSong, updateSong, deleteSong, addSongVersion } = useAppStore();
  const songs = useFilteredSongs(filterStatus === 'all' ? undefined : filterStatus, searchQuery);
  const selectedSong = songs.find(s => s.id === selectedSongId);
  const versions = useSongVersions(selectedSongId);

  const handleAddSong = () => {
    if (!newSong.title.trim()) return;
    addSong({
      title: newSong.title,
      status: newSong.status,
      key: newSong.key || undefined,
      bpm: newSong.bpm ? parseInt(newSong.bpm) : undefined,
      mood: newSong.mood || undefined,
      inspiration: newSong.inspiration || undefined,
    });
    setNewSong({ title: '', status: 'idea', key: '', bpm: '', mood: '', inspiration: '' });
    setIsAddModalOpen(false);
  };

  const handleEditSong = () => {
    if (!editingSong) return;
    updateSong(editingSong.id, editingSong);
    setIsEditModalOpen(false);
    setEditingSong(null);
  };

  const handleImportAudio = async () => {
    if (!selectedSongId) return;
    if (window.electronAPI) {
      const result = await window.electronAPI.openAudioDialog();
      if (result) {
        addSongVersion({
          songId: selectedSongId,
          name: result.fileName,
          audioPath: result.filePath,
          description: '导入的音频文件',
        });
      }
    } else {
      const versionName = prompt('版本名称:', '新版本');
      if (versionName) {
        addSongVersion({
          songId: selectedSongId,
          name: versionName,
          audioPath: '',
          description: '手动添加的版本',
        });
      }
    }
  };

  const statuses: (SongStatus | 'all')[] = ['all', 'idea', 'arranging', 'to_record', 'recorded', 'mixing', 'completed'];

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col border-r border-studio-700">
        <div className="p-4 border-b border-studio-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-studio-100 font-display">作品库</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              新建作品
            </button>
          </div>
          
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-400" />
              <input
                type="text"
                placeholder="搜索作品..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex items-center gap-1 bg-studio-800 rounded-lg p-1">
              <Filter className="w-4 h-4 text-studio-400 ml-2" />
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-accent-orange text-white'
                      : 'text-studio-400 hover:text-studio-200 hover:bg-studio-700'
                  }`}
                >
                  {status === 'all' ? '全部' : SONG_STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {songs.map((song) => (
              <div
                key={song.id}
                onClick={() => setSelectedSongId(song.id)}
                className={`card card-hover p-4 cursor-pointer ${
                  selectedSongId === song.id ? 'border-accent-orange/50 ring-1 ring-accent-orange/30' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-studio-100 mb-1 truncate">{song.title}</h3>
                    <StatusBadge status={song.status} size="sm" />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSong(song);
                        setIsEditModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-studio-700 text-studio-400 hover:text-studio-200 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`确定删除「${song.title}」吗？`)) {
                          deleteSong(song.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-studio-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="h-10 mb-3 bg-studio-900 rounded-lg overflow-hidden">
                  <Waveform bars={32} height={40} />
                </div>
                
                <div className="flex items-center justify-between text-xs text-studio-400">
                  <div className="flex items-center gap-3">
                    {song.bpm && (
                      <span className="flex items-center gap-1">
                        <Music2 className="w-3 h-3" />
                        {song.bpm} BPM
                      </span>
                    )}
                    {song.key && (
                      <span>{song.key}</span>
                    )}
                  </div>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(song.updatedAt)}
                  </span>
                </div>
              </div>
            ))}
            
            {songs.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-studio-400">
                <Music2 className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg mb-2">还没有作品</p>
                <p className="text-sm">点击"新建作品"开始创作</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {selectedSong && (
        <div className="w-96 bg-studio-850 flex flex-col animate-slide-in">
          <div className="p-4 border-b border-studio-700">
            <h2 className="text-lg font-bold text-studio-100 font-display mb-1">{selectedSong.title}</h2>
            <div className="flex items-center gap-3 mb-3">
              <StatusBadge status={selectedSong.status} size="sm" />
              {selectedSong.bpm && <span className="text-xs text-studio-400">{selectedSong.bpm} BPM</span>}
              {selectedSong.key && <span className="text-xs text-studio-400">{selectedSong.key}</span>}
            </div>
            {selectedSong.mood && (
              <div className="text-sm text-studio-300">
                <span className="text-studio-500">情绪：</span>{selectedSong.mood}
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {selectedSong.inspiration && (
              <div>
                <h3 className="text-sm font-semibold text-studio-200 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-accent-orange" />
                  灵感说明
                </h3>
                <p className="text-sm text-studio-300 leading-relaxed bg-studio-800 p-3 rounded-lg border border-studio-700">
                  {selectedSong.inspiration}
                </p>
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-studio-200 flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-accent-indigo" />
                  版本历史
                </h3>
                <button
                  onClick={handleImportAudio}
                  className="btn btn-secondary text-xs py-1"
                >
                  <Upload className="w-3 h-3" />
                  导入音频
                </button>
              </div>
              
              <div className="space-y-3">
                {versions.length === 0 ? (
                  <p className="text-sm text-studio-500 text-center py-4">还没有音频版本</p>
                ) : (
                  versions.map((version, index) => (
                    <div key={version.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-studio-200 font-medium">
                          v{versions.length - index} - {version.name}
                        </span>
                        <span className="text-studio-500">
                          {formatDate(version.createdAt)} · {formatDuration(version.duration)}
                        </span>
                      </div>
                      {version.description && (
                        <p className="text-xs text-studio-400">{version.description}</p>
                      )}
                      {version.audioPath && (
                        <AudioPlayer
                          audioPath={version.audioPath}
                          duration={version.duration}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="新建作品">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-studio-200 mb-1.5">作品标题 *</label>
            <input
              type="text"
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              className="input"
              placeholder="输入作品名称..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">编曲状态</label>
              <select
                value={newSong.status}
                onChange={(e) => setNewSong({ ...newSong, status: e.target.value as SongStatus })}
                className="select"
              >
                {Object.entries(SONG_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">BPM</label>
              <input
                type="number"
                value={newSong.bpm}
                onChange={(e) => setNewSong({ ...newSong, bpm: e.target.value })}
                className="input"
                placeholder="如: 120"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">调式</label>
              <input
                type="text"
                value={newSong.key}
                onChange={(e) => setNewSong({ ...newSong, key: e.target.value })}
                className="input"
                placeholder="如: G大调"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">情绪基调</label>
              <input
                type="text"
                value={newSong.mood}
                onChange={(e) => setNewSong({ ...newSong, mood: e.target.value })}
                className="input"
                placeholder="如: 忧郁/怀旧"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-studio-200 mb-1.5">灵感说明</label>
            <textarea
              value={newSong.inspiration}
              onChange={(e) => setNewSong({ ...newSong, inspiration: e.target.value })}
              className="textarea h-24"
              placeholder="记录创作灵感、参考曲目..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
              取消
            </button>
            <button onClick={handleAddSong} className="btn btn-primary">
              创建作品
            </button>
          </div>
        </div>
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingSong(null); }} title="编辑作品">
        {editingSong && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">作品标题</label>
              <input
                type="text"
                value={editingSong.title}
                onChange={(e) => setEditingSong({ ...editingSong, title: e.target.value })}
                className="input"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">编曲状态</label>
                <select
                  value={editingSong.status}
                  onChange={(e) => setEditingSong({ ...editingSong, status: e.target.value as SongStatus })}
                  className="select"
                >
                  {Object.entries(SONG_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">BPM</label>
                <input
                  type="number"
                  value={editingSong.bpm || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, bpm: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="input"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">调式</label>
                <input
                  type="text"
                  value={editingSong.key || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, key: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">情绪基调</label>
                <input
                  type="text"
                  value={editingSong.mood || ''}
                  onChange={(e) => setEditingSong({ ...editingSong, mood: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">灵感说明</label>
              <textarea
                value={editingSong.inspiration || ''}
                onChange={(e) => setEditingSong({ ...editingSong, inspiration: e.target.value })}
                className="textarea h-24"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setIsEditModalOpen(false); setEditingSong(null); }} className="btn btn-secondary">
                取消
              </button>
              <button onClick={handleEditSong} className="btn btn-primary">
                保存修改
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
