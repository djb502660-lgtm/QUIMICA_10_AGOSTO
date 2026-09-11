import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
  isDark: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, isDark }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Duración total de la animación antes de llamar a onFinish
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Esperar a que termine la transición de desvanecimiento
    }, 3000); // 3 segundos de pantalla de carga

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-500 ${
        isDark ? 'bg-slate-900' : 'bg-white'
      } ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
        <div className="relative w-64 h-64 md:w-96 md:h-96 mb-8 group">
          {/* Logo / Carga */}
          <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-1000"></div>
          <img 
            src="/assets/logo_istae_10agosto.png" 
            alt="Loading Assistant" 
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(56,189,248,0.5)] rounded-2xl relative z-10"
          />
        </div>
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
          
          <p className={`text-lg font-semibold tracking-widest uppercase animate-pulse ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            Agostin se está preparando...
          </p>
        </div>
      </div>
    </div>
  );
};
