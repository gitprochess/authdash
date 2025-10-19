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
          className={`flex items-start space-x-4 max-w-[80%] ${
            message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
              message.sender === 'bot' ? 'ai-message-glow' : ''
            }`}
            style={{
              background: message.sender === 'user'
                ? 'var(--qp-bg-panel)'
                : 'var(--gradient-ai)',
              border: `1px solid var(--qp-border)`
            }}
          >
            {message.sender === 'user' ? (
              <User className="w-5 h-5" style={{ color: 'var(--qp-secondary)' }} />
            ) : (
              <Bot className="w-6 h-6" style={{ color: 'var(--qp-primary)' }} />
            )}
          </div>
          <div
            className={`px-6 py-4 rounded-2xl backdrop-blur-sm shadow-lg transition-all duration-300 ${
              message.sender === 'user'
                ? 'rounded-tr-sm cyan-glow-hover'
                : 'rounded-tl-sm ai-message-glow'
            }`}
            style={{
              background: message.sender === 'user'
                ? 'var(--qp-bg-panel)'
                : 'var(--gradient-ai)',
              border: `1px solid var(--qp-border)`,
              color: 'var(--qp-text-primary)'
            }}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.message}</p>
            <p className="text-xs opacity-50 mt-2" style={{ color: 'var(--qp-text-secondary)' }}>
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
    <div className="h-full flex gap-6 overflow-hidden">
      {/* Chat Panel - Visual Centerpiece */}
      <div className="flex-1 flex flex-col chat-centerpiece rounded-2xl overflow-hidden" style={{ background: 'var(--qp-bg-panel)' }}>
        {/* Chat Header - Quantum Pulse Theme */}
        <div className="px-8 py-5 border-b flex-shrink-0" style={{ borderColor: 'var(--qp-border)', background: 'rgba(26, 27, 36, 0.5)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'var(--gradient-ai)', boxShadow: 'var(--qp-shadow-glow)' }}>
                <Bot className="w-7 h-7" style={{ color: 'var(--qp-primary)' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold flex items-center space-x-2" style={{ color: 'var(--qp-text-primary)' }}>
                  <span>Cyaphire AI X</span>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--qp-secondary)' }}></div>
                </h3>
                <p className="text-xs" style={{ color: 'var(--qp-text-secondary)' }}>Powered by DeploidX • Quantum AI Engine</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full border" style={{ background: 'rgba(108, 99, 255, 0.05)', borderColor: 'var(--qp-border)' }}>
              <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ background: token ? 'var(--qp-secondary)' : '#ef4444' }}></div>
              <span className="text-xs" style={{ color: 'var(--qp-text-primary)' }}>{token ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {/* Messages Area - Expanded and Centered */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 min-h-0" style={{ background: 'rgba(14, 14, 18, 0.3)' }}>
            {messageComponents}
            
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ai-message-glow" style={{ background: 'var(--gradient-ai)', border: '1px solid var(--qp-border)' }}>
                  <Bot className="w-6 h-6" style={{ color: 'var(--qp-primary)' }} />
                </div>
                <div className="px-6 py-4 rounded-2xl rounded-tl-sm shadow-lg max-w-[85%] ai-message-glow" style={{ background: 'var(--gradient-ai)', border: '1px solid var(--qp-border)' }}>
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--qp-primary)' }} />
                    <span className="text-sm" style={{ color: 'var(--qp-text-primary)' }}>AI is thinking...</span>
                  </div>
                  {/* Typing Pulse Indicator */}
                  <div className="flex items-center space-x-1 mt-3">
                    <div className="w-1.5 h-1.5 rounded-full typing-pulse" style={{ background: 'var(--qp-secondary)' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full typing-pulse" style={{ background: 'var(--qp-secondary)', animationDelay: '0.2s' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full typing-pulse" style={{ background: 'var(--qp-secondary)', animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Glowing Quantum Design */}
        <form onSubmit={handleSendMessage} className="px-8 py-5 border-t flex-shrink-0" style={{ borderColor: 'var(--qp-border)', background: 'rgba(26, 27, 36, 0.5)' }}>
          <div className="flex items-center space-x-4">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              placeholder="Ask me anything about deployments, servers, or development..."
              className="flex-1 px-5 py-4 rounded-xl text-sm transition-all duration-300 focus:outline-none"
              style={{
                background: 'rgba(14, 14, 18, 0.6)',
                border: `1px solid var(--qp-border)`,
                color: 'var(--qp-text-primary)',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--qp-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--qp-border)'}
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="px-6 py-4 rounded-xl font-medium shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center space-x-2 hover:scale-105"
              style={{
                background: 'var(--gradient-button)',
                boxShadow: 'var(--qp-shadow-cyan)',
                color: 'white'
              }}
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline font-semibold">Send</span>
            </button>
          </div>
        </form>
      </div>

      {/* Logs Panel - Blended Design */}
      <div className="w-80 flex-shrink-0 hidden lg:block">
        <LogsPanel />
      </div>
    </div>
  );
};