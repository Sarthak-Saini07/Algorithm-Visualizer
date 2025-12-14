import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlayPauseProps {
  isPlaying: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const PlayPause: React.FC<PlayPauseProps> = ({ isPlaying, onToggle, disabled }) => {
  return (
    <Button
      onClick={onToggle}
      disabled={disabled}
      size="lg"
      className="w-12 h-12 rounded-full"
      variant={isPlaying ? 'secondary' : 'default'}
    >
      {isPlaying ? (
        <Pause className="w-5 h-5" />
      ) : (
        <Play className="w-5 h-5 ml-0.5" />
      )}
    </Button>
  );
};
