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
        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
      >
        <div
          className={`flex items-start space-x-3 max-w-[85%] ${
            message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
              message.sender === 'user'
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
                : 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30'
            }`}
          >
            {message.sender === 'user' ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Bot className="w-5 h-5 text-purple-400" />
            )}
          </div>
          <div
            className={`px-5 py-3 rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-200 hover:shadow-xl ${
              message.sender === 'user'
                ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-tr-sm'
                : 'bg-gradient-to-br from-black/60 to-purple-900/20 text-white border border-white/10 rounded-tl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message}</p>
            <p className="text-xs opacity-60 mt-2">
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
    <div className="h-full flex gap-4 overflow-hidden">
      {/* Chat Panel - Centered with balanced padding */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black/40 to-purple-900/10 rounded-xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-black/30 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                  <span>Cyaphire AI X</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </h3>
                <p className="text-xs text-gray-400">Powered by DeploidX</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10">
              <div className={`w-1.5 h-1.5 rounded-full ${token ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-xs text-gray-300">{token ? 'Authenticated' : 'Not authenticated'}</span>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
            {messageComponents}
            
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-purple-400" />
                </div>
                <div className="bg-gradient-to-br from-black/60 to-purple-900/20 text-white border border-white/10 px-5 py-3 rounded-2xl rounded-tl-sm shadow-lg max-w-[85%]">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="px-6 py-4 border-t border-white/10 bg-black/30 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center space-x-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Ask me anything about deployments, servers, or development..."
              className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-medium shadow-lg hover:shadow-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </div>

      {/* Logs Panel - Resizable Right Panel */}
      <div className="w-96 flex-shrink-0 hidden lg:block">
        <LogsPanel />
      </div>
    </div>
  );
};