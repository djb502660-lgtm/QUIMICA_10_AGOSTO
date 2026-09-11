import React from 'react';
import { Assistant } from '../types';

interface VisualizerProps {
  volume: number; // 0 to 100
  isActive: boolean;
  theme: Assistant['theme'];
}

export const Visualizer: React.FC<VisualizerProps> = ({ volume, isActive, theme }) => {
  // Create 5 bars
  const bars = [0, 1, 2, 3, 4];

  // Map themes to specific visualizer gradient classes
  const themeStyles = {
    cyan: {
      bar: 'from-cyan-400 to-blue-600',
      shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.5)]',
      glow: 'bg-blue-500'
    },
    rose: {
      bar: 'from-rose-400 to-pink-600',
      shadow: 'shadow-[0_0_15px_rgba(251,113,133,0.5)]',
      glow: 'bg-rose-500'
    },
    amber: {
      bar: 'from-amber-400 to-orange-600',
      shadow: 'shadow-[0_0_15px_rgba(251,191,36,0.5)]',
      glow: 'bg-amber-500'
    },
    violet: {
      bar: 'from-violet-400 to-purple-600',
      shadow: 'shadow-[0_0_15px_rgba(167,139,250,0.5)]',
      glow: 'bg-violet-500'
    }
  };

  const currentStyle = themeStyles[theme];

  return (
    <div className="relative flex items-center justify-center h-32 w-full gap-2">
      {bars.map((i) => {
        // Calculate dynamic height based on volume and index
        // Center bars are taller
        const baseHeight = isActive ? 20 : 4;
        const multiplier = isActive ? (volume / 20) : 0; 
        
        // Add some randomness and offset for wave effect
        const height = Math.min(100, Math.max(4, baseHeight + (multiplier * (10 + Math.random() * 20))));
        
        // Use inline style for performant updates
        return (
          <div
            key={i}
            className={`w-3 rounded-full transition-all duration-75 ease-in-out ${
                isActive 
                ? `bg-gradient-to-t ${currentStyle.bar} ${currentStyle.shadow}` 
                : 'bg-slate-700'
            }`}
            style={{
              height: `${height}%`,
              opacity: isActive ? 0.8 + (volume/200) : 0.3
            }}
          />
        );
      })}
      
      {/* Glow effect behind */}
      {isActive && (
        <div 
            className={`absolute inset-0 ${currentStyle.glow} blur-3xl opacity-10 rounded-full animate-pulse`}
            style={{ transform: `scale(${1 + volume/100})` }}
        ></div>
      )}
    </div>
  );
};