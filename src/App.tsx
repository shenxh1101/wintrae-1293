import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { LibraryPage } from '@/pages/LibraryPage';
import { RehearsalsPage } from '@/pages/RehearsalsPage';
import { LyricsPage } from '@/pages/LyricsPage';
import { ReleasesPage } from '@/pages/ReleasesPage';
import { ContactsPage } from '@/pages/ContactsPage';
import { useAppStore } from '@/store/useAppStore';
import { TabType, TAB_LABELS } from '@/types';
import { hasStoredData } from '@/utils/storage';

function App() {
  const { activeTab, loadFromStorage, initWithMockData } = useAppStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;
    
    loadFromStorage();
    
    if (!hasStoredData()) {
      initWithMockData();
    }
    
    setInitialized(true);
  }, [initialized, loadFromStorage, initWithMockData]);

  const renderPage = () => {
    switch (activeTab) {
      case 'library':
        return <LibraryPage />;
      case 'rehearsals':
        return <RehearsalsPage />;
      case 'lyrics':
        return <LyricsPage />;
      case 'releases':
        return <ReleasesPage />;
      case 'contacts':
        return <ContactsPage />;
      default:
        return <LibraryPage />;
    }
  };

  const tabs: TabType[] = ['library', 'rehearsals', 'lyrics', 'releases', 'contacts'];

  return (
    <div className="flex h-screen bg-studio-900 overflow-hidden">
      <div className="fixed inset-0 bg-noise pointer-events-none" />
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden ml-16">
        <div className="h-12 bg-studio-850 border-b border-studio-700 flex items-center px-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => useAppStore.getState().setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-studio-700 text-accent-orange'
                  : 'text-studio-400 hover:text-studio-200 hover:bg-studio-800'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-hidden animate-fade-in">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
