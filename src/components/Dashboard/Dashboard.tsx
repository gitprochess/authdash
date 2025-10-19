import React, { useState } from 'react';
import { Server, MessageSquare, User, Settings, Container, Database, HelpCircle, Menu } from 'lucide-react';
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    <div className="min-h-screen h-screen flex flex-col bg-bolt-dark-950 overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Responsive with collapse */}
        <aside className={`border-r border-white/10 bg-black/20 backdrop-blur-sm flex flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } lg:relative absolute lg:translate-x-0 ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'} z-30 h-full`}>
          {/* Sidebar Toggle Button */}
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-lg shadow-purple-900/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  title={sidebarCollapsed ? tab.label : ''}
                >
                  <div className={`flex items-center justify-center w-5 h-5 ${
                    isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{tab.label}</span>
                      {tab.id === 'help' && (
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      )}
                    </>
                  )}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-white/10 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          )}
        </aside>

        {/* Overlay for mobile when sidebar is open */}
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarCollapsed(true)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full p-4 md:p-6 overflow-y-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};