import { useMemo } from 'react';

interface WaveformProps {
  bars?: number;
  height?: number;
  isPlaying?: boolean;
  color?: string;
  className?: string;
}

export function Waveform({ bars = 40, height = 32, isPlaying = false, color = 'bg-accent-orange', className = '' }: WaveformProps) {
  const barHeights = useMemo(() => {
    return Array.from({ length: bars }, () => Math.random() * 0.7 + 0.3);
  }, [bars]);

  return (
    <div className={`flex items-end justify-center gap-0.5 h-full ${className}`}>
      {barHeights.map((h, i) => (
        <div
          key={i}
          className={`w-1 ${color} rounded-full transition-all duration-150 ${
            isPlaying ? 'animate-wave' : ''
          }`}
          style={{
            height: `${h * height}px`,
            animationDelay: `${i * 0.03}s`,
          }}
        />
      ))}
    </div>
  );
}
