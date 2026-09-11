import React, { useEffect, useRef, useState } from 'react';
import { X, MessageSquare, Trash2, Sparkles, Send } from 'lucide-react';
import { ChatMessage, Assistant } from '../types';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  theme: Assistant['theme'];
  onSendMessage?: (text: string) => void;
  isConnected?: boolean;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isOpen, onClose, onClear, theme, onSendMessage, isConnected }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState('');

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const styles = {
    cyan: {
      bg: 'bg-slate-900',
      header: 'border-cyan-500/20 bg-slate-800/80',
      userBubble: 'bg-slate-700 text-white',
      assistantBubble: 'bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/20 text-cyan-50',
      accent: 'text-cyan-400',
      scroll: 'scrollbar-thumb-cyan-900 scrollbar-track-slate-800'
    },
    rose: {
      bg: 'bg-slate-900',
      header: 'border-rose-500/20 bg-slate-800/80',
      userBubble: 'bg-slate-700 text-white',
      assistantBubble: 'bg-gradient-to-br from-rose-900/50 to-pink-900/50 border border-rose-500/20 text-rose-50',
      accent: 'text-rose-400',
      scroll: 'scrollbar-thumb-rose-900 scrollbar-track-slate-800'
    },
    amber: {
      bg: 'bg-slate-900',
      header: 'border-amber-500/20 bg-slate-800/80',
      userBubble: 'bg-slate-700 text-white',
      assistantBubble: 'bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-amber-500/20 text-amber-50',
      accent: 'text-amber-400',
      scroll: 'scrollbar-thumb-amber-900 scrollbar-track-slate-800'
    },
    violet: {
      bg: 'bg-slate-900',
      header: 'border-violet-500/20 bg-slate-800/80',
      userBubble: 'bg-slate-700 text-white',
      assistantBubble: 'bg-gradient-to-br from-violet-900/50 to-purple-900/50 border border-violet-500/20 text-violet-50',
      accent: 'text-violet-400',
      scroll: 'scrollbar-thumb-violet-900 scrollbar-track-slate-800'
    }
  };

  const currentStyle = styles[theme];

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm lg:bg-transparent lg:pointer-events-none">
      <div className={`
        w-full lg:w-[400px] h-full shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300
        ${currentStyle.bg} border-l border-white/10
        animate-in slide-in-from-right
      `}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b backdrop-blur-md ${currentStyle.header}`}>
          <div className="flex items-center gap-2">
            <MessageSquare className={`w-5 h-5 ${currentStyle.accent}`} />
            <h2 className="font-semibold text-white tracking-wide">Historial de Chat</h2>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={onClear}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
              title="Borrar historial"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className={`flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin ${currentStyle.scroll}`}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center px-6">
              <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">El historial está vacío. <br/> Empieza a hablar o escribir para ver tus mensajes aquí.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 px-1">
                  {msg.role === 'user' ? (
                    <span className="text-xs text-slate-400">{formatTime(msg.timestamp)}</span>
                  ) : (
                    <>
                      <Sparkles className={`w-3 h-3 ${currentStyle.accent}`} />
                      <span className={`text-xs font-medium uppercase tracking-wider ${currentStyle.accent}`}>
                        {msg.assistantId || 'Asistente'}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">{formatTime(msg.timestamp)}</span>
                    </>
                  )}
                </div>
                
                <div className={`
                  px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' ? `${currentStyle.userBubble} rounded-tr-sm` : `${currentStyle.assistantBubble} rounded-tl-sm`}
                `}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-slate-900/50">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (inputText.trim() && onSendMessage && isConnected) {
              onSendMessage(inputText.trim());
              setInputText('');
            }
          }} className="flex gap-2 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isConnected ? "Escribe un mensaje..." : "Conecta para escribir..."}
              disabled={!isConnected}
              className={`flex-1 bg-slate-800 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 ${
                theme === 'cyan' ? 'focus:ring-cyan-500/50' :
                theme === 'rose' ? 'focus:ring-rose-500/50' :
                theme === 'amber' ? 'focus:ring-amber-500/50' :
                'focus:ring-violet-500/50'
              }`}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || !isConnected}
              className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 ${
                theme === 'cyan' ? 'bg-cyan-600 hover:bg-cyan-500 text-white' :
                theme === 'rose' ? 'bg-rose-600 hover:bg-rose-500 text-white' :
                theme === 'amber' ? 'bg-amber-600 hover:bg-amber-500 text-white' :
                'bg-violet-600 hover:bg-violet-500 text-white'
              }`}
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};