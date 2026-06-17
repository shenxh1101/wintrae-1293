import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { formatDuration } from '@/utils/storage';
import { Waveform } from '@/components/ui/Waveform';

interface AudioPlayerProps {
  audioPath: string;
  duration?: number;
  title?: string;
}

export function AudioPlayer({ audioPath, duration, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [actualDuration, setActualDuration] = useState(duration || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setActualDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioPath]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(actualDuration, audioRef.current.currentTime + 10);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && actualDuration > 0) {
      audioRef.current.currentTime = percent * actualDuration;
    }
  };

  const progress = actualDuration > 0 ? (currentTime / actualDuration) * 100 : 0;

  return (
    <div className="bg-studio-900 rounded-xl p-4 border border-studio-700">
      <audio ref={audioRef} src={audioPath} />
      
      {title && (
        <div className="text-sm font-medium text-studio-200 mb-3 truncate">{title}</div>
      )}
      
      <div className="h-12 mb-3">
        <Waveform bars={48} height={48} isPlaying={isPlaying} />
      </div>
      
      <div
        className="h-1.5 bg-studio-700 rounded-full cursor-pointer mb-3 overflow-hidden"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-accent-orange rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-xs text-studio-400 font-mono">
          {formatDuration(currentTime)} / {formatDuration(actualDuration)}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={skipBackward}
            className="p-2 rounded-lg hover:bg-studio-700 text-studio-300 hover:text-studio-100 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-accent-orange hover:bg-accent-orange-hover text-white shadow-glow-orange transition-all hover:scale-105"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          <button
            onClick={skipForward}
            className="p-2 rounded-lg hover:bg-studio-700 text-studio-300 hover:text-studio-100 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        
        <button
          onClick={toggleMute}
          className="p-2 rounded-lg hover:bg-studio-700 text-studio-300 hover:text-studio-100 transition-colors"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
