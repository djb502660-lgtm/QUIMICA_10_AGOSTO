import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';
import { Assistant } from '../types';

interface ClockWidgetProps {
  theme: Assistant['theme'];
}

interface LocationInfo {
  city: string;
  country: string;
  region: string;
  loading: boolean;
  error: boolean;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({ theme }) => {
  const [time, setTime] = useState(new Date());
  const [location, setLocation] = useState<LocationInfo>({
    city: '',
    country: '',
    region: '',
    loading: true,
    error: false,
  });

  // Theme styles matching the app's design system
  const styles = {
    cyan: {
      accent: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-slate-900/50',
      glow: 'shadow-[0_0_15px_rgba(34,211,238,0.15)]',
      gradientText: 'from-cyan-300 to-blue-400',
      dot: 'bg-cyan-400',
      secondHand: 'bg-cyan-400',
      minuteHand: 'bg-cyan-300',
      hourHand: 'bg-white',
      tickMark: 'bg-cyan-500/60',
      locationBg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    rose: {
      accent: 'text-rose-400',
      border: 'border-rose-500/30',
      bg: 'bg-slate-900/50',
      glow: 'shadow-[0_0_15px_rgba(244,114,182,0.15)]',
      gradientText: 'from-rose-300 to-pink-400',
      dot: 'bg-rose-400',
      secondHand: 'bg-rose-400',
      minuteHand: 'bg-rose-300',
      hourHand: 'bg-white',
      tickMark: 'bg-rose-500/60',
      locationBg: 'bg-rose-500/10 border-rose-500/20',
    },
    amber: {
      accent: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-slate-900/50',
      glow: 'shadow-[0_0_15px_rgba(251,191,36,0.15)]',
      gradientText: 'from-amber-300 to-orange-400',
      dot: 'bg-amber-400',
      secondHand: 'bg-amber-400',
      minuteHand: 'bg-amber-300',
      hourHand: 'bg-white',
      tickMark: 'bg-amber-500/60',
      locationBg: 'bg-amber-500/10 border-amber-500/20',
    },
    violet: {
      accent: 'text-violet-400',
      border: 'border-violet-500/30',
      bg: 'bg-slate-900/50',
      glow: 'shadow-[0_0_15px_rgba(167,139,250,0.15)]',
      gradientText: 'from-violet-300 to-purple-400',
      dot: 'bg-violet-400',
      secondHand: 'bg-violet-400',
      minuteHand: 'bg-violet-300',
      hourHand: 'bg-white',
      tickMark: 'bg-violet-500/60',
      locationBg: 'bg-violet-500/10 border-violet-500/20',
    },
  };

  const s = styles[theme];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user's location via Geolocation API + reverse geocoding
  useEffect(() => {
    const fetchLocation = async () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=es`
              );
              const data = await response.json();
              setLocation({
                city: data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || 'Desconocida',
                country: data.address?.country || '',
                region: data.address?.state || data.address?.county || '',
                loading: false,
                error: false,
              });
            } catch {
              fetchByIP();
            }
          },
          () => {
            fetchByIP();
          },
          { timeout: 5000 }
        );
      } else {
        fetchByIP();
      }
    };

    const fetchByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setLocation({
          city: data.city || 'Desconocida',
          country: data.country_name || '',
          region: data.region || '',
          loading: false,
          error: false,
        });
      } catch {
        setLocation({
          city: '',
          country: '',
          region: '',
          loading: false,
          error: true,
        });
      }
    };

    fetchLocation();
  }, []);

  // Format time components
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const is12Hour = hours >= 12;
  const displayHour = hours % 12 || 12;

  // Analog clock angles
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  // Format date
  const dateStr = time.toLocaleDateString('es-CO', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  // Hour marks for analog clock
  const hourMarks = Array.from({ length: 12 }, (_, i) => i);
  const minuteMarks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div
      className={`flex flex-row items-center gap-4 px-4 py-3 rounded-2xl border backdrop-blur-md transition-all duration-300 w-full ${s.border} ${s.bg} ${s.glow}`}
    >
      {/* Analog Clock - Compact */}
      <div className="relative w-24 h-24 min-w-[96px] rounded-full border border-white/10 bg-slate-800/60 flex items-center justify-center">
        {/* Minute tick marks */}
        {minuteMarks.map((i) => (
          <div
            key={`min-${i}`}
            className="absolute w-full h-full"
            style={{ transform: `rotate(${i * 6}deg)` }}
          >
            <div
              className={`absolute top-[3px] left-1/2 -translate-x-1/2 rounded-full ${
                i % 5 === 0 ? 'w-[1.5px] h-[4px]' : 'w-[0.5px] h-[2px]'
              } ${i % 5 === 0 ? s.tickMark : 'bg-slate-700'}`}
            />
          </div>
        ))}

        {/* Hour numbers */}
        {hourMarks.map((i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const radius = 34;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <span
              key={`hr-${i}`}
              className="absolute text-[7px] font-semibold text-slate-400"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {i === 0 ? 12 : i}
            </span>
          );
        })}

        {/* Hour Hand */}
        <div
          className="absolute origin-bottom rounded-full"
          style={{
            width: '2.5px',
            height: '20px',
            bottom: '50%',
            left: 'calc(50% - 1.25px)',
            transform: `rotate(${hourDeg}deg)`,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'white',
            boxShadow: '0 0 4px rgba(255,255,255,0.4)',
          }}
        />

        {/* Minute Hand */}
        <div
          className="absolute origin-bottom rounded-full"
          style={{
            width: '2px',
            height: '28px',
            bottom: '50%',
            left: 'calc(50% - 1px)',
            transform: `rotate(${minuteDeg}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className={`w-full h-full rounded-full ${s.minuteHand}`} />
        </div>

        {/* Second Hand */}
        <div
          className="absolute origin-bottom"
          style={{
            width: '1px',
            height: '32px',
            bottom: '50%',
            left: 'calc(50% - 0.5px)',
            transform: `rotate(${secondDeg}deg)`,
            transition:
              seconds === 0
                ? 'none'
                : 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div className={`w-full h-full rounded-full ${s.secondHand} opacity-80`} />
        </div>

        {/* Center dot */}
        <div
          className={`absolute w-2 h-2 rounded-full ${s.dot} z-10`}
          style={{ boxShadow: '0 0 6px currentColor' }}
        />
      </div>

      {/* Right Side: Digital time + Date + Location */}
      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        {/* Digital Time + AM/PM */}
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl font-bold bg-gradient-to-r ${s.gradientText} bg-clip-text text-transparent tabular-nums leading-none`}
          >
            {String(displayHour).padStart(2, '0')}
          </span>
          <span className={`text-xl font-bold ${s.accent} animate-pulse leading-none`}>:</span>
          <span
            className={`text-xl font-bold bg-gradient-to-r ${s.gradientText} bg-clip-text text-transparent tabular-nums leading-none`}
          >
            {String(minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-slate-500 tabular-nums leading-none">
            :{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-[9px] text-slate-500 uppercase tracking-wider ml-1 leading-none">
            {is12Hour ? 'PM' : 'AM'}
          </span>
        </div>

        {/* Date */}
        <p className="text-[10px] text-slate-400 capitalize leading-none">{dateStr}</p>

        {/* Location - Compact */}
        <div
          className={`px-2 py-1.5 rounded-lg border ${s.locationBg} flex items-center gap-1.5 transition-all duration-300`}
        >
          {location.loading ? (
            <div className="flex items-center gap-1.5">
              <Navigation className="w-2.5 h-2.5 text-slate-500 animate-spin" />
              <span className="text-[10px] text-slate-500">Ubicando...</span>
            </div>
          ) : location.error ? (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-2.5 h-2.5 text-slate-600" />
              <span className="text-[10px] text-slate-600">No disponible</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className={`w-2.5 h-2.5 ${s.accent} shrink-0`} />
              <span className="text-[10px] text-white font-medium truncate">
                {location.city}{location.region ? `, ${location.region}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
