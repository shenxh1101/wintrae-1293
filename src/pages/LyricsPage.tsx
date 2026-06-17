import { useState } from 'react';
import { Plus, Music, Edit2, Trash2, Save, X, Lightbulb, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { useAppStore, useSongLyrics } from '@/store/useAppStore';
import { LyricSection, LyricType, LYRIC_TYPE_LABELS } from '@/types';

export function LyricsPage() {
  const [editingLyricId, setEditingLyricId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [newLyricType, setNewLyricType] = useState<LyricType>('verse');
  const [newLyricContent, setNewLyricContent] = useState('');
  const [newLyricNotes, setNewLyricNotes] = useState('');

  const { songs, selectedSongId, setSelectedSongId, addLyricSection, updateLyricSection, deleteLyricSection } = useAppStore();
  const lyrics = useSongLyrics(selectedSongId);
  const selectedSong = songs.find(s => s.id === selectedSongId);

  const lyricTypes: LyricType[] = ['intro', 'verse', 'pre_chorus', 'chorus', 'bridge', 'outro', 'instrumental'];

  const handleStartEdit = (lyric: LyricSection) => {
    setEditingLyricId(lyric.id);
    setEditContent(lyric.content);
    setEditNotes(lyric.notes || '');
  };

  const handleSaveEdit = () => {
    if (!editingLyricId) return;
    updateLyricSection(editingLyricId, {
      content: editContent,
      notes: editNotes || undefined,
    });
    setEditingLyricId(null);
    setEditContent('');
    setEditNotes('');
  };

  const handleCancelEdit = () => {
    setEditingLyricId(null);
    setEditContent('');
    setEditNotes('');
  };

  const handleAddLyric = () => {
    if (!selectedSongId || !newLyricContent.trim()) return;
    addLyricSection({
      songId: selectedSongId,
      type: newLyricType,
      content: newLyricContent,
      orderIndex: lyrics.length,
      notes: newLyricNotes || undefined,
    });
    setNewLyricContent('');
    setNewLyricNotes('');
  };

  const handleMoveLyric = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === lyrics.length - 1)) return;
    
    const newLyrics = [...lyrics];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newLyrics[index], newLyrics[swapIndex]] = [newLyrics[swapIndex], newLyrics[index]];
    
    newLyrics.forEach((lyric, i) => {
      updateLyricSection(lyric.id, { orderIndex: i });
    });
  };

  const getLyricTypeColor = (type: LyricType) => {
    const colors: Record<LyricType, string> = {
      intro: 'bg-studio-600 text-studio-200',
      verse: 'bg-blue-500/20 text-blue-400',
      pre_chorus: 'bg-purple-500/20 text-purple-400',
      chorus: 'bg-accent-orange/20 text-accent-orange',
      bridge: 'bg-green-500/20 text-green-400',
      outro: 'bg-studio-600 text-studio-200',
      instrumental: 'bg-pink-500/20 text-pink-400',
    };
    return colors[type];
  };

  return (
    <div className="h-full flex">
      <div className="w-72 bg-studio-850 border-r border-studio-700 flex flex-col">
        <div className="p-4 border-b border-studio-700">
          <h1 className="text-xl font-bold text-studio-100 font-display">歌词笔记</h1>
          <p className="text-sm text-studio-400 mt-1">选择作品编辑歌词</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {songs.map((song) => (
            <button
              key={song.id}
              onClick={() => setSelectedSongId(song.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedSongId === song.id
                  ? 'bg-accent-orange/20 border border-accent-orange/50'
                  : 'bg-studio-800 border border-studio-700 hover:bg-studio-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Music className={`w-4 h-4 ${selectedSongId === song.id ? 'text-accent-orange' : 'text-studio-400'}`} />
                <span className={`font-medium truncate ${selectedSongId === song.id ? 'text-accent-orange' : 'text-studio-200'}`}>
                  {song.title}
                </span>
              </div>
              <div className="text-xs text-studio-500 pl-6">
                {lyrics.filter(l => l.songId === song.id).length} 个段落
              </div>
            </button>
          ))}
          
          {songs.length === 0 && (
            <div className="text-center py-12 text-studio-500">
              <Music className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">还没有作品</p>
              <p className="text-xs mt-1">请先在作品库中创建</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        {selectedSong ? (
          <>
            <div className="p-4 border-b border-studio-700">
              <h2 className="text-xl font-bold text-studio-100 font-display mb-1">{selectedSong.title}</h2>
              {selectedSong.mood && (
                <p className="text-sm text-studio-400">情绪：{selectedSong.mood}</p>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                {lyrics.map((lyric, index) => (
                  <div
                    key={lyric.id}
                    className="card p-5 relative group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getLyricTypeColor(lyric.type)}`}>
                          {LYRIC_TYPE_LABELS[lyric.type]}
                        </span>
                        <span className="text-xs text-studio-500">段落 {index + 1}</span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleMoveLyric(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-studio-700 text-studio-400 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveLyric(index, 'down')}
                          disabled={index === lyrics.length - 1}
                          className="p-1 rounded hover:bg-studio-700 text-studio-400 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStartEdit(lyric)}
                          className="p-1 rounded hover:bg-studio-700 text-studio-400 hover:text-studio-200"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('确定删除这个段落吗？')) {
                              deleteLyricSection(lyric.id);
                            }
                          }}
                          className="p-1 rounded hover:bg-red-500/20 text-studio-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    {editingLyricId === lyric.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="textarea h-32 font-mono text-sm leading-relaxed"
                          placeholder="输入歌词内容..."
                        />
                        <div>
                          <label className="block text-xs font-medium text-studio-400 mb-1">灵感备注</label>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            className="textarea h-16 text-sm"
                            placeholder="修改灵感、备注..."
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={handleCancelEdit} className="btn btn-secondary text-xs py-1">
                            <X className="w-3 h-3" />
                            取消
                          </button>
                          <button onClick={handleSaveEdit} className="btn btn-primary text-xs py-1">
                            <Save className="w-3 h-3" />
                            保存
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-studio-200">
                          {lyric.content}
                        </pre>
                        {lyric.notes && (
                          <div className="mt-3 pt-3 border-t border-studio-700 flex items-start gap-2 text-xs text-studio-400">
                            <Lightbulb className="w-4 h-4 text-accent-orange flex-shrink-0 mt-0.5" />
                            <span>{lyric.notes}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                
                {lyrics.length === 0 && (
                  <div className="text-center py-16 text-studio-500">
                    <GripVertical className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-lg mb-1">还没有歌词</p>
                    <p className="text-sm">在下方添加第一个歌词段落</p>
                  </div>
                )}
                
                <div className="card p-5 mt-6 bg-studio-800/50">
                  <h3 className="text-sm font-semibold text-studio-200 mb-3 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-accent-orange" />
                    添加新段落
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-studio-400 mb-1">段落类型</label>
                      <select
                        value={newLyricType}
                        onChange={(e) => setNewLyricType(e.target.value as LyricType)}
                        className="select text-sm"
                      >
                        {lyricTypes.map((type) => (
                          <option key={type} value={type}>{LYRIC_TYPE_LABELS[type]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-studio-400 mb-1">歌词内容</label>
                      <textarea
                        value={newLyricContent}
                        onChange={(e) => setNewLyricContent(e.target.value)}
                        className="textarea h-32 font-mono text-sm leading-relaxed"
                        placeholder="输入歌词内容，每一行代表一句..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-studio-400 mb-1">灵感备注（可选）</label>
                      <textarea
                        value={newLyricNotes}
                        onChange={(e) => setNewLyricNotes(e.target.value)}
                        className="textarea h-16 text-sm"
                        placeholder="记录创作灵感、修改建议..."
                      />
                    </div>
                    <button
                      onClick={handleAddLyric}
                      disabled={!newLyricContent.trim()}
                      className="btn btn-primary text-sm w-full disabled:opacity-50"
                    >
                      添加段落
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-studio-500">
            <div className="text-center">
              <Music className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">选择一个作品开始编辑歌词</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
