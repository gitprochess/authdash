import React, { useState } from 'react';
import { Server, MessageSquare, User, Settings, Container, Database, HelpCircle } from 'lucide-react';
import { Header } from './Header';
import { SSHManager } from '../SSH/SSHManager';
import { ChatInterface } from '../Chatbot/ChatInterface';
import { ContainerManager } from '../Containers/ContainerManager';
import { DatabaseManager } from '../Database/DatabaseManager';
import { SettingsPanel } from '../Settings/SettingsPanel';
import { HelpPanel } from '../Help/HelpPanel';
import { useTheme } from '../../contexts/ThemeContext';

type TabType = 'containers' | 'databases' | 'ssh' | 'chat' | 'help' | 'profile' | 'settings';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('containers');
  const { theme, settings } = useTheme();

  const tabs = [
    { id: 'containers' as TabType, label: 'Containers', icon: Container },
    { id: 'databases' as TabType, label: 'Databases', icon: Database },
    { id: 'ssh' as TabType, label: 'SSH Servers', icon: Server },
    { id: 'chat' as TabType, label: 'Cyaphire AI X', icon: MessageSquare },
    { id: 'help' as TabType, label: 'Help', icon: HelpCircle },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'containers':
        return <ContainerManager />;
      case 'databases':
        return <DatabaseManager />;
      case 'ssh':
        return <SSHManager />;
      case 'chat':
        return <ChatInterface />;
      case 'help':
        return <HelpPanel />;
      case 'profile':
        return (
          <div className="glass rounded-2xl p-6 vision-glow">
            <h2 className="text-2xl font-bold text-bolt-dark-50 mb-4">
              Profile Settings
            </h2>
            <p className="text-bolt-dark-300">Profile management coming soon...</p>
          </div>
        );
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  // Listen for navigation events from help panel
  React.useEffect(() => {
    const handleNavigateToChat = () => {
      setActiveTab('chat');
    };

    window.addEventListener('navigate-to-chat', handleNavigateToChat);
    return () => window.removeEventListener('navigate-to-chat', handleNavigateToChat);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col bg-bolt-dark-950 ${
        settings.animations ? 'transition-all duration-200' : ''
      }`}
    >

      <Header />
      
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6 min-h-0 relative z-10">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="glass rounded-2xl p-4 vision-glow">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden ${
                      activeTab === tab.id
                        ? 'text-bolt-dark-50 border border-purple-600/50 shadow-lg shadow-purple-900/20'
                        : 'text-bolt-dark-300 hover:text-bolt-dark-50 hover:bg-bolt-dark-900 border border-transparent hover:border-purple-800/30'
                    }`}
                    style={{
                      background: activeTab === tab.id
                        ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(59, 130, 246, 0.1))'
                        : undefined
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                    {tab.id === 'help' && (
                      <span className="ml-auto w-2 h-2 bg-bolt-accent-green rounded-full animate-pulse"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};