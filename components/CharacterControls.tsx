import React, { useState } from 'react';
import { Move, Smile, Sparkles, Zap, Activity, Music, Eye, Shirt } from 'lucide-react';
import { Assistant } from '../types';

interface CharacterControlsProps {
  theme: Assistant['theme'];
  isActive: boolean;
  onAction: (type: string, value: string) => void;
}

export const CharacterControls: React.FC<CharacterControlsProps> = ({ theme, isActive, onAction }) => {
  const [emotions, setEmotions] = useState({
    joy: 50,
    seriousness: 30,
    surprise: 20
  });

  const handleEmotionChange = (emotion: keyof typeof emotions, value: number) => {
    setEmotions(prev => ({ ...prev, [emotion]: value }));
  };

  const handleEmotionCommit = (emotion: string, value: number) => {
    if (!isActive) return;
    onAction('emotion', `${emotion}: ${value}%`);
  };

  const handleAnimClick = (anim: string) => {
    if (!isActive) return;
    onAction('animation', anim);
  };

  const handleTraitClick = (trait: string) => {
    if (!isActive) return;
    onAction('trait', trait);
  };

  // Button Style for the 3D dashboard: Square, dark, tool-like
  const btnClass = `
    aspect-square flex flex-col items-center justify-center gap-1.5 rounded-md border transition-all duration-200 group
    ${isActive 
        ? 'bg-[#252836] border-white/10 hover:bg-cyan-900/20 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400' 
        : 'bg-[#1e212b] border-white/5 text-slate-600 cursor-not-allowed'}
  `;

  return (
    <div className="w-full flex flex-col p-5 gap-6 font-inter">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Propiedades</h3>
        <Activity className={`w-3 h-3 ${isActive ? 'text-green-400' : 'text-slate-600'}`} />
      </div>

      {/* Animaciones */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Move className="w-3 h-3" /> Animaciones
        </label>
        <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleAnimClick('Bailar')} className={btnClass}>
                <Music className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-[9px] font-medium tracking-wide">BAILAR</span>
            </button>
            <button onClick={() => handleAnimClick('Caminar')} className={btnClass}>
                <Move className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-[9px] font-medium tracking-wide">CAMINAR</span>
            </button>
            <button onClick={() => handleAnimClick('Saludar')} className={btnClass}>
                <Zap className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-[9px] font-medium tracking-wide">SALUDAR</span>
            </button>
        </div>
      </div>

      {/* Rasgos */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Rasgos
        </label>
        <div className="grid grid-cols-3 gap-2">
            <button onClick={() => handleTraitClick('Pelo')} className={btnClass}>
                <Sparkles className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-[9px] font-medium tracking-wide">PELO</span>
            </button>
            <button onClick={() => handleTraitClick('Ojos')} className={btnClass}>
                <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-[9px] font-medium tracking-wide">OJOS</span>
            </button>
            <button onClick={() => handleTraitClick('Vestuario')} className={btnClass}>
                <Shirt className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span className="text-[9px] font-medium tracking-wide">ROPA</span>
            </button>
        </div>
      </div>

      {/* Emociones */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Smile className="w-3 h-3" /> Emociones
        </label>
        
        {/* Sliders */}
        {[
            { id: 'joy', label: 'Alegría', val: emotions.joy },
            { id: 'seriousness', label: 'Seriedad', val: emotions.seriousness },
            { id: 'surprise', label: 'Sorpresa', val: emotions.surprise }
        ].map((item) => (
            <div key={item.id} className="space-y-1.5 group">
                <div className="flex justify-between text-[10px] text-slate-400 group-hover:text-slate-200 transition-colors">
                    <span>{item.label}</span>
                    <span className="font-mono text-[9px]">{item.val}%</span>
                </div>
                <div className="relative h-1 w-full bg-[#0f111a] rounded-full overflow-hidden border border-white/5">
                    <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-100 ${isActive ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-700'}`}
                        style={{ width: `${item.val}%` }}
                    ></div>
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={item.val} 
                        onChange={(e) => handleEmotionChange(item.id as any, parseInt(e.target.value))}
                        onMouseUp={(e) => handleEmotionCommit(item.label, parseInt(e.currentTarget.value))}
                        onTouchEnd={(e) => handleEmotionCommit(item.label, parseInt(e.currentTarget.value))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                        disabled={!isActive}
                    />
                </div>
            </div>
        ))}
      </div>

      {/* Additional Stats Mockup */}
      <div className="mt-auto pt-4 border-t border-white/5 space-y-1">
          <div className="flex justify-between text-[9px] text-slate-600 font-mono">
              <span>VERTICES</span>
              <span>14,204</span>
          </div>
          <div className="flex justify-between text-[9px] text-slate-600 font-mono">
              <span>TRIANGLES</span>
              <span>28,102</span>
          </div>
          <div className="flex justify-between text-[9px] text-slate-600 font-mono">
              <span>TEXTURES</span>
              <span>4K</span>
          </div>
      </div>

    </div>
  );
};
