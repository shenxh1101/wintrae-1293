import { SongStatus, ReleaseStatus, SONG_STATUS_LABELS, RELEASE_STATUS_LABELS } from '@/types';
import { Lightbulb, Music, Mic, Headphones, Settings, CheckCircle, Clock, FileCheck, Upload, Globe, Archive } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: SongStatus | ReleaseStatus;
  size?: 'sm' | 'md';
}

const songStatusConfig: Record<SongStatus, { icon: LucideIcon; color: string; bg: string }> = {
  idea: { icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  arranging: { icon: Music, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  to_record: { icon: Mic, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  recorded: { icon: Headphones, color: 'text-orange-300', bg: 'bg-orange-500/15' },
  mixing: { icon: Settings, color: 'text-amber-300', bg: 'bg-amber-500/15' },
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
};

const releaseStatusConfig: Record<ReleaseStatus, { icon: LucideIcon; color: string; bg: string }> = {
  planning: { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  ready: { icon: FileCheck, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  submitted: { icon: Upload, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  published: { icon: Globe, color: 'text-green-400', bg: 'bg-green-500/10' },
  archived: { icon: Archive, color: 'text-gray-400', bg: 'bg-gray-500/10' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const isSongStatus = status in songStatusConfig;
  const config = isSongStatus ? songStatusConfig[status as SongStatus] : releaseStatusConfig[status as ReleaseStatus];
  const label = isSongStatus ? SONG_STATUS_LABELS[status as SongStatus] : RELEASE_STATUS_LABELS[status as ReleaseStatus];
  const Icon = config.icon;
  
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5';
  
  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses} ${config.bg} ${config.color}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {label}
    </span>
  );
}
