import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Terminal, MessageSquare } from 'lucide-react';
import { ChatMessage } from '../../types';
import { chatApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LogsPanel } from './LogsPanel';

type ChatView = 'chat' | 'logs';

export const ChatInterface: React.FC = () => {
  const { token } = useAuth();
  const [activeView, setActiveView] = useState<ChatView>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! I\'m Cyaphire AI X, your next-generation intelligent assistant. How can I help you with your deployments today?',
      sender: 'bot',
      timestamp: new Date(),
    },
    {
      id: '2',
      message: 'I can assist you with deployments, server management, troubleshooting, container orchestration, and development questions. What would you like to explore?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optimize scrolling - use callback to prevent recreation
  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, []);

  // Only scroll when messages change, not on every render
  useEffect(() => {
    // Use requestAnimationFrame for better performance
    const timeoutId = requestAnimationFrame(() => {
      scrollToBottom();
    });
    return () => cancelAnimationFrame(timeoutId);
  }, [messages, scrollToBottom]);

  // Optimize input change handler - remove unnecessary operations
  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  }, []);
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageToSend = inputMessage.trim();
    if (!messageToSend) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: messageToSend,
      sender: 'user',
      timestamp: new Date(),
    };

    // Clear input immediately
    setInputMessage('');
    
    // Add user message immediately for better UX
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      return newMessages.length > 100 ? newMessages.slice(-100) : newMessages;
    });
    
    setLoading(true);

    try {
      
      const response = await chatApi.sendMessage(messageToSend, token);
      
      let botReply = '';
      if (response.reply) {
        botReply = response.reply;
      } else if (response.message) {
        botReply = response.message;
      } else if (response.response) {
        botReply = response.response;
      } else if (response.data?.reply) {
        botReply = response.data.reply;
      } else if (response.data?.message) {
        botReply = response.data.message;
      } else {
        botReply = 'I received your message, but I\'m not sure how to respond right now.';
      }
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: botReply,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        return newMessages.length > 100 ? newMessages.slice(-100) : newMessages;
      });
    } catch (error: any) {
      
      let errorMessage = 'Sorry, I\'m having trouble connecting right now. Please try again later.';
      
      if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: errorMessage,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => {
        const newMessages = [...prev, errorMsg];
        return newMessages.length > 100 ? newMessages.slice(-100) : newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  // Memoize message components to prevent unnecessary re-renders
  const messageComponents = React.useMemo(() => {
    return messages.map((message, index) => (
      <div
        key={message.id}
        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`flex items-start space-x-2 max-w-[80%] ${
            message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'user'
                ? 'bg-gradient-to-br from-vivid-purple to-neon-blue vision-glow'
                : 'glass border border-white/20'
            }`}
          >
            {message.sender === 'user' ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
          <div
            className={`px-4 py-2 rounded-lg backdrop-blur-sm ${
              message.sender === 'user'
                ? 'bg-gradient-to-br from-vivid-purple/80 to-neon-blue/60 text-white border border-white/20'
                : 'glass text-white border border-white/10'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message}</p>
            <p className="text-xs opacity-70 mt-1">
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>
    ));
  }, [messages]);
  return (
    <div className="h-full flex flex-col max-h-[calc(100vh-200px)]">
      {/* CRT-style Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        {/* Chat Panel */}
        <div className="lg:col-span-3 glass rounded-2xl flex flex-col min-h-0 crt-screen vision-glow">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/10 flex-shrink-0 glass-strong rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-vivid-purple" />
              <h3 className="text-lg font-semibold text-white">
                Cyaphire AI X
              </h3>
              <div className="w-2 h-2 bg-aqua-green rounded-full animate-pulse active-glow"></div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-400">Cyaphire AI X • Powered by DeploidX</p>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <div className={`w-1 h-1 rounded-full ${token ? 'bg-aqua-green' : 'bg-red-400'}`}></div>
                <span>{token ? 'Authenticated' : 'Not authenticated'}</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 crt-content">
            {messageComponents}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full glass border border-white/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="glass text-white border border-white/10 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-vivid-purple" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 flex-shrink-0">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="Ask me anything about deployments, servers, or development..."
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-vivid-purple focus:ring-1 focus:ring-vivid-purple backdrop-blur-sm"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="px-4 py-2 futuristic-btn text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-vivid-purple focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Logs Panel */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <LogsPanel />
        </div>
      </div>
    </div>
  );
};