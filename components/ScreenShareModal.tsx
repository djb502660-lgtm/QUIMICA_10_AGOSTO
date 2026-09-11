import React from 'react';
import { X, Monitor, Tv, Laptop, Volume2, ShieldCheck, Sparkles } from 'lucide-react';
import { Assistant } from '../types';

interface ScreenShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  theme: Assistant['theme'];
}

export const ScreenShareModal: React.FC<ScreenShareModalProps> = ({ isOpen, onClose, onConfirm, theme }) => {
  if (!isOpen) return null;

  const themes = {
    cyan: {
      primary: 'from-cyan-400 to-blue-600',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/30',
      glow: 'shadow-cyan-500/20',
      button: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30',
    },
    rose: {
      primary: 'from-pink-400 to-rose-600',
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      glow: 'shadow-rose-500/20',
      button: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30',
    },
    amber: {
      primary: 'from-yellow-400 to-orange-600',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20',
      button: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30',
    },
    violet: {
      primary: 'from-violet-400 to-purple-600',
      text: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      glow: 'shadow-violet-500/20',
      button: 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/30',
    },
  };

  const t = themes[theme];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-lg rounded-3xl border ${t.border} bg-slate-900/90 backdrop-blur-xl ${t.glow} shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300`}>
        {/* Decorative Glow */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${t.primary} opacity-20 blur-3xl`} />
        
        {/* Header */}
        <div className="relative p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${t.bg} ${t.text}`}>
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Compartir Pantalla</h2>
              <p className="text-xs text-slate-400">Prepárate para mostrar tu mundo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-colors">
              <Tv className={`w-8 h-8 ${t.text} mb-1`} />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Toda la Pantalla</span>
            </div>
            <div className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${t.bg} border ${t.border} text-center group`}>
              <Laptop className={`w-8 h-8 ${t.text} mb-1`} />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Ventana App</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-white/10 transition-colors">
              <Sparkles className={`w-8 h-8 ${t.text} mb-1`} />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Pestaña</span>
            </div>
          </div>

          <div className={`p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3`}>
            <div className="flex items-start gap-3">
              <div className="mt-1 p-1 rounded-md bg-blue-500/20 text-blue-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-blue-300">¿Quieres que escuche?</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Para que el asistente escuche tu música o juegos, recuerda marcar el interruptor de <span className="text-white font-medium">"Compartir audio"</span> en el siguiente paso.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-2">
            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
            <p className="text-[10px] text-slate-500 italic">
              Privacidad activa: El asistente solo verá lo que tú decidas compartir en la ventana seleccionada.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-black/20 border-t border-white/5 flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white ${t.button} transition-all active:scale-95`}
          >
            Entendido, ¡Vamos!
          </button>
        </div>
      </div>
    </div>
  );
};
