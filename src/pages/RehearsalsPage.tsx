import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Clock, MapPin, Users, Music, Trash2, Edit2, Target, User, UserCheck } from 'lucide-react';
import { useAppStore, useRehearsalTracks } from '@/store/useAppStore';
import { Modal } from '@/components/ui/Modal';
import { Rehearsal, CONTACT_CATEGORY_LABELS } from '@/types';
import { getDaysInMonth, getFirstDayOfMonth, getMonthName, isSameDay, isToday, formatDate, formatTime, getDateString } from '@/utils/date';

export function RehearsalsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRehearsal, setEditingRehearsal] = useState<Rehearsal | null>(null);
  const [newRehearsal, setNewRehearsal] = useState({
    date: getDateString(new Date()),
    startTime: '19:00',
    endTime: '22:00',
    location: '',
    notes: '',
    memberIds: [] as string[],
  });
  const [newTrackSongId, setNewTrackSongId] = useState('');
  const [newTrackFocus, setNewTrackFocus] = useState('');

  const { rehearsals, songs, contacts, selectedRehearsalId, setSelectedRehearsalId, addRehearsal, updateRehearsal, deleteRehearsal, addRehearsalTrack, updateRehearsalTrack, deleteRehearsalTrack } = useAppStore();
  const selectedRehearsal = rehearsals.find(r => r.id === selectedRehearsalId);
  const tracks = useRehearsalTracks(selectedRehearsalId);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const hasRehearsalOnDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return rehearsals.some(r => r.date === dateStr);
  };

  const getRehearsalsOnDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return rehearsals.filter(r => r.date === dateStr);
  };

  const getMember = (memberId: string) => contacts.find(c => c.id === memberId);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayRehearsals = rehearsals.filter(r => r.date === dateStr);
    if (dayRehearsals.length > 0) {
      setSelectedRehearsalId(dayRehearsals[0].id);
    }
  };

  const toggleNewMember = (memberId: string) => {
    setNewRehearsal(prev => ({
      ...prev,
      memberIds: prev.memberIds.includes(memberId)
        ? prev.memberIds.filter(id => id !== memberId)
        : [...prev.memberIds, memberId]
    }));
  };

  const toggleEditMember = (memberId: string) => {
    if (!editingRehearsal) return;
    const currentMembers = editingRehearsal.memberIds || [];
    setEditingRehearsal({
      ...editingRehearsal,
      memberIds: currentMembers.includes(memberId)
        ? currentMembers.filter(id => id !== memberId)
        : [...currentMembers, memberId]
    });
  };

  const handleAddRehearsal = () => {
    if (!newRehearsal.date || !newRehearsal.location) return;
    addRehearsal({
      ...newRehearsal,
      memberIds: newRehearsal.memberIds.length > 0 ? newRehearsal.memberIds : undefined,
    });
    setNewRehearsal({ date: getDateString(new Date()), startTime: '19:00', endTime: '22:00', location: '', notes: '', memberIds: [] });
    setIsAddModalOpen(false);
  };

  const handleEditRehearsal = () => {
    if (!editingRehearsal) return;
    updateRehearsal(editingRehearsal.id, editingRehearsal);
    setIsEditModalOpen(false);
    setEditingRehearsal(null);
  };

  const handleAddTrack = () => {
    if (!selectedRehearsalId || !newTrackSongId) return;
    addRehearsalTrack({
      rehearsalId: selectedRehearsalId,
      songId: newTrackSongId,
      orderIndex: tracks.length,
      focusPoints: newTrackFocus || undefined,
    });
    setNewTrackSongId('');
    setNewTrackFocus('');
  };

  const handleMoveTrack = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === tracks.length - 1)) return;
    
    const newTracks = [...tracks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newTracks[index], newTracks[swapIndex]] = [newTracks[swapIndex], newTracks[index]];
    
    newTracks.forEach((track, i) => {
      updateRehearsalTrack(track.id, { orderIndex: i });
    });
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col border-r border-studio-700">
        <div className="p-4 border-b border-studio-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-studio-100 font-display">排练表</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              新建排练
            </button>
          </div>
          
          <div className="flex items-center justify-between bg-studio-800 rounded-lg p-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg hover:bg-studio-700 text-studio-400 hover:text-studio-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-studio-100 font-display">
              {year}年 {getMonthName(month)}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-studio-700 text-studio-400 hover:text-studio-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day, i) => (
              <div
                key={day}
                className={`text-center text-xs font-medium py-2 ${
                  i === 0 || i === 6 ? 'text-accent-orange' : 'text-studio-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) return <div key={index} className="h-24" />;
              
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const date = new Date(dateStr);
              const dayRehearsals = getRehearsalsOnDay(day);
              const hasRehearsal = dayRehearsals.length > 0;
              const isSelected = selectedRehearsal && isSameDay(selectedRehearsal.date, date);
              
              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(day)}
                  className={`h-24 p-2 rounded-lg border transition-all cursor-pointer ${
                    isToday(date)
                      ? 'border-accent-orange/50 bg-accent-orange/10'
                      : isSelected
                      ? 'border-accent-orange/50 bg-studio-800'
                      : 'border-studio-700 bg-studio-850 hover:bg-studio-800'
                  }`}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday(date) ? 'text-accent-orange' : 'text-studio-300'
                  }`}>
                    {day}
                  </div>
                  {hasRehearsal && (
                    <div className="space-y-1">
                      {dayRehearsals.slice(0, 2).map((r) => (
                        <div
                          key={r.id}
                          className="text-xs bg-accent-orange/20 text-accent-orange px-1.5 py-0.5 rounded truncate"
                        >
                          {formatTime(r.startTime)}
                        </div>
                      ))}
                      {dayRehearsals.length > 2 && (
                        <div className="text-xs text-studio-500">+{dayRehearsals.length - 2} 更多</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {selectedRehearsal && (
        <div className="w-96 bg-studio-850 flex flex-col animate-slide-in">
          <div className="p-4 border-b border-studio-700">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold text-studio-100 font-display mb-1">
                  {formatDate(selectedRehearsal.date)}
                </h2>
                <div className="flex items-center gap-2 text-sm text-studio-400">
                  <Clock className="w-4 h-4" />
                  {formatTime(selectedRehearsal.startTime)} - {formatTime(selectedRehearsal.endTime)}
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingRehearsal(selectedRehearsal);
                    setIsEditModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg hover:bg-studio-700 text-studio-400 hover:text-studio-200 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('确定删除这个排练吗？')) {
                      deleteRehearsal(selectedRehearsal.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-500/20 text-studio-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-studio-300 mb-2">
              <MapPin className="w-4 h-4 text-accent-indigo" />
              {selectedRehearsal.location}
            </div>

            {selectedRehearsal.memberIds && selectedRehearsal.memberIds.length > 0 && (
              <div className="mb-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-studio-400 mb-2">
                  <Users className="w-3.5 h-3.5" />
                  参与成员 ({selectedRehearsal.memberIds.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRehearsal.memberIds.map((memberId) => {
                    const member = getMember(memberId);
                    if (!member) return null;
                    return (
                      <div
                        key={memberId}
                        className="flex items-center gap-1.5 px-2 py-1 bg-studio-800 border border-studio-700 rounded-lg"
                      >
                        <div className="w-5 h-5 rounded-full bg-accent-orange/20 flex items-center justify-center">
                          <User className="w-3 h-3 text-accent-orange" />
                        </div>
                        <span className="text-xs text-studio-200">{member.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {selectedRehearsal.notes && (
              <p className="text-sm text-studio-400 bg-studio-800 p-2 rounded-lg border border-studio-700">
                {selectedRehearsal.notes}
              </p>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-studio-200 flex items-center gap-2">
                  <Music className="w-4 h-4 text-accent-orange" />
                  排练曲目 ({tracks.length})
                </h3>
              </div>
              
              <div className="space-y-2 mb-4">
                {tracks.map((track, index) => {
                  const song = songs.find(s => s.id === track.songId);
                  return (
                    <div
                      key={track.id}
                      className="bg-studio-800 rounded-lg p-3 border border-studio-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 bg-studio-700 rounded-full text-xs font-bold text-studio-300">
                            {index + 1}
                          </span>
                          <span className="font-medium text-studio-100">{song?.title || '未知曲目'}</span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleMoveTrack(index, 'up')}
                            disabled={index === 0}
                            className="p-1 rounded hover:bg-studio-700 text-studio-400 disabled:opacity-30"
                          >
                            <ChevronLeft className="w-3.5 h-3.5 rotate-90" />
                          </button>
                          <button
                            onClick={() => handleMoveTrack(index, 'down')}
                            disabled={index === tracks.length - 1}
                            className="p-1 rounded hover:bg-studio-700 text-studio-400 disabled:opacity-30"
                          >
                            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                          </button>
                          <button
                            onClick={() => deleteRehearsalTrack(track.id)}
                            className="p-1 rounded hover:bg-red-500/20 text-studio-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {track.focusPoints && (
                        <div className="text-xs text-studio-400 flex items-start gap-2 bg-studio-900/50 p-2 rounded">
                          <Target className="w-3.5 h-3.5 text-accent-orange mt-0.5 flex-shrink-0" />
                          <span>{track.focusPoints}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {tracks.length === 0 && (
                  <p className="text-sm text-studio-500 text-center py-4">还没有添加曲目</p>
                )}
              </div>
              
              <div className="space-y-3 p-3 bg-studio-800 rounded-lg border border-studio-700">
                <h4 className="text-xs font-medium text-studio-300 flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5" />
                  添加曲目
                </h4>
                <select
                  value={newTrackSongId}
                  onChange={(e) => setNewTrackSongId(e.target.value)}
                  className="select text-sm"
                >
                  <option value="">选择曲目...</option>
                  {songs.map((song) => (
                    <option key={song.id} value={song.id}>{song.title}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTrackFocus}
                  onChange={(e) => setNewTrackFocus(e.target.value)}
                  className="input text-sm"
                  placeholder="待练重点（可选）"
                />
                <button
                  onClick={handleAddTrack}
                  disabled={!newTrackSongId}
                  className="btn btn-primary text-sm w-full disabled:opacity-50"
                >
                  添加到排练单
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="新建排练">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">日期 *</label>
              <input
                type="date"
                value={newRehearsal.date}
                onChange={(e) => setNewRehearsal({ ...newRehearsal, date: e.target.value })}
                className="input"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">开始时间</label>
                <input
                  type="time"
                  value={newRehearsal.startTime}
                  onChange={(e) => setNewRehearsal({ ...newRehearsal, startTime: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">结束时间</label>
                <input
                  type="time"
                  value={newRehearsal.endTime}
                  onChange={(e) => setNewRehearsal({ ...newRehearsal, endTime: e.target.value })}
                  className="input"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-studio-200 mb-1.5">地点 *</label>
            <input
              type="text"
              value={newRehearsal.location}
              onChange={(e) => setNewRehearsal({ ...newRehearsal, location: e.target.value })}
              className="input"
              placeholder="如: 蜂巢排练室 B203"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-studio-200 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-accent-orange" />
              参与成员
            </label>
            {contacts.length === 0 ? (
              <p className="text-xs text-studio-500 p-3 bg-studio-800 rounded-lg border border-studio-700">
                暂无联系人，请先在"联系人"页面添加乐手信息
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                {contacts.map((contact) => {
                  const isSelected = newRehearsal.memberIds.includes(contact.id);
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => toggleNewMember(contact.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-accent-orange/15 border-accent-orange/50 text-studio-100'
                          : 'bg-studio-800 border-studio-700 text-studio-300 hover:border-studio-600'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-accent-orange text-white' : 'bg-studio-700 text-studio-400'
                      }`}>
                        {isSelected ? <UserCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{contact.name}</p>
                        <p className="text-[10px] text-studio-500 truncate">
                          {CONTACT_CATEGORY_LABELS[contact.category]}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-studio-200 mb-1.5">备注</label>
            <textarea
              value={newRehearsal.notes}
              onChange={(e) => setNewRehearsal({ ...newRehearsal, notes: e.target.value })}
              className="textarea h-20"
              placeholder="排练注意事项..."
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
              取消
            </button>
            <button onClick={handleAddRehearsal} className="btn btn-primary">
              创建排练
            </button>
          </div>
        </div>
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingRehearsal(null); }} title="编辑排练">
        {editingRehearsal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">日期</label>
                <input
                  type="date"
                  value={editingRehearsal.date}
                  onChange={(e) => setEditingRehearsal({ ...editingRehearsal, date: e.target.value })}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-studio-200 mb-1.5">开始时间</label>
                  <input
                    type="time"
                    value={editingRehearsal.startTime}
                    onChange={(e) => setEditingRehearsal({ ...editingRehearsal, startTime: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-studio-200 mb-1.5">结束时间</label>
                  <input
                    type="time"
                    value={editingRehearsal.endTime}
                    onChange={(e) => setEditingRehearsal({ ...editingRehearsal, endTime: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">地点</label>
              <input
                type="text"
                value={editingRehearsal.location}
                onChange={(e) => setEditingRehearsal({ ...editingRehearsal, location: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-studio-200 mb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-accent-orange" />
                参与成员
              </label>
              {contacts.length === 0 ? (
                <p className="text-xs text-studio-500 p-3 bg-studio-800 rounded-lg border border-studio-700">
                  暂无联系人，请先在"联系人"页面添加乐手信息
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                  {contacts.map((contact) => {
                    const isSelected = (editingRehearsal.memberIds || []).includes(contact.id);
                    return (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => toggleEditMember(contact.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'bg-accent-orange/15 border-accent-orange/50 text-studio-100'
                            : 'bg-studio-800 border-studio-700 text-studio-300 hover:border-studio-600'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-accent-orange text-white' : 'bg-studio-700 text-studio-400'
                        }`}>
                          {isSelected ? <UserCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{contact.name}</p>
                          <p className="text-[10px] text-studio-500 truncate">
                            {CONTACT_CATEGORY_LABELS[contact.category]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">备注</label>
              <textarea
                value={editingRehearsal.notes || ''}
                onChange={(e) => setEditingRehearsal({ ...editingRehearsal, notes: e.target.value })}
                className="textarea h-20"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setIsEditModalOpen(false); setEditingRehearsal(null); }} className="btn btn-secondary">
                取消
              </button>
              <button onClick={handleEditRehearsal} className="btn btn-primary">
                保存修改
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
