import React from 'react';
import { SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StepButtonsProps {
  onStepForward: () => void;
  onStepBackward: () => void;
  onFirst: () => void;
  onLast: () => void;
  canStepForward: boolean;
  canStepBackward: boolean;
}

export const StepButtons: React.FC<StepButtonsProps> = ({
  onStepForward,
  onStepBackward,
  onFirst,
  onLast,
  canStepForward,
  canStepBackward,
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={onFirst}
        disabled={!canStepBackward}
        className="h-9 w-9"
      >
        <SkipBack className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onStepBackward}
        disabled={!canStepBackward}
        className="h-9 w-9"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onStepForward}
        disabled={!canStepForward}
        className="h-9 w-9"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onLast}
        disabled={!canStepForward}
        className="h-9 w-9"
      >
        <SkipForward className="w-4 h-4" />
      </Button>
    </div>
  );
};
