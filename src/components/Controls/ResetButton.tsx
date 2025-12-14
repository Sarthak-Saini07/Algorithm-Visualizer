import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResetButtonProps {
  onReset: () => void;
}

export const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onReset}
      className="gap-2"
    >
      <RotateCcw className="w-4 h-4" />
      Reset
    </Button>
  );
};
