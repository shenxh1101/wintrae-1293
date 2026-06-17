import { useState } from 'react';
import { Plus, Upload, Calendar, FileText, CheckCircle2, Circle, Trash2, Edit2, Music2, ExternalLink, Clock, CheckSquare, Image } from 'lucide-react';
import { useAppStore, useReleaseTodos } from '@/store/useAppStore';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { ReleaseItem, ReleaseStatus, ReleaseTodo, PLATFORM_LABELS, RELEASE_STATUS_LABELS, PlatformType } from '@/types';
import { formatDate, getDaysUntil } from '@/utils/date';

export function ReleasesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRelease, setEditingRelease] = useState<ReleaseItem | null>(null);
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [newRelease, setNewRelease] = useState({
    title: '',
    songId: '',
    status: 'planning' as ReleaseStatus,
    releaseDate: '',
    copyrightInfo: '',
    isrc: '',
    platforms: [] as PlatformType[],
  });

  const { releases, songs, selectedReleaseId, setSelectedReleaseId, addRelease, updateRelease, deleteRelease, addReleaseTodo, toggleReleaseTodo, deleteReleaseTodo } = useAppStore();
  const selectedRelease = releases.find(r => r.id === selectedReleaseId);
  const todos = useReleaseTodos(selectedReleaseId);

  const platforms: PlatformType[] = ['netease', 'qq', 'spotify', 'apple', 'youtube', 'bandcamp', 'other'];
  const statuses: ReleaseStatus[] = ['planning', 'ready', 'submitted', 'published', 'archived'];

  const getReleasesByStatus = (status: ReleaseStatus) => {
    return releases.filter(r => r.status === status);
  };

  const handleAddRelease = () => {
    if (!newRelease.title.trim()) return;
    addRelease({
      ...newRelease,
      songId: newRelease.songId || undefined,
      releaseDate: newRelease.releaseDate || undefined,
      copyrightInfo: newRelease.copyrightInfo || undefined,
      isrc: newRelease.isrc || undefined,
    });
    setNewRelease({
      title: '',
      songId: '',
      status: 'planning',
      releaseDate: '',
      copyrightInfo: '',
      isrc: '',
      platforms: [],
    });
    setIsAddModalOpen(false);
  };

  const handleEditRelease = () => {
    if (!editingRelease) return;
    updateRelease(editingRelease.id, editingRelease);
    setIsEditModalOpen(false);
    setEditingRelease(null);
  };

  const handleAddTodo = () => {
    if (!selectedReleaseId || !newTodo.trim()) return;
    addReleaseTodo({
      releaseId: selectedReleaseId,
      task: newTodo,
      completed: false,
      dueDate: newTodoDueDate || undefined,
    });
    setNewTodo('');
    setNewTodoDueDate('');
  };

  const togglePlatform = (platform: PlatformType) => {
    setNewRelease(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const toggleEditPlatform = (platform: PlatformType) => {
    if (!editingRelease) return;
    setEditingRelease(prev => prev ? {
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    } : null);
  };

  const completedTodos = todos.filter(t => t.completed).length;
  const progress = todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col border-r border-studio-700">
        <div className="p-4 border-b border-studio-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-studio-100 font-display">发布清单</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              新建发布
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {statuses.map((status) => (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <StatusBadge status={status} size="sm" />
                  <span className="text-xs text-studio-500">{getReleasesByStatus(status).length}</span>
                </div>
                
                <div className="space-y-2">
                  {getReleasesByStatus(status).map((release) => {
                    const releaseTodos = useReleaseTodos(release.id);
                    const releaseCompleted = releaseTodos.filter(t => t.completed).length;
                    const releaseProgress = releaseTodos.length > 0 ? Math.round((releaseCompleted / releaseTodos.length) * 100) : 0;
                    const daysUntil = release.releaseDate ? getDaysUntil(release.releaseDate) : null;
                    
                    return (
                      <div
                        key={release.id}
                        onClick={() => setSelectedReleaseId(release.id)}
                        className={`card card-hover p-4 cursor-pointer ${
                          selectedReleaseId === release.id ? 'border-accent-orange/50 ring-1 ring-accent-orange/30' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-studio-100 truncate">{release.title}</h3>
                            {release.songId && (
                              <div className="text-xs text-studio-500 flex items-center gap-1 mt-0.5">
                                <Music2 className="w-3 h-3" />
                                {songs.find(s => s.id === release.songId)?.title || '未知作品'}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingRelease(release);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1 rounded hover:bg-studio-700 text-studio-400 hover:text-studio-200 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`确定删除「${release.title}」吗？`)) {
                                  deleteRelease(release.id);
                                }
                              }}
                              className="p-1 rounded hover:bg-red-500/20 text-studio-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        
                        {release.releaseDate && (
                          <div className={`flex items-center gap-1 text-xs mb-2 ${
                            daysUntil !== null && daysUntil < 0 ? 'text-red-400' : 
                            daysUntil !== null && daysUntil <= 7 ? 'text-accent-orange' : 'text-studio-400'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {daysUntil !== null && daysUntil > 0 && `还有 ${daysUntil} 天 · `}
                            {daysUntil !== null && daysUntil === 0 && '今天上线 · '}
                            {daysUntil !== null && daysUntil < 0 && `已上线 ${-daysUntil} 天 · `}
                            {formatDate(release.releaseDate)}
                          </div>
                        )}
                        
                        {release.platforms.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-3">
                            {release.platforms.slice(0, 4).map((platform) => (
                              <span
                                key={platform}
                                className="px-1.5 py-0.5 bg-studio-700 rounded text-[10px] text-studio-300"
                              >
                                {PLATFORM_LABELS[platform]}
                              </span>
                            ))}
                            {release.platforms.length > 4 && (
                              <span className="px-1.5 py-0.5 bg-studio-700 rounded text-[10px] text-studio-400">
                                +{release.platforms.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {releaseTodos.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between text-xs text-studio-500 mb-1">
                              <span className="flex items-center gap-1">
                                <CheckSquare className="w-3 h-3" />
                                {releaseCompleted}/{releaseTodos.length} 待办
                              </span>
                              <span>{releaseProgress}%</span>
                            </div>
                            <div className="h-1.5 bg-studio-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent-orange rounded-full transition-all duration-300"
                                style={{ width: `${releaseProgress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedRelease && (
        <div className="w-96 bg-studio-850 flex flex-col animate-slide-in">
          <div className="p-4 border-b border-studio-700">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold text-studio-100 font-display">{selectedRelease.title}</h2>
                <StatusBadge status={selectedRelease.status} size="sm" />
              </div>
            </div>
            
            {selectedRelease.coverPath ? (
              <div className="mt-3 aspect-square bg-studio-900 rounded-lg overflow-hidden">
                <img src={selectedRelease.coverPath} alt="封面" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="mt-3 aspect-square bg-studio-900 rounded-lg flex items-center justify-center border-2 border-dashed border-studio-700">
                <div className="text-center text-studio-500">
                  <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">暂无封面</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {selectedRelease.releaseDate && (
              <div>
                <h3 className="text-xs font-medium text-studio-400 mb-1.5 uppercase tracking-wider">上线日期</h3>
                <div className="flex items-center gap-2 text-studio-200">
                  <Calendar className="w-4 h-4 text-accent-orange" />
                  <span>{formatDate(selectedRelease.releaseDate)}</span>
                  {(() => {
                    const days = getDaysUntil(selectedRelease.releaseDate!);
                    if (days > 0) return <span className="text-xs text-studio-500">({days}天后)</span>;
                    if (days === 0) return <span className="text-xs text-accent-orange">今天!</span>;
                    return <span className="text-xs text-studio-500">({-days}天前)</span>;
                  })()}
                </div>
              </div>
            )}
            
            {selectedRelease.isrc && (
              <div>
                <h3 className="text-xs font-medium text-studio-400 mb-1.5 uppercase tracking-wider">ISRC 编码</h3>
                <div className="flex items-center gap-2 text-studio-200 font-mono text-sm">
                  <FileText className="w-4 h-4 text-accent-indigo" />
                  {selectedRelease.isrc}
                </div>
              </div>
            )}
            
            {selectedRelease.copyrightInfo && (
              <div>
                <h3 className="text-xs font-medium text-studio-400 mb-1.5 uppercase tracking-wider">版权信息</h3>
                <p className="text-sm text-studio-300">{selectedRelease.copyrightInfo}</p>
              </div>
            )}
            
            {selectedRelease.platforms.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-studio-400 mb-2 uppercase tracking-wider">发布平台</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRelease.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-3 py-1.5 bg-studio-800 border border-studio-700 rounded-lg text-xs text-studio-200 flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {PLATFORM_LABELS[platform]}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-studio-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-accent-orange" />
                  待办清单
                  {todos.length > 0 && (
                    <span className="text-studio-500">({completedTodos}/{todos.length})</span>
                  )}
                </h3>
              </div>
              
              {todos.length > 0 && (
                <div className="h-1.5 bg-studio-700 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-accent-orange rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              
              <div className="space-y-2 mb-4">
                {todos.map((todo) => (
                  <div
                    key={todo.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      todo.completed
                        ? 'bg-studio-800/50 border-studio-700/50'
                        : 'bg-studio-800 border-studio-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleReleaseTodo(todo.id)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-studio-500 hover:text-accent-orange transition-colors" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${todo.completed ? 'text-studio-500 line-through' : 'text-studio-200'}`}>
                        {todo.task}
                      </p>
                      {todo.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-studio-500 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(todo.dueDate)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteReleaseTodo(todo.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-studio-400 hover:text-red-400 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 p-3 bg-studio-800 rounded-lg border border-studio-700">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="input text-sm"
                  placeholder="添加待办事项..."
                />
                <input
                  type="date"
                  value={newTodoDueDate}
                  onChange={(e) => setNewTodoDueDate(e.target.value)}
                  className="input text-sm"
                />
                <button
                  onClick={handleAddTodo}
                  disabled={!newTodo.trim()}
                  className="btn btn-primary text-sm w-full disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" />
                  添加待办
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="新建发布" size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">标题 *</label>
              <input
                type="text"
                value={newRelease.title}
                onChange={(e) => setNewRelease({ ...newRelease, title: e.target.value })}
                className="input"
                placeholder="发布标题"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">关联作品</label>
              <select
                value={newRelease.songId}
                onChange={(e) => setNewRelease({ ...newRelease, songId: e.target.value })}
                className="select"
              >
                <option value="">选择作品...</option>
                {songs.map((song) => (
                  <option key={song.id} value={song.id}>{song.title}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">状态</label>
              <select
                value={newRelease.status}
                onChange={(e) => setNewRelease({ ...newRelease, status: e.target.value as ReleaseStatus })}
                className="select"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{RELEASE_STATUS_LABELS[status]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">计划上线日期</label>
              <input
                type="date"
                value={newRelease.releaseDate}
                onChange={(e) => setNewRelease({ ...newRelease, releaseDate: e.target.value })}
                className="input"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">ISRC 编码</label>
              <input
                type="text"
                value={newRelease.isrc}
                onChange={(e) => setNewRelease({ ...newRelease, isrc: e.target.value })}
                className="input"
                placeholder="如: CN-B34-24-00001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">版权信息</label>
              <input
                type="text"
                value={newRelease.copyrightInfo}
                onChange={(e) => setNewRelease({ ...newRelease, copyrightInfo: e.target.value })}
                className="input"
                placeholder="如: © 2024 工作室名称"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-studio-200 mb-2">发布平台</label>
            <div className="grid grid-cols-4 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    newRelease.platforms.includes(platform)
                      ? 'bg-accent-orange/20 text-accent-orange border border-accent-orange/50'
                      : 'bg-studio-800 text-studio-400 border border-studio-700 hover:border-studio-600'
                  }`}
                >
                  {PLATFORM_LABELS[platform]}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
              取消
            </button>
            <button onClick={handleAddRelease} className="btn btn-primary">
              创建发布
            </button>
          </div>
        </div>
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingRelease(null); }} title="编辑发布" size="lg">
        {editingRelease && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">标题</label>
                <input
                  type="text"
                  value={editingRelease.title}
                  onChange={(e) => setEditingRelease({ ...editingRelease, title: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">关联作品</label>
                <select
                  value={editingRelease.songId || ''}
                  onChange={(e) => setEditingRelease({ ...editingRelease, songId: e.target.value || undefined })}
                  className="select"
                >
                  <option value="">选择作品...</option>
                  {songs.map((song) => (
                    <option key={song.id} value={song.id}>{song.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">状态</label>
                <select
                  value={editingRelease.status}
                  onChange={(e) => setEditingRelease({ ...editingRelease, status: e.target.value as ReleaseStatus })}
                  className="select"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>{RELEASE_STATUS_LABELS[status]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">计划上线日期</label>
                <input
                  type="date"
                  value={editingRelease.releaseDate || ''}
                  onChange={(e) => setEditingRelease({ ...editingRelease, releaseDate: e.target.value || undefined })}
                  className="input"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">ISRC 编码</label>
                <input
                  type="text"
                  value={editingRelease.isrc || ''}
                  onChange={(e) => setEditingRelease({ ...editingRelease, isrc: e.target.value || undefined })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">版权信息</label>
                <input
                  type="text"
                  value={editingRelease.copyrightInfo || ''}
                  onChange={(e) => setEditingRelease({ ...editingRelease, copyrightInfo: e.target.value || undefined })}
                  className="input"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-2">发布平台</label>
              <div className="grid grid-cols-4 gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => toggleEditPlatform(platform)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      editingRelease.platforms.includes(platform)
                        ? 'bg-accent-orange/20 text-accent-orange border border-accent-orange/50'
                        : 'bg-studio-800 text-studio-400 border border-studio-700 hover:border-studio-600'
                    }`}
                  >
                    {PLATFORM_LABELS[platform]}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setIsEditModalOpen(false); setEditingRelease(null); }} className="btn btn-secondary">
                取消
              </button>
              <button onClick={handleEditRelease} className="btn btn-primary">
                保存修改
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
