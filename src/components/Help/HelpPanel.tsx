import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  Play, 
  Container, 
  Database, 
  Server, 
  MessageSquare, 
  Settings,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  Zap,
  Shield,
  Globe,
  Terminal,
  Key,
  Users,
  Rocket,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { CyaphireLogo } from '../UI/CyaphireLogo';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const HelpPanel: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string>('getting-started');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started with DeploidX',
      icon: Rocket,
      difficulty: 'beginner',
      content: (
        <div className="space-y-6">
          <div className="glass-strong rounded-lg p-4 border border-aqua-green/20">
            <h4 className="text-aqua-green font-semibold mb-2 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              Welcome to DeploidX!
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              DeploidX is your all-in-one deployment and server management platform. This dashboard helps you manage containers, databases, SSH connections, and interact with our AI assistant.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Start Steps:</h4>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className="w-6 h-6 bg-aqua-green rounded-full flex items-center justify-center text-black text-sm font-bold">1</div>
                <div>
                  <p className="text-white font-medium">Explore the Navigation</p>
                  <p className="text-gray-300 text-sm">Use the sidebar to navigate between Containers, Databases, SSH Servers, AI Assistant, and Settings.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className="w-6 h-6 bg-aqua-green rounded-full flex items-center justify-center text-black text-sm font-bold">2</div>
                <div>
                  <p className="text-white font-medium">Check Your Authentication</p>
                  <p className="text-gray-300 text-sm">Look for the green dot in the top-right corner - this shows you're logged in and authenticated.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className="w-6 h-6 bg-aqua-green rounded-full flex items-center justify-center text-black text-sm font-bold">3</div>
                <div>
                  <p className="text-white font-medium">Start with Containers</p>
                  <p className="text-gray-300 text-sm">Begin by exploring the Containers tab to see your deployed applications.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className="w-6 h-6 bg-aqua-green rounded-full flex items-center justify-center text-black text-sm font-bold">4</div>
                <div>
                  <p className="text-white font-medium">Try the AI Assistant</p>
                  <p className="text-gray-300 text-sm">Ask questions in the Assistant tab - it can help with deployments, troubleshooting, and more!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'containers',
      title: 'Managing Containers',
      icon: Container,
      difficulty: 'beginner',
      content: (
        <div className="space-y-6">
          <div className="glass-strong rounded-lg p-4 border border-vivid-purple/20">
            <h4 className="text-vivid-purple font-semibold mb-2">What are Containers?</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Containers are lightweight, portable packages that contain your applications and all their dependencies. Think of them as isolated environments where your apps run.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Container Management Features:</h4>
            
            <div className="grid gap-3">
              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Globe className="w-5 h-5 text-aqua-green mt-0.5" />
                <div>
                  <p className="text-white font-medium">View Running Applications</p>
                  <p className="text-gray-300 text-sm">See all your deployed containers with their status, ports, and project names.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Play className="w-5 h-5 text-neon-blue mt-0.5" />
                <div>
                  <p className="text-white font-medium">Open Applications</p>
                  <p className="text-gray-300 text-sm">Click "Open App" to access your running applications in a new tab.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Terminal className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Stop Containers</p>
                  <p className="text-gray-300 text-sm">Use the "Kill Container" button to stop running containers when needed.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-yellow-300 font-medium">Important Note</p>
                <p className="text-yellow-200 text-sm">
                  Stopping a container will make your application unavailable. Only do this when you need to update or troubleshoot.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'databases',
      title: 'Database Management',
      icon: Database,
      difficulty: 'intermediate',
      content: (
        <div className="space-y-6">
          <div className="glass-strong rounded-lg p-4 border border-aqua-green/20">
            <h4 className="text-aqua-green font-semibold mb-2">MySQL Database Containers</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Create and manage MySQL database containers for your applications. Each database runs in its own isolated container with custom configurations.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">How to Create a MySQL Database:</h4>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className="w-6 h-6 bg-aqua-green rounded-full flex items-center justify-center text-black text-sm font-bold">1</div>
                <div>
                  <p className="text-white font-medium">Click "Create MySQL"</p>
                  <p className="text-gray-300 text-sm">Navigate to the Databases tab and click the "Create MySQL" button.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className="w-6 h-6 bg-aqua-green rounded-full flex items-center justify-center text-black text-sm font-bold">2</div>
                <div>
                  <p className="text-white font-medium">Fill in Configuration</p>
                  <p className="text-gray-300 text-sm">Provide project name, MySQL version, database name, user credentials, and port.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className="w-6 h-6 bg-aqua-green rounded-full flex items-center justify-center text-black text-sm font-bold">3</div>
                <div>
                  <p className="text-white font-medium">Review Connection Info</p>
                  <p className="text-gray-300 text-sm">Check the connection preview to see how to connect to your database.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <div className="w-6 h-6 bg-aqua-green rounded-full flex items-center justify-center text-black text-sm font-bold">4</div>
                <div>
                  <p className="text-white font-medium">Create and Connect</p>
                  <p className="text-gray-300 text-sm">Click "Create MySQL Container" and use the provided connection details in your applications.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold">Available MySQL Versions:</h4>
            <div className="glass rounded-lg p-3">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
                <span className="text-aqua-green font-mono">8.0</span>
                <span className="text-aqua-green font-mono">8.0.35</span>
                <span className="text-aqua-green font-mono">8.0.34</span>
                <span className="text-aqua-green font-mono">5.7</span>
                <span className="text-aqua-green font-mono">5.6</span>
                <span className="text-aqua-green font-mono">latest</span>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-red-300 font-medium">Data Safety Warning</p>
                <p className="text-red-200 text-sm">
                  Deleting a database container will permanently remove all data. Always backup your data before deletion.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ssh',
      title: 'SSH Server Management',
      icon: Server,
      difficulty: 'intermediate',
      content: (
        <div className="space-y-6">
          <div className="glass-strong rounded-lg p-4 border border-neon-blue/20">
            <h4 className="text-neon-blue font-semibold mb-2">SSH Connections</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              SSH (Secure Shell) allows you to securely connect to remote servers. Store your server credentials for easy access and management.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Adding an SSH Server:</h4>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Server className="w-5 h-5 text-neon-blue mt-0.5" />
                <div>
                  <p className="text-white font-medium">Host Address</p>
                  <p className="text-gray-300 text-sm">Enter the IP address or domain name of your server (e.g., 192.168.1.100).</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Terminal className="w-5 h-5 text-neon-blue mt-0.5" />
                <div>
                  <p className="text-white font-medium">Port & Username</p>
                  <p className="text-gray-300 text-sm">Specify the SSH port (usually 22) and your username on the server.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Key className="w-5 h-5 text-neon-blue mt-0.5" />
                <div>
                  <p className="text-white font-medium">Authentication</p>
                  <p className="text-gray-300 text-sm">Provide your password and set the base directory for file operations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold">Security Features:</h4>
            <div className="grid gap-3">
              <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                <Shield className="w-5 h-5 text-aqua-green" />
                <div>
                  <p className="text-white font-medium">Password Protection</p>
                  <p className="text-gray-300 text-sm">Passwords are hidden by default with toggle visibility.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                <Key className="w-5 h-5 text-aqua-green" />
                <div>
                  <p className="text-white font-medium">Secure Storage</p>
                  <p className="text-gray-300 text-sm">Credentials are securely stored and encrypted.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-assistant',
      title: 'Cyaphire AI X Guide',
      icon: MessageSquare,
      difficulty: 'beginner',
      content: (
        <div className="space-y-6">
          <div className="glass-strong rounded-lg p-4 border border-vivid-purple/20">
            <h4 className="text-vivid-purple font-semibold mb-2">Cyaphire AI X - Your Next-Generation Assistant</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Cyaphire AI X is DeploidX's next-generation AI assistant that can help you with deployments, troubleshooting, server management, and development questions.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">What You Can Ask:</h4>
            
            <div className="grid gap-3">
              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Container className="w-5 h-5 text-aqua-green mt-0.5" />
                <div>
                  <p className="text-white font-medium">Deployment Help</p>
                  <p className="text-gray-300 text-sm">"How do I deploy a Node.js application?" or "What's the best way to containerize my app?"</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Terminal className="w-5 h-5 text-neon-blue mt-0.5" />
                <div>
                  <p className="text-white font-medium">Server Management</p>
                  <p className="text-gray-300 text-sm">"How do I check server resources?" or "What are the best security practices?"</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Database className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Database Questions</p>
                  <p className="text-gray-300 text-sm">"How do I optimize MySQL performance?" or "What's the best backup strategy?"</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 glass rounded-lg">
                <Zap className="w-5 h-5 text-vivid-purple mt-0.5" />
                <div>
                  <p className="text-white font-medium">Troubleshooting</p>
                  <p className="text-gray-300 text-sm">"My container won't start" or "How do I debug connection issues?"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold">Chat Features:</h4>
            <div className="grid gap-3">
              <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                <MessageSquare className="w-5 h-5 text-aqua-green" />
                <div>
                  <p className="text-white font-medium">Real-time Responses</p>
                  <p className="text-gray-300 text-sm">Get instant answers to your questions with context-aware responses.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                <Terminal className="w-5 h-5 text-aqua-green" />
                <div>
                  <p className="text-white font-medium">Live Logs</p>
                  <p className="text-gray-300 text-sm">Monitor system logs in real-time alongside your chat conversations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-300 font-medium">Pro Tip</p>
                <p className="text-blue-200 text-sm">
                  Be specific in your questions with Cyaphire AI X. Instead of "help with deployment," try "how do I deploy a React app with Docker?"
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: 'Customizing Your Experience',
      icon: Settings,
      difficulty: 'beginner',
      content: (
        <div className="space-y-6">
          <div className="glass-strong rounded-lg p-4 border border-yellow-400/20">
            <h4 className="text-yellow-400 font-semibold mb-2">Personalize DeploidX</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Customize your dashboard with beautiful themes and adjust settings to match your preferences and workflow.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-semibold">Available Themes:</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 glass rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-vivid-purple rounded-full"></div>
                  <p className="text-white font-medium">DeploidX Classic</p>
                </div>
                <p className="text-gray-300 text-sm">Original futuristic purple theme</p>
              </div>

              <div className="p-3 glass rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                  <p className="text-white font-medium">Midnight Dark</p>
                </div>
                <p className="text-gray-300 text-sm">Pure dark for late-night coding</p>
              </div>

              <div className="p-3 glass rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <p className="text-white font-medium">Ocean Depths</p>
                </div>
                <p className="text-gray-300 text-sm">Deep blue ocean-inspired</p>
              </div>

              <div className="p-3 glass rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <p className="text-white font-medium">Sunset Glow</p>
                </div>
                <p className="text-gray-300 text-sm">Warm sunset colors</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold">Settings Options:</h4>
            <div className="grid gap-3">
              <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                <Zap className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-white font-medium">Animations</p>
                  <p className="text-gray-300 text-sm">Enable or disable smooth transitions and effects</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 glass rounded-lg">
                <Globe className="w-5 h-5 text-aqua-green" />
                <div>
                  <p className="text-white font-medium">Auto Refresh</p>
                  <p className="text-gray-300 text-sm">Automatically update data every 30 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Common Issues & Solutions',
      icon: AlertTriangle,
      difficulty: 'beginner',
      content: (
        <div className="space-y-6">
          <div className="glass-strong rounded-lg p-4 border border-red-400/20">
            <h4 className="text-red-400 font-semibold mb-2">Troubleshooting Guide</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Common issues you might encounter and how to resolve them quickly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 glass rounded-lg border border-yellow-400/20">
                <h5 className="text-yellow-400 font-medium mb-2">🔐 Authentication Issues</h5>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><strong>Problem:</strong> "Authentication failed" or red dot in header</p>
                  <p className="text-gray-300"><strong>Solution:</strong> Log out and log back in. Check your internet connection.</p>
                </div>
              </div>

              <div className="p-4 glass rounded-lg border border-red-400/20">
                <h5 className="text-red-400 font-medium mb-2">🐳 Container Won't Start</h5>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><strong>Problem:</strong> Container shows "stopped" status</p>
                  <p className="text-gray-300"><strong>Solution:</strong> Check the AI Assistant for specific error messages or contact support.</p>
                </div>
              </div>

              <div className="p-4 glass rounded-lg border border-blue-400/20">
                <h5 className="text-blue-400 font-medium mb-2">🗄️ Database Connection Failed</h5>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><strong>Problem:</strong> Can't connect to MySQL database</p>
                  <p className="text-gray-300"><strong>Solution:</strong> Verify host (93.127.206.35), port, username, and password are correct.</p>
                </div>
              </div>

              <div className="p-4 glass rounded-lg border border-green-400/20">
                <h5 className="text-green-400 font-medium mb-2">🤖 AI Assistant Not Responding</h5>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300"><strong>Problem:</strong> Cyaphire AI X doesn't respond to messages</p>
                  <p className="text-gray-300"><strong>Solution:</strong> Check authentication status and try refreshing the page.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-aqua-green/10 border border-aqua-green/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-5 h-5 text-aqua-green mt-0.5" />
              <div>
                <p className="text-aqua-green font-medium">Need More Help?</p>
                <p className="text-gray-300 text-sm">
                  Ask Cyaphire AI for specific help with your issue, or contact our support team for advanced troubleshooting.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-aqua-green';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-aqua-green/20 text-aqua-green border-aqua-green/30';
      case 'intermediate': return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'advanced': return 'bg-red-400/20 text-red-400 border-red-400/30';
      default: return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <CyaphireLogo size="md" variant="icon" />
        <div>
          <h2 className="text-3xl font-bold text-white">Cyaphire AI X Help</h2>
          <p className="text-gray-300 text-sm mt-1">
            Complete guide to using Cyaphire AI X Dashboard powered by DeploidX
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="glass rounded-2xl p-6 vision-glow">
        <div className="flex items-center space-x-3 mb-4">
          <BookOpen className="w-6 h-6 text-aqua-green" />
          <h3 className="text-xl font-semibold text-white">Quick Navigation</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {helpSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`p-3 glass rounded-lg border transition-all duration-200 text-left hover:bg-white/5 ${
                  expandedSection === section.id 
                    ? 'border-white/30 bg-white/10' 
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-aqua-green" />
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{section.title}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getDifficultyBadge(section.difficulty)}`}>
                      {section.difficulty}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Help Sections */}
      <div className="space-y-4">
        {helpSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          
          return (
            <div key={section.id} className="glass rounded-2xl vision-glow overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left hover:bg-white/5 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Icon className="w-6 h-6 text-aqua-green" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mt-2 ${getDifficultyBadge(section.difficulty)}`}>
                      {section.difficulty.charAt(0).toUpperCase() + section.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              {isExpanded && (
                <div className="px-6 pb-6 border-t border-white/10">
                  <div className="pt-6">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="glass rounded-2xl p-6 vision-glow text-center">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Users className="w-5 h-5 text-aqua-green" />
          <h3 className="text-lg font-semibold text-white">Need More Help?</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Cyaphire AI X is always available to answer specific questions about your deployments and server management.
        </p>
        <button
          onClick={() => {
            // This would typically navigate to the chat tab
            window.dispatchEvent(new CustomEvent('navigate-to-chat'));
          }}
          className="px-6 py-3 futuristic-btn text-white rounded-lg transition-all duration-200 bolt-shine font-medium"
        >
          Ask Cyaphire AI X
        </button>
      </div>
    </div>
  );
};