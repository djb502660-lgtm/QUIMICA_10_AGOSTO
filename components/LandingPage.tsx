import React from 'react';
import { ArrowRight, LayoutGrid, ListTodo, MessageSquare, Sparkles, Sun, Moon, Home } from 'lucide-react';

export interface CardConfig {
  title: string;
  description: string;
  isActive: boolean;
  onClick?: () => void;
  centered?: boolean;
}

interface LandingPageProps {
  cards: CardConfig[];
  isDark: boolean;
  onToggleTheme: () => void;
  onGoHome?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ cards, isDark, onToggleTheme, onGoHome }) => {
  // Aseguramos que siempre haya 4 tarjetas para mantener el diseño
  const safeCards = cards.length === 4 ? cards : Array(4).fill({
    title: '...',
    description: '...',
    isActive: false
  });

  return (
    <div className={`min-h-screen font-sans overflow-y-auto transition-colors duration-500 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
    }`}>
      {/* Navbar simplificado */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {onGoHome && (
            <button 
              onClick={onGoHome}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
              }`}
              title="Ir al Inicio"
            >
              <Home className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <a 
              href="https://www.istae.edu.ec" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 shrink-0 transition-transform hover:scale-110 cursor-pointer"
              title="Visitar sitio web del instituto"
            >
              <img 
                src="/assets/institute_logo.png" 
                alt="Logo Instituto" 
                className="w-full h-full object-contain"
              />
            </a>
            <span className={`text-lg md:text-xl font-bold bg-clip-text text-transparent ${
              isDark ? 'bg-gradient-to-r from-white to-slate-400' : 'bg-gradient-to-r from-slate-900 to-slate-700'
            }`}>
              Instituto Superior Tecnológico Alberto Enríquez
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className={`text-sm font-medium transition-colors ${
            isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}>Iniciar sesión</button>
          <button className="px-4 py-2 bg-violet-600 text-white rounded-full text-sm font-medium hover:bg-violet-700 transition-colors">
            Registrate gratis
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-24 text-center">
        <h1 className={`text-5xl md:text-6xl font-bold tracking-tight mb-6 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Productividad para <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">Equipos Felices</span>
        </h1>
        <p className={`text-xl max-w-2xl mx-auto mb-16 leading-relaxed ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          La suite de software de productividad enfocada a un flujo de trabajo natural y eficiente para nuestra institución.
        </p>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          
          {/* Tarjeta 1 - Estilo Blue */}
          <div className={`group relative rounded-3xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 flex flex-col h-80 overflow-hidden ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          } ${safeCards[0].isActive ? 'cursor-pointer hover:border-blue-500' : ''} ${
            safeCards[0].centered ? 'items-center text-center' : 'items-start text-left'
          }`} onClick={safeCards[0].isActive ? safeCards[0].onClick : undefined}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 ${
              isDark ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}></div>
            <div className="relative z-10 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-blue-200 shadow-lg">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{safeCards[0].title}</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{safeCards[0].description}</p>
            <div className={`mt-auto pt-4 flex items-center font-medium ${safeCards[0].isActive ? 'text-blue-500' : 'text-blue-500 opacity-50 cursor-not-allowed'}`}>
              <span>{safeCards[0].isActive ? 'Acceder' : 'Próximamente'}</span>
              {safeCards[0].isActive && <ArrowRight className="w-4 h-4 ml-2" />}
            </div>
          </div>

          {/* Tarjeta 2 - Estilo Emerald */}
          <div className={`group relative rounded-3xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 flex flex-col h-80 overflow-hidden ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          } ${safeCards[1].isActive ? 'cursor-pointer hover:border-emerald-500' : ''} ${
            safeCards[1].centered ? 'items-center text-center' : 'items-start text-left'
          }`} onClick={safeCards[1].isActive ? safeCards[1].onClick : undefined}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 ${
              isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
            }`}></div>
            <div className="relative z-10 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-emerald-200 shadow-lg">
              <ListTodo className="w-6 h-6" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{safeCards[1].title}</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{safeCards[1].description}</p>
            <div className={`mt-auto pt-4 flex items-center font-medium ${safeCards[1].isActive ? 'text-emerald-500' : 'text-emerald-500 opacity-50 cursor-not-allowed'}`}>
              <span>{safeCards[1].isActive ? 'Acceder' : 'Próximamente'}</span>
              {safeCards[1].isActive && <ArrowRight className="w-4 h-4 ml-2" />}
            </div>
          </div>

          {/* Tarjeta 3 - Estilo Amber */}
          <div className={`group relative rounded-3xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 flex flex-col h-80 overflow-hidden ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
          } ${safeCards[2].isActive ? 'cursor-pointer hover:border-amber-500' : ''} ${
            safeCards[2].centered ? 'items-center text-center' : 'items-start text-left'
          }`} onClick={safeCards[2].isActive ? safeCards[2].onClick : undefined}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 ${
              isDark ? 'bg-amber-900/30' : 'bg-amber-100'
            }`}></div>
            <div className="relative z-10 w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-amber-200 shadow-lg">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{safeCards[2].title}</h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{safeCards[2].description}</p>
            <div className={`mt-auto pt-4 flex items-center font-medium ${safeCards[2].isActive ? 'text-amber-500' : 'text-amber-500 opacity-50 cursor-not-allowed'}`}>
              <span>{safeCards[2].isActive ? 'Acceder' : 'Próximamente'}</span>
              {safeCards[2].isActive && <ArrowRight className="w-4 h-4 ml-2" />}
            </div>
          </div>

          {/* Tarjeta 4 - Estilo DST (Violet/Image) */}
          <div 
            onClick={safeCards[3].isActive ? safeCards[3].onClick : undefined}
            className={`group relative rounded-3xl p-0 shadow-xl border-2 border-transparent transition-all duration-300 h-80 overflow-hidden ring-4 ring-transparent ${
              isDark ? 'bg-slate-800' : 'bg-white'
            } ${safeCards[3].isActive ? 'cursor-pointer hover:border-violet-500 hover:ring-violet-100' : 'opacity-80'}`}
          >
            {/* Imagen de fondo completa para la tarjeta */}
            <div className="absolute inset-0 bg-slate-900">
               <img 
                src="/assets/dst_card.png" 
                alt="DST Background" 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
            </div>

            <div className={`relative z-10 p-8 h-full flex flex-col ${safeCards[3].centered ? 'items-center text-center' : 'items-start text-left'}`}>
              <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center text-white mb-6 shadow-lg shadow-violet-900/50 group-hover:scale-110 transition-transform duration-300">
                <span className="font-bold text-xl">4</span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">{safeCards[3].title}</h3>
              <p className="text-slate-300 text-sm">{safeCards[3].description}</p>
              
              <div className={`mt-auto pt-4 flex items-center text-white font-medium transition-transform ${safeCards[3].isActive ? 'group-hover:translate-x-2' : 'opacity-50'}`}>
                <span>{safeCards[3].isActive ? 'Acceder' : 'Próximamente'}</span>
                {safeCards[3].isActive && <ArrowRight className="w-4 h-4 ml-2" />}
              </div>
            </div>
          </div>

        </div>
      </main>
      
      {/* Decoración de fondo */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] ${
          isDark ? 'bg-pink-900/20' : 'bg-pink-200/30'
        }`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] ${
          isDark ? 'bg-violet-900/20' : 'bg-violet-200/30'
        }`}></div>
      </div>
    </div>
  );
};
