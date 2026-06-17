import { useState } from 'react';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Briefcase,
  StickyNote,
  Trash2,
  Edit2,
  Users,
  Mic,
  Palette,
  UserCheck,
  MoreHorizontal,
  MessageSquare,
  Calendar,
  Bell,
  BellOff,
  Music,
  CalendarDays,
  Rocket,
} from 'lucide-react';
import { useAppStore, useContactCommunications } from '@/store/useAppStore';
import { Modal } from '@/components/ui/Modal';
import {
  Contact,
  ContactCategory,
  Communication,
  CONTACT_CATEGORY_LABELS,
} from '@/types';
import { formatDate } from '@/utils/date';

const categoryIcons: Record<ContactCategory, typeof Users> = {
  musician: Music,
  engineer: Mic,
  designer: Palette,
  manager: UserCheck,
  other: MoreHorizontal,
};

const categoryColors: Record<ContactCategory, string> = {
  musician: 'text-accent-orange',
  engineer: 'text-accent-indigo',
  designer: 'text-pink-400',
  manager: 'text-emerald-400',
  other: 'text-studio-400',
};

export function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<ContactCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    category: 'musician' as ContactCategory,
    phone: '',
    email: '',
    expertise: '',
    notes: '',
  });
  const [newComm, setNewComm] = useState({
    content: '',
    projectType: '' as '' | 'song' | 'rehearsal' | 'release',
    projectId: '',
    followUp: false,
  });

  const {
    contacts,
    songs,
    rehearsals,
    releases,
    selectedContactId,
    setSelectedContactId,
    addContact,
    updateContact,
    deleteContact,
    addCommunication,
    updateCommunication,
    deleteCommunication,
  } = useAppStore();
  const communications = useContactCommunications(selectedContactId);
  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  const categories: (ContactCategory | 'all')[] = [
    'all',
    'musician',
    'engineer',
    'designer',
    'manager',
    'other',
  ];

  const filteredContacts = contacts.filter((c) => {
    const matchCategory =
      filterCategory === 'all' || c.category === filterCategory;
    const matchSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.expertise?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getCategoryCount = (category: ContactCategory | 'all') => {
    if (category === 'all') return contacts.length;
    return contacts.filter((c) => c.category === category).length;
  };

  const handleAddContact = () => {
    if (!newContact.name.trim()) return;
    addContact({
      ...newContact,
      phone: newContact.phone || undefined,
      email: newContact.email || undefined,
      expertise: newContact.expertise || undefined,
      notes: newContact.notes || undefined,
    });
    setNewContact({
      name: '',
      category: 'musician',
      phone: '',
      email: '',
      expertise: '',
      notes: '',
    });
    setIsAddModalOpen(false);
  };

  const handleEditContact = () => {
    if (!editingContact) return;
    updateContact(editingContact.id, editingContact);
    setIsEditModalOpen(false);
    setEditingContact(null);
  };

  const handleAddComm = () => {
    if (!selectedContactId || !newComm.content.trim()) return;
    addCommunication({
      contactId: selectedContactId,
      content: newComm.content,
      date: new Date().toISOString().split('T')[0],
      projectType: newComm.projectType || undefined,
      projectId: newComm.projectId || undefined,
      followUp: newComm.followUp,
    });
    setNewComm({
      content: '',
      projectType: '',
      projectId: '',
      followUp: false,
    });
    setIsCommModalOpen(false);
  };

  const getProjectName = (comm: Communication) => {
    if (!comm.projectType || !comm.projectId) return null;
    switch (comm.projectType) {
      case 'song':
        return songs.find((s) => s.id === comm.projectId)?.title;
      case 'rehearsal':
        const r = rehearsals.find((r) => r.id === comm.projectId);
        return r ? `排练 - ${formatDate(r.date)}` : null;
      case 'release':
        return releases.find((r) => r.id === comm.projectId)?.title;
      default:
        return null;
    }
  };

  const getProjectIcon = (type?: string) => {
    switch (type) {
      case 'song':
        return <Music className="w-3.5 h-3.5" />;
      case 'rehearsal':
        return <CalendarDays className="w-3.5 h-3.5" />;
      case 'release':
        return <Rocket className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      <div className="w-72 flex flex-col border-r border-studio-700">
        <div className="p-4 border-b border-studio-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-studio-100 font-display">
              联系人
            </h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary text-sm"
            >
              <Plus className="w-4 h-4" />
              新增
            </button>
          </div>

          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-studio-400" />
              <input
                type="text"
                placeholder="搜索联系人..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => {
              const Icon = cat === 'all' ? Users : categoryIcons[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterCategory === cat
                      ? 'bg-accent-orange text-white'
                      : 'bg-studio-800 text-studio-400 hover:text-studio-200 hover:bg-studio-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat === 'all' ? '全部' : CONTACT_CATEGORY_LABELS[cat]}
                  <span className="opacity-70">({getCategoryCount(cat)})</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredContacts.map((contact) => {
            const Icon = categoryIcons[contact.category];
            const colorClass = categoryColors[contact.category];
            return (
              <div
                key={contact.id}
                onClick={() => setSelectedContactId(contact.id)}
                className={`card card-hover p-3 cursor-pointer ${
                  selectedContactId === contact.id
                    ? 'border-accent-orange/50 ring-1 ring-accent-orange/30'
                    : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-studio-700 flex items-center justify-center ${colorClass}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-studio-100 truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-studio-500">
                        {CONTACT_CATEGORY_LABELS[contact.category]}
                      </span>
                    </div>
                    {contact.expertise && (
                      <p className="text-xs text-studio-400 truncate mt-0.5">
                        {contact.expertise}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      {contact.phone && (
                        <span className="text-xs text-studio-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                        </span>
                      )}
                      {contact.email && (
                        <span className="text-xs text-studio-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-studio-400">
              <Users className="w-14 h-14 mb-3 opacity-30" />
              <p className="text-sm">暂无联系人</p>
              <p className="text-xs text-studio-500 mt-1">
                点击"新增"添加第一个联系人
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedContact ? (
        <div className="flex-1 flex flex-col bg-studio-850 animate-slide-in">
          <div className="p-4 border-b border-studio-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-studio-700 flex items-center justify-center ${
                    categoryColors[selectedContact.category]
                  }`}
                >
                  {(() => {
                    const Icon = categoryIcons[selectedContact.category];
                    return <Icon className="w-7 h-7" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-studio-100 font-display">
                    {selectedContact.name}
                  </h2>
                  <span className="text-sm text-studio-400">
                    {CONTACT_CATEGORY_LABELS[selectedContact.category]}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingContact(selectedContact);
                    setIsEditModalOpen(true);
                  }}
                  className="p-2 rounded-lg hover:bg-studio-700 text-studio-400 hover:text-studio-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `确定删除联系人「${selectedContact.name}」吗？相关的沟通记录也会被删除。`
                      )
                    ) {
                      deleteContact(selectedContact.id);
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-studio-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              {selectedContact.phone && (
                <div className="flex items-center gap-3 p-3 bg-studio-800 rounded-lg">
                  <Phone className="w-5 h-5 text-accent-orange" />
                  <div>
                    <p className="text-xs text-studio-500">电话</p>
                    <p className="text-sm text-studio-200">
                      {selectedContact.phone}
                    </p>
                  </div>
                </div>
              )}
              {selectedContact.email && (
                <div className="flex items-center gap-3 p-3 bg-studio-800 rounded-lg">
                  <Mail className="w-5 h-5 text-accent-indigo" />
                  <div>
                    <p className="text-xs text-studio-500">邮箱</p>
                    <p className="text-sm text-studio-200">
                      {selectedContact.email}
                    </p>
                  </div>
                </div>
              )}
              {selectedContact.expertise && (
                <div className="flex items-center gap-3 p-3 bg-studio-800 rounded-lg">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-studio-500">专业领域</p>
                    <p className="text-sm text-studio-200">
                      {selectedContact.expertise}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedContact.notes && (
              <div className="mt-4 p-3 bg-studio-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <StickyNote className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-medium text-studio-400">
                    备注
                  </span>
                </div>
                <p className="text-sm text-studio-300 leading-relaxed">
                  {selectedContact.notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-studio-700 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-studio-200 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent-orange" />
                沟通记录
                <span className="text-xs font-normal text-studio-500">
                  ({communications.length})
                </span>
              </h3>
              <button
                onClick={() => setIsCommModalOpen(true)}
                className="btn btn-secondary text-xs py-1"
              >
                <Plus className="w-3 h-3" />
                记录沟通
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {communications.map((comm) => (
                <div
                  key={comm.id}
                  className="card p-4 border-l-4 border-l-studio-600 hover:border-l-accent-orange transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm text-studio-200 leading-relaxed">
                        {comm.content}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-xs text-studio-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(comm.date)}
                        </span>
                        {comm.projectType && (
                          <span className="text-xs text-accent-indigo flex items-center gap-1 bg-accent-indigo/10 px-2 py-0.5 rounded-full">
                            {getProjectIcon(comm.projectType)}
                            {getProjectName(comm)}
                          </span>
                        )}
                        {comm.followUp && (
                          <span className="text-xs text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full">
                            <Bell className="w-3 h-3" />
                            待跟进
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() =>
                          updateCommunication(comm.id, {
                            followUp: !comm.followUp,
                          })
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
                          comm.followUp
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-studio-500 hover:text-amber-400 hover:bg-amber-500/10'
                        }`}
                        title={comm.followUp ? '取消跟进' : '标记待跟进'}
                      >
                        {comm.followUp ? (
                          <Bell className="w-3.5 h-3.5" />
                        ) : (
                          <BellOff className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('确定删除这条沟通记录吗？')) {
                            deleteCommunication(comm.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-studio-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {communications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-studio-400">
                  <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">暂无沟通记录</p>
                  <p className="text-xs text-studio-500 mt-1">
                    点击"记录沟通"添加第一条
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-studio-850">
          <div className="text-center text-studio-500">
            <Users className="w-20 h-20 mx-auto mb-4 opacity-20" />
            <p className="text-lg">选择一个联系人查看详情</p>
            <p className="text-sm mt-2">或点击"新增"添加新联系人</p>
          </div>
        </div>
      )}

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="新增联系人">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-studio-200 mb-1.5">
                姓名 *
              </label>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
                className="input"
                placeholder="输入联系人姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">
                分类
              </label>
              <select
                value={newContact.category}
                onChange={(e) =>
                  setNewContact({
                    ...newContact,
                    category: e.target.value as ContactCategory,
                  })
                }
                className="select"
              >
                {Object.entries(CONTACT_CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-studio-200 mb-1.5">
                电话
              </label>
              <input
                type="text"
                value={newContact.phone}
                onChange={(e) =>
                  setNewContact({ ...newContact, phone: e.target.value })
                }
                className="input"
                placeholder="如: 138-0000-0000"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-studio-200 mb-1.5">
                邮箱
              </label>
              <input
                type="email"
                value={newContact.email}
                onChange={(e) =>
                  setNewContact({ ...newContact, email: e.target.value })
                }
                className="input"
                placeholder="如: name@example.com"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-studio-200 mb-1.5">
                专业领域
              </label>
              <input
                type="text"
                value={newContact.expertise}
                onChange={(e) =>
                  setNewContact({ ...newContact, expertise: e.target.value })
                }
                className="input"
                placeholder="如: 电吉他、编曲、混音"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-studio-200 mb-1.5">
                备注
              </label>
              <textarea
                value={newContact.notes}
                onChange={(e) =>
                  setNewContact({ ...newContact, notes: e.target.value })
                }
                className="textarea h-20"
                placeholder="记录合作经历、特点等..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="btn btn-secondary"
            >
              取消
            </button>
            <button onClick={handleAddContact} className="btn btn-primary">
              添加联系人
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingContact(null);
        }}
        title="编辑联系人"
      >
        {editingContact && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-studio-200 mb-1.5">
                  姓名
                </label>
                <input
                  type="text"
                  value={editingContact.name}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      name: e.target.value,
                    })
                  }
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">
                  分类
                </label>
                <select
                  value={editingContact.category}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      category: e.target.value as ContactCategory,
                    })
                  }
                  className="select"
                >
                  {Object.entries(CONTACT_CATEGORY_LABELS).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-studio-200 mb-1.5">
                  电话
                </label>
                <input
                  type="text"
                  value={editingContact.phone || ''}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      phone: e.target.value,
                    })
                  }
                  className="input"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-studio-200 mb-1.5">
                  邮箱
                </label>
                <input
                  type="email"
                  value={editingContact.email || ''}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      email: e.target.value,
                    })
                  }
                  className="input"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-studio-200 mb-1.5">
                  专业领域
                </label>
                <input
                  type="text"
                  value={editingContact.expertise || ''}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      expertise: e.target.value,
                    })
                  }
                  className="input"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-studio-200 mb-1.5">
                  备注
                </label>
                <textarea
                  value={editingContact.notes || ''}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      notes: e.target.value,
                    })
                  }
                  className="textarea h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingContact(null);
                }}
                className="btn btn-secondary"
              >
                取消
              </button>
              <button onClick={handleEditContact} className="btn btn-primary">
                保存修改
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isCommModalOpen}
        onClose={() => setIsCommModalOpen(false)}
        title="记录沟通"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-studio-200 mb-1.5">
              沟通内容 *
            </label>
            <textarea
              value={newComm.content}
              onChange={(e) =>
                setNewComm({ ...newComm, content: e.target.value })
              }
              className="textarea h-24"
              placeholder="记录沟通的主要内容..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-studio-200 mb-1.5">
              关联项目
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setNewComm({
                      ...newComm,
                      projectType: newComm.projectType === 'song' ? '' : 'song',
                      projectId: newComm.projectType === 'song' ? '' : newComm.projectId,
                    })
                  }
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    newComm.projectType === 'song'
                      ? 'bg-accent-orange text-white'
                      : 'bg-studio-800 text-studio-400 hover:text-studio-200'
                  }`}
                >
                  <Music className="w-4 h-4" />
                  作品
                </button>
                <button
                  onClick={() =>
                    setNewComm({
                      ...newComm,
                      projectType: newComm.projectType === 'rehearsal' ? '' : 'rehearsal',
                      projectId: newComm.projectType === 'rehearsal' ? '' : newComm.projectId,
                    })
                  }
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    newComm.projectType === 'rehearsal'
                      ? 'bg-accent-orange text-white'
                      : 'bg-studio-800 text-studio-400 hover:text-studio-200'
                  }`}
                >
                  <CalendarDays className="w-4 h-4" />
                  排练
                </button>
                <button
                  onClick={() =>
                    setNewComm({
                      ...newComm,
                      projectType: newComm.projectType === 'release' ? '' : 'release',
                      projectId: newComm.projectType === 'release' ? '' : newComm.projectId,
                    })
                  }
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    newComm.projectType === 'release'
                      ? 'bg-accent-orange text-white'
                      : 'bg-studio-800 text-studio-400 hover:text-studio-200'
                  }`}
                >
                  <Rocket className="w-4 h-4" />
                  发布
                </button>
              </div>

              {newComm.projectType && (
                <select
                  value={newComm.projectId}
                  onChange={(e) =>
                    setNewComm({ ...newComm, projectId: e.target.value })
                  }
                  className="select"
                >
                  <option value="">选择{newComm.projectType === 'song' ? '作品' : newComm.projectType === 'rehearsal' ? '排练' : '发布项目'}</option>
                  {newComm.projectType === 'song' &&
                    songs.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  {newComm.projectType === 'rehearsal' &&
                    rehearsals.map((r) => (
                      <option key={r.id} value={r.id}>
                        {formatDate(r.date)} - {r.location}
                      </option>
                    ))}
                  {newComm.projectType === 'release' &&
                    releases.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title}
                      </option>
                    ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setNewComm({ ...newComm, followUp: !newComm.followUp })
              }
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                newComm.followUp
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-studio-800 text-studio-400 hover:bg-studio-700'
              }`}
            >
              <Bell className="w-5 h-5" />
            </button>
            <span className="text-sm text-studio-300">
              {newComm.followUp ? '需要跟进' : '标记为需要跟进'}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsCommModalOpen(false)}
              className="btn btn-secondary"
            >
              取消
            </button>
            <button onClick={handleAddComm} className="btn btn-primary">
              保存记录
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
