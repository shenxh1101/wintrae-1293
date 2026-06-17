import { Disc3, Calendar, FileText, Rocket, Users } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { TabType } from '@/types';

const navItems: { id: TabType; icon: typeof Disc3; label: string }[] = [
  { id: 'library', icon: Disc3, label: '作品库' },
  { id: 'rehearsals', icon: Calendar, label: '排练表' },
  { id: 'lyrics', icon: FileText, label: '歌词笔记' },
  { id: 'releases', icon: Rocket, label: '发布清单' },
  { id: 'contacts', icon: Users, label: '联系人' },
];

export function Sidebar() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-studio-850 border-r border-studio-700 flex flex-col items-center py-6 gap-2 z-10">
      <div className="w-10 h-10 bg-gradient-to-br from-accent-orange to-accent-indigo rounded-xl flex items-center justify-center mb-4 shadow-glow-orange">
        <Disc3 className="w-6 h-6 text-white" />
      </div>
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group relative ${
              isActive
                ? 'bg-accent-orange/20 text-accent-orange shadow-glow-orange'
                : 'text-studio-400 hover:text-studio-100 hover:bg-studio-800'
            }`}
            title={item.label}
          >
            <Icon className={`w-5 h-5 transition-transform duration-200 ${
              isActive ? 'scale-110' : 'group-hover:scale-110'
            }`} />
            <span className={`absolute left-16 px-2 py-1 bg-studio-700 text-studio-100 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50`}>
              {item.label}
            </span>
          </button>
        );
      })}
      
      <div className="flex-1" />
      
      <div className="w-8 h-8 rounded-full bg-studio-700 flex items-center justify-center text-studio-300 text-xs font-bold">
        M
      </div>
    </div>
  );
}
