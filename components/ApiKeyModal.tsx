import React, { useState, useEffect } from 'react';
import { Key, ExternalLink, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKey: (key: string) => void;
  currentKey: string;
  theme?: 'cyan' | 'rose' | 'amber' | 'violet';
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaveKey,
  currentKey,
  theme = 'cyan'
}) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setApiKeyInput(currentKey || '');
  }, [currentKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKeyInput.trim();
    
    // Validar formato de la clave
    const isValid = cleanKey.startsWith("QA") || cleanKey.startsWith("AQ") || cleanKey.startsWith("AIzaSy");
    
    if (!isValid && cleanKey.length > 0) {
      setErrorMsg("Formato de clave inválido. Debe empezar con 'AIzaSy', 'AQ' o 'QA'.");
      return;
    }
    
    setErrorMsg('');
    onSaveKey(cleanKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  const themeClasses = {
    cyan: 'from-cyan-500 to-blue-600 border-cyan-400/30 text-cyan-400 focus:ring-cyan-400',
    rose: 'from-rose-500 to-pink-600 border-rose-400/30 text-rose-400 focus:ring-rose-400',
    amber: 'from-amber-500 to-orange-600 border-amber-400/30 text-amber-400 focus:ring-amber-400',
    violet: 'from-violet-500 to-purple-600 border-violet-400/30 text-violet-400 focus:ring-violet-400',
  }[theme];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
        
        {/* Decorative background glow */}
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${themeClasses}`} />
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <Key className={`w-6 h-6 ${themeClasses.split(' ').pop()}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Configurar API Key</h3>
              <p className="text-xs text-slate-400">Gemini Live Multimodal API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-normal lowercase hover:underline"
              >
                Obtener Key gratis <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-red-400 mt-1 animate-in fade-in slide-in-from-top-1">
                {errorMsg}
              </p>
            )}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              La API Key se guarda localmente en tu navegador para permitir la interacción por voz en tiempo real.
            </p>
          </div>

          {!currentKey && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Se requiere una API Key válida de Google AI Studio para activar la función de conversación en vivo.</span>
            </div>
          )}

          {/* Tips para obtener API Key */}
          <div className="space-y-2 p-3 rounded-xl bg-slate-800/50 border border-white/5">
            <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">💡 ¿Se agotó tu cuota gratuita?</p>
            <ul className="text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Usa otra cuenta de Google en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">AI Studio</a> para una nueva key gratuita.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>Crea un nuevo proyecto en <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google Cloud Console</a> con la API de Gemini activada.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-cyan-400 mt-0.5">•</span>
                <span>La cuota gratuita se renueva cada mes. Espera a que se reinicie.</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!apiKeyInput.trim()}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg bg-gradient-to-r ${themeClasses} hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" /> ¡Guardada!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Guardar API Key
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
