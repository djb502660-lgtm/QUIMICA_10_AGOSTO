import { useState, useRef, useCallback, useEffect } from "react";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { ConnectionState } from "../types";
import { createBlob, decode, decodeAudioData } from "../utils/audioUtils";

export interface ConnectConfig {
  systemInstruction: string;
  voiceName: string;
  onTranscript?: (role: "user" | "assistant", text: string) => void;
  apiKey?: string;
  tools?: any[];
}

export const useGeminiLive = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(0); // 0 a 100 para el visualizador

  // Referencias para rastrear el contexto de audio y la conexión
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const sessionRef = useRef<any>(null); // Referencia a la sesión activa
  const lastConfigRef = useRef<any>(null); // Para auto-reconectar silenciosamente

  // Referencias y estado para compartir pantalla
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const screenIntervalRef = useRef<any>(null);
   // Referencias para mezcla de audio de pantalla compartida
  const screenAudioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const screenAudioGainRef = useRef<GainNode | null>(null);
  
  // Referencias para persistencia y duración de sesión
  const lastAssistantSpeechRef = useRef<string>("");
  const sessionStartTimeRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    // Limpiar audio de pantalla
    if (screenAudioSourceRef.current) {
      try { screenAudioSourceRef.current.disconnect(); } catch (e) {}
      screenAudioSourceRef.current = null;
    }
    if (screenAudioGainRef.current) {
      try { screenAudioGainRef.current.disconnect(); } catch (e) {}
      screenAudioGainRef.current = null;
    }

    if (processorRef.current) {
      try { 
        processorRef.current.onaudioprocess = null;
        processorRef.current.disconnect(); 
      } catch (e) {}
      processorRef.current = null;
    }
    if (sourceRef.current) {
      try { sourceRef.current.disconnect(); } catch (e) {}
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close().catch(() => {});
      inputAudioContextRef.current = null;
    }
    if (audioContextRef.current) {
      activeSourcesRef.current.forEach(source => {
        try {
          source.stop();
          source.disconnect();
        } catch (e) {}
      });
      activeSourcesRef.current = [];
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current = null;
    }
    
    // Limpiar pantalla compartida
    if (screenIntervalRef.current) {
      clearInterval(screenIntervalRef.current);
      screenIntervalRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(t => t.stop());
      screenStreamRef.current = null;
    }
    if (videoElementRef.current) {
      videoElementRef.current.pause();
      videoElementRef.current.srcObject = null;
    }
    setIsScreenSharing(false);
  }, []);

  const disconnect = useCallback(() => {
    cleanup();
    setConnectionState(ConnectionState.DISCONNECTED);
    setVolume(0);
    sessionStartTimeRef.current = 0;
  }, [cleanup]);

  const connect = useCallback(
    async (config: ConnectConfig, isResume: boolean = false) => {
      lastConfigRef.current = config;
      // Solo resetear el inicio si no es un resume
      if (!isResume) sessionStartTimeRef.current = Date.now();
      
      setErrorMessage(null);
      setConnectionState(ConnectionState.CONNECTING);

      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
          throw new Error("Tu navegador no soporta el procesamiento de audio necesario para el asistente. Usa Chrome o Edge.");
        }
        const outputCtx = new AudioContextClass();
        await outputCtx.resume();

        audioContextRef.current = outputCtx;
        nextStartTimeRef.current = outputCtx.currentTime;

        const inputCtx = new AudioContextClass();
        inputAudioContextRef.current = inputCtx;
        const inputSampleRate = inputCtx.sampleRate;

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("El navegador no permite el acceso al micrófono. Asegúrate de estar usando una conexión segura (HTTPS o localhost).");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        streamRef.current = stream;

        // Modificar instruction si es un resume para que no se pierda el hilo
        let systemInstructionText = config.systemInstruction;
        if (isResume && lastAssistantSpeechRef.current) {
          systemInstructionText += `\n\n[CONTEXTO DE REANUDACIÓN]: Esta sesión se ha actualizado para mantener la estabilidad. Lo último que estabas diciendo era: "${lastAssistantSpeechRef.current}". Por favor, retoma la idea o pregunta si el usuario quiere continuar con ese tema de forma natural, sin mencionar que te reiniciaste.`;
        }

        // Obtener la API key, priorizando la provista en la configuración, .env o localStorage
        const storedKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
        const envKey = (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) || 
          (typeof process !== 'undefined' && process.env && (process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY));
        
        const apiKey = config.apiKey || 
          (envKey && envKey.trim().length > 0 ? envKey.trim() : null) ||
          (storedKey && storedKey.trim().length > 0 ? storedKey.trim() : null);
          
        if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_API_KEY')) {
          throw new Error("API Key de Gemini no configurada o inválida. Haz clic en el botón de llave en la parte superior para ingresar tu API Key.");
        }
        
        // Sincronizar la API key con localStorage para evitar caché obsoleta
        try {
          if (storedKey !== apiKey) {
            localStorage.setItem('gemini_api_key', apiKey);
          }
        } catch (e) {
          console.warn('No se pudo acceder a localStorage para sincronizar la API key.', e);
        }

        const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });

        // Configuración del modelo con herramienta de búsqueda "searchWeb"
        const geminiConfig: any = {
          model: "gemini-3.1-flash-live-preview",
          tools: [
            { searchWeb: {} }
          ],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: config.voiceName } },
            },
            systemInstruction: { parts: [{ text: systemInstructionText }] },
          },
        };

        let currentInputTranscription = "";
        let currentOutputTranscription = "";

        const session = await ai.live.connect({
          ...geminiConfig,
          callbacks: {
            onopen: () => {
              console.log("🟢 [Gemini Live] Conexión abierta con el servidor.");
              setConnectionState(ConnectionState.CONNECTED);
              setErrorMessage(null);

              if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
              }

              const source = inputCtx.createMediaStreamSource(stream);
              sourceRef.current = source;

              const processor = inputCtx.createScriptProcessor(4096, 1, 1);
              processorRef.current = processor;

              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(v => Math.max(v * 0.9, rms * 100));

                // Solo enviar audio si la sesión está lista
                if (sessionRef.current) {
                  const pcmBlob = createBlob(inputData, inputSampleRate);
 
                  try {
                    sessionRef.current.sendRealtimeInput({
                      audio: { data: pcmBlob.data, mimeType: pcmBlob.mimeType }
                    });
                  } catch (e) {
                    // Silenciar errores de envío si la sesión se cerró
                  }
                }
              };

              // Si ya estábamos compartiendo pantalla, reconectar el audio
              if (isScreenSharing && screenStreamRef.current) {
                  const audioTracks = screenStreamRef.current.getAudioTracks();
                  if (audioTracks.length > 0) {
                      const screenSource = inputCtx.createMediaStreamSource(new MediaStream(audioTracks));
                      screenAudioSourceRef.current = screenSource;
                      const screenGain = inputCtx.createGain();
                      screenGain.gain.value = 0.8;
                      screenAudioGainRef.current = screenGain;
                      screenSource.connect(screenGain);
                      screenGain.connect(processor);
                  }
              }

              source.connect(processor);
              processor.connect(inputCtx.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              const interrupted = message.serverContent?.interrupted;
              if (interrupted) {
                activeSourcesRef.current.forEach(s => { try { s.stop(); s.disconnect(); } catch (e) {} });
                activeSourcesRef.current = [];
                if (audioContextRef.current) nextStartTimeRef.current = audioContextRef.current.currentTime;
                setVolume(0);
                return;
              }

              if (message.serverContent?.inputTranscription?.text) {
                currentInputTranscription += message.serverContent.inputTranscription.text;
              }
              if (message.serverContent?.outputTranscription?.text) {
                currentOutputTranscription += message.serverContent.outputTranscription.text;
                lastAssistantSpeechRef.current = currentOutputTranscription; // Guardar lo último dicho
              }

              if (message.serverContent?.turnComplete) {
                if (currentInputTranscription.trim() && config.onTranscript) {
                  config.onTranscript("user", currentInputTranscription);
                  currentInputTranscription = "";
                }
                if (currentOutputTranscription.trim() && config.onTranscript) {
                  config.onTranscript("assistant", currentOutputTranscription);
                  // No limpiar lastAssistantSpeechRef aquí para que sirva de contexto en el siguiente refresh
                  currentOutputTranscription = "";
                }
              }

              const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (base64Audio && audioContextRef.current) {
                const ctx = audioContextRef.current;
                const pcmData = decode(base64Audio);
                const audioBuffer = await decodeAudioData(pcmData, ctx, 24000, 1);
                setVolume(50 + Math.random() * 30);
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(ctx.destination);
                activeSourcesRef.current.push(source);
                source.onended = () => { activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source); };
                const startTime = Math.max(nextStartTimeRef.current, ctx.currentTime);
                source.start(startTime);
                nextStartTimeRef.current = startTime + audioBuffer.duration;
              }
            },
            onclose: (event: any) => {
              const code = event?.code || 0;
              const reason = event?.reason || "Desconocida";
              console.log(`🔌 Conexión cerrada. Código: ${code}, Razón: ${reason}`);

              // RECONEXIÓN AUTOMÁTICA (Extensión de sesión o recuperación de errores)
              // 1008: Policy Violation (Time limit), 1001: Going Away, 1006: Abnormal Closure
              if (code === 1008 || code === 1001 || code === 1006) {
                 const elapsed = Date.now() - sessionStartTimeRef.current;
                 // Solo reintentar si la sesión duró al menos 1 segundo (evitar bucle infinito si falla al inicio)
                 if (elapsed > 1000 && lastConfigRef.current) {
                     console.log("⏱️ Sesión refrescada para estabilidad...");
                     cleanup();
                     setTimeout(() => {
                        if (lastConfigRef.current) connect(lastConfigRef.current, true);
                     }, 1000); // Un segundo de pausa antes de reintentar
                     return;
                 }
              }
              setErrorMessage(event?.reason || "Conexión cerrada.");
              disconnect();
            },
            onerror: (e: any) => {
              console.error("❌ [Gemini Live] Error de sesión:", e);
              setErrorMessage(e.message || "Error de sesión.");
              disconnect();
            },
          },
        });
        sessionRef.current = session;
      } catch (err: any) {
        setErrorMessage(err.message || "Error al conectar.");
        disconnect();
      }
    },
    [disconnect, cleanup, isScreenSharing]
  );

  const sendTextMessage = useCallback(async (text: string) => {
    if (sessionRef.current) {
      try {
        sessionRef.current.send({ turns: [{ role: "user", parts: [{ text: text }] }], turnComplete: true });
      } catch (e) {}
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (screenAudioSourceRef.current) { try { screenAudioSourceRef.current.disconnect(); } catch (e) {} screenAudioSourceRef.current = null; }
    if (screenAudioGainRef.current) { try { screenAudioGainRef.current.disconnect(); } catch (e) {} screenAudioGainRef.current = null; }
    if (screenIntervalRef.current) { clearInterval(screenIntervalRef.current); screenIntervalRef.current = null; }
    if (screenStreamRef.current) { screenStreamRef.current.getTracks().forEach(t => t.stop()); screenStreamRef.current = null; setScreenStream(null); }
    if (videoElementRef.current) {
      videoElementRef.current.pause();
      videoElementRef.current.srcObject = null;
      if (document.body.contains(videoElementRef.current)) document.body.removeChild(videoElementRef.current);
    }
    setIsScreenSharing(false);
  }, []);

  const startScreenShare = useCallback(async () => {
    if (!sessionRef.current) return;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      setErrorMessage("Tu navegador no soporta la función de compartir pantalla o requiere una conexión segura.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: { frameRate: { ideal: 1, max: 2 } },
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
      });
      screenStreamRef.current = stream;
      setScreenStream(stream);

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0 && inputAudioContextRef.current && processorRef.current) {
        console.log("🔊 Mezclando audio de pantalla...");
        const inputCtx = inputAudioContextRef.current;
        const screenSource = inputCtx.createMediaStreamSource(new MediaStream(audioTracks));
        screenAudioSourceRef.current = screenSource;
        const screenGain = inputCtx.createGain();
        screenGain.gain.value = 0.8;
        screenAudioGainRef.current = screenGain;
        screenSource.connect(screenGain);
        screenGain.connect(processorRef.current); // Conexión directa para mezcla automática
      }

      const video = document.createElement('video');
      video.autoplay = true; video.playsInline = true; video.muted = true; video.srcObject = stream;
      video.style.cssText = "position:fixed;bottom:0;right:0;opacity:0.01;pointer-events:none;width:10px;height:10px;";
      document.body.appendChild(video);
      videoElementRef.current = video;
      await video.play();
      const canvas = document.createElement('canvas');
      canvasElementRef.current = canvas;
      setIsScreenSharing(true);
      const sendFrame = async () => {
        if (!videoElementRef.current || !canvasElementRef.current || !sessionRef.current) return;
        const v = videoElementRef.current; const c = canvasElementRef.current;
        if (v.videoWidth === 0) return;
        const scale = Math.min(800 / v.videoWidth, 600 / v.videoHeight, 1);
        c.width = v.videoWidth * scale; c.height = v.videoHeight * scale;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(v, 0, 0, c.width, c.height);
          const base64 = c.toDataURL('image/jpeg', 0.7).split(',')[1];
          try { 
            // Usando la estructura de partes de contenido, que es más robusta en algunas versiones del SDK
            sessionRef.current.sendRealtimeInput([
              { mimeType: 'image/jpeg', data: base64 }
            ]); 
          } catch(e) {
            console.warn("Error enviando frame de video:", e);
          }
        }
      };
      sendFrame();
      screenIntervalRef.current = setInterval(sendFrame, 1000);
      
      // Enviar un aviso invisible a la IA para que empiece a procesar la visión
      setTimeout(() => {
        if (sessionRef.current) {
          sendTextMessage("(El usuario ha activado el compartir pantalla. Por favor, observa lo que muestra y comenta o ayuda según lo que veas.)");
        }
      }, 1500);

      stream.getVideoTracks()[0].onended = () => stopScreenShare();
    } catch (err) { stopScreenShare(); }
  }, [stopScreenShare]);

  return {
    connectionState, errorMessage, volume, connect, disconnect, sendTextMessage, isScreenSharing, startScreenShare, stopScreenShare, screenStream
  };
};
