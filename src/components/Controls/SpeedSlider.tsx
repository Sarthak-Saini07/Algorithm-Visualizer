import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Gauge } from 'lucide-react';

interface SpeedSliderProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const SpeedSlider: React.FC<SpeedSliderProps> = ({ speed, onSpeedChange }) => {
  // Speed is in ms, so we invert for display (higher = faster)
  const displayValue = 1100 - speed;
  
  const handleChange = (value: number[]) => {
    onSpeedChange(1100 - value[0]);
  };

  const getSpeedLabel = () => {
    if (speed <= 100) return 'Fast';
    if (speed <= 300) return 'Normal';
    if (speed <= 600) return 'Slow';
    return 'Very Slow';
  };

  return (
    <div className="flex items-center gap-3 min-w-[160px]">
      <Gauge className="w-4 h-4 text-muted-foreground" />
      <Slider
        value={[displayValue]}
        min={100}
        max={1000}
        step={50}
        onValueChange={handleChange}
        className="w-24"
      />
      <span className="text-xs text-muted-foreground min-w-[60px]">
        {getSpeedLabel()}
      </span>
    </div>
  );
};
