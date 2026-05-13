import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shuffle, Edit3 } from 'lucide-react';
import { AlgorithmCategory } from '../algorithms/types';

interface InputPanelProps {
  category: AlgorithmCategory;
  onInputChange: (input: any) => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({ category, onInputChange }) => {
  const [customInput, setCustomInput] = useState('');
  const [arraySize, setArraySize] = useState(10);

  const generateRandomArray = () => {
    const arr = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    onInputChange(arr);
    setCustomInput(arr.join(', '));
  };

  const parseCustomInput = () => {
    if (category === 'sorting') {
      const arr = customInput
        .split(',')
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n));
      if (arr.length > 0) {
        onInputChange(arr);
      }
    }
  };

  if (category === 'sorting') {
    return (
      <div className="p-5 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm tracking-tight text-foreground">Input Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2.5">
            <Label htmlFor="arraySize" className="text-xs font-medium text-muted-foreground">
              Array Size (3-30)
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="arraySize"
                type="number"
                min={3}
                max={30}
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value) || 10)}
                className="w-full sm:w-24 h-9 bg-background/50 focus-visible:ring-primary"
              />
              <Button onClick={generateRandomArray} size="sm" variant="secondary" className="flex-1 h-9 gap-2 shadow-sm">
                <Shuffle className="w-3.5 h-3.5" />
                Randomize
              </Button>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="customInput" className="text-xs font-medium text-muted-foreground">
              Custom Array (comma-separated)
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                id="customInput"
                placeholder="64, 34, 25, 12..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="flex-1 h-9 font-mono text-sm bg-background/50 focus-visible:ring-primary"
              />
              <Button onClick={parseCustomInput} size="sm" className="w-full sm:w-auto h-9 gap-2 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90">
                <Edit3 className="w-3.5 h-3.5" />
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // For graph and DP, show simplified message
  return (
    <div className="p-5 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm">
      <h3 className="font-semibold text-sm mb-3 tracking-tight text-foreground">Input Configuration</h3>
      <div className="bg-background/50 rounded-lg p-3 border border-border/50">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Using default internal input for the <span className="font-medium text-foreground">{category}</span> algorithm. Custom interactive editing is coming in a future update.
        </p>
      </div>
    </div>
  );
};
