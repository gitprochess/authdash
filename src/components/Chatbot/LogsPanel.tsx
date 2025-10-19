import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Pause, Play, Trash2, Download, Maximize2, Copy, CheckCircle } from 'lucide-react';

interface LogEntry {
  id: string;
  level: string;
  message: string;
  timestamp: Date;
  raw: string;
  source?: string;
}

export const LogsPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string>('');
  const [isFullView, setIsFullView] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [logStats, setLogStats] = useState({ total: 0, errors: 0, warnings: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    try {
      const ws = new WebSocket('wss://logs.deploidx.com:8083');
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setError('');
        
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };

      ws.onmessage = (event) => {
        if (isPaused) return;

        try {
          const lines = event.data.split('\n').filter((line: string) => line.trim());
          
          const newLogs = lines.map((line: string) => {
            const logEntry: LogEntry = {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              level: 'INFO',
              message: line,
              timestamp: new Date(),
              raw: line,
              source: 'system'
            };

            // Enhanced log parsing
            try {
              const parsed = JSON.parse(line);
              logEntry.level = (parsed.level || parsed.severity || 'INFO').toUpperCase();
              logEntry.message = parsed.message || parsed.msg || parsed.text || line;
              logEntry.source = parsed.source || parsed.service || 'system';
            } catch {
              // Parse common log formats
              const levelMatch = line.match(/\b(ERROR|WARN|WARNING|INFO|DEBUG|SUCCESS|FATAL)\b/i);
              
              if (levelMatch) {
                logEntry.level = levelMatch[1].toUpperCase();
                logEntry.message = line.replace(levelMatch[0], '').trim();
              }
              
              // Extract source/service name
              const sourceMatch = line.match(/\[([^\]]+)\]/);
              if (sourceMatch) {
                logEntry.source = sourceMatch[1];
              }
            }

            return logEntry;
          });

          setLogs(prev => {
            const combined = [...prev, ...newLogs];
            const limited = combined.slice(-1000); // Keep only last 1000 logs
            
            // Update stats
            const errors = limited.filter(log => log.level === 'ERROR').length;
            const warnings = limited.filter(log => log.level === 'WARN' || log.level === 'WARNING').length;
            setLogStats({ total: limited.length, errors, warnings });
            
            return limited;
          });
          
        } catch (error) {
          // Error processing log message
        }
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        
        if (event.code !== 1000) {
          setError('Connection lost. Reconnecting...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        setError('WebSocket connection error');
        setIsConnected(false);
      };

    } catch (error) {
      setError('Failed to connect to logs server');
    }
  }, [isPaused]);

  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    setIsConnected(false);
    setError('');
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      disconnectWebSocket();
    };
  }, [connectWebSocket, disconnectWebSocket]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setLogStats({ total: 0, errors: 0, warnings: 0 });
  }, []);

  const downloadLogs = useCallback(() => {
    const logText = logs.map(log => 
      `[${log.timestamp.toISOString()}] ${log.level}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [logs]);

  const togglePause = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  const toggleFullView = useCallback(() => {
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsFullView(!isFullView);
    }, 50);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  }, [isFullView]);

  const copyLogToClipboard = useCallback(async (log: LogEntry) => {
    const logText = `[${log.timestamp.toISOString()}] ${log.level}: ${log.message}`;
    try {
      await navigator.clipboard.writeText(logText);
      setCopiedLogId(log.id);
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch (error) {
      // Failed to copy log
    }
  }, []);

  const getLogLevelStyle = useCallback((level: string) => {
    const normalizedLevel = level.toUpperCase();
    switch (normalizedLevel) {
      case 'ERROR':
      case 'FATAL':
        return {
          dot: 'bg-red-500',
          text: 'text-red-300',
          badge: 'text-red-300'
        };
      case 'WARN':
      case 'WARNING':
        return {
          dot: 'bg-yellow-500',
          text: 'text-yellow-300',
          badge: 'text-yellow-300'
        };
      case 'SUCCESS':
        return {
          dot: 'bg-green-500',
          text: 'text-green-300',
          badge: 'text-green-300'
        };
      case 'DEBUG':
        return {
          dot: 'bg-gray-500',
          text: 'text-gray-400',
          badge: 'text-gray-400'
        };
      default:
        return {
          dot: 'bg-blue-500',
          text: 'text-blue-300',
          badge: 'text-blue-300'
        };
    }
  }, []);

  const formatTimestamp = useCallback((timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }, []);

  // Memoize log entries for better performance
  const logEntries = React.useMemo(() => {
    return logs.map((log) => {
      const style = getLogLevelStyle(log.level);
      
      return (
        <div
          key={log.id}
          className="group relative px-3 py-1 hover:bg-white/5 transition-colors duration-100 border-l border-transparent hover:border-l-white/20"
        >
          <div className="flex items-center space-x-2">
            {/* Timestamp - compact */}
            <div className="flex-shrink-0 w-16 text-gray-500 tabular-nums text-xs">
              {formatTimestamp(log.timestamp)}
            </div>
            
            {/* Level indicator - just a dot and short text */}
            <div className="flex-shrink-0 flex items-center space-x-1 w-12">
              <div className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></div>
              <span className={`text-xs ${style.text} uppercase`}>
                {log.level.substring(0, 3)}
              </span>
            </div>
            
            {/* Message - flexible, single line with ellipsis */}
            <div className="flex-1 min-w-0">
              <div className="text-gray-200 truncate leading-tight text-xs">
                {log.message}
              </div>
            </div>
            
            {/* Copy button - only on hover */}
            <button
              onClick={() => copyLogToClipboard(log)}
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-white transition-all duration-150 rounded"
              title="Copy"
            >
              {copiedLogId === log.id ? (
                <CheckCircle className="w-3 h-3 text-aqua-green" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>
      );
    });
  }, [logs, getLogLevelStyle, formatTimestamp, copyLogToClipboard, copiedLogId]);

  const LogsContainer = ({ className = "" }: { className?: string }) => (
    <div className={`flex flex-col h-full min-h-0 bg-gradient-to-br from-black/60 to-purple-900/10 rounded-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 ${className} ${isCollapsed ? 'w-12' : ''}`}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <>
                <h3 className="text-sm font-semibold text-white">Runtime Logs</h3>
            
            {/* Status indicator */}
            <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs ${
              isConnected && !isPaused ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              <div className={`w-1 h-1 rounded-full ${
                isConnected && !isPaused ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`}></div>
              <span>{isConnected && !isPaused ? 'Live' : isPaused ? 'Paused' : 'Off'}</span>
            </div>

                {/* Stats */}
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>{logStats.total}</span>
                  {logStats.errors > 0 && (
                    <span className="text-red-300">{logStats.errors}E</span>
                  )}
                  {logStats.warnings > 0 && (
                    <span className="text-yellow-300">{logStats.warnings}W</span>
                  )}
                </div>
              </>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center space-x-1">
              <button
                onClick={togglePause}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={clearLogs}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150"
                title="Clear"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={downloadLogs}
                disabled={logs.length === 0}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150 disabled:opacity-50"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleFullView}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-150"
                title="Expand"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex-shrink-0 px-3 py-1 bg-red-500/20 border-b border-red-500/30 text-red-200 text-xs">
          ⚠️ {error}
        </div>
      )}

      {!isCollapsed && (
        <>
          {/* Logs Content */}
          <div
            ref={logsContainerRef}
            className="flex-1 overflow-y-auto min-h-0 bg-black/20"
          >
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
                <Terminal className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No logs yet</p>
                <p className="text-xs opacity-75">
                  {isConnected ? 'Waiting for messages...' : 'Connect to start'}
                </p>
              </div>
            ) : (
              <div className="text-xs font-mono">
                {logEntries}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 px-4 py-2 border-t border-white/10 text-xs text-gray-500 bg-black/20">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs">wss://logs.deploidx.com:8083</span>
              <div className="flex items-center space-x-1">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isConnected && !isPaused ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                }`}></div>
                <span>
                  {isConnected ? (isPaused ? 'Paused' : 'Connected') : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (isFullView) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-6 transition-all duration-300 ease-out ${
          isAnimating
            ? 'bg-black/0 backdrop-blur-none'
            : 'bg-black/80 backdrop-blur-xl'
        }`}
      >
        <div
          className={`w-full h-full max-w-7xl transition-all duration-300 ease-out transform ${
            isAnimating
              ? 'scale-95 opacity-0'
              : 'scale-100 opacity-100'
          }`}
        >
          <LogsContainer />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <LogsContainer />
    </div>
  );
};