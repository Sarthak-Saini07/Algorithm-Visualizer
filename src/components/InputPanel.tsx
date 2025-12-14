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
      <div className="p-4 bg-card rounded-lg border border-border space-y-4">
        <h3 className="font-semibold text-sm">Input Configuration</h3>
        
        <div className="flex items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="arraySize" className="text-xs text-muted-foreground">
              Array Size
            </Label>
            <Input
              id="arraySize"
              type="number"
              min={3}
              max={30}
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value) || 10)}
              className="w-20 h-8 text-sm"
            />
          </div>
          <Button onClick={generateRandomArray} size="sm" variant="secondary" className="gap-2">
            <Shuffle className="w-3 h-3" />
            Generate Random
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customInput" className="text-xs text-muted-foreground">
            Custom Input (comma-separated)
          </Label>
          <div className="flex gap-2">
            <Input
              id="customInput"
              placeholder="e.g., 64, 34, 25, 12, 22, 11"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 h-8 text-sm font-mono"
            />
            <Button onClick={parseCustomInput} size="sm" variant="secondary" className="gap-2">
              <Edit3 className="w-3 h-3" />
              Apply
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // For graph and DP, show simplified message
  return (
    <div className="p-4 bg-card rounded-lg border border-border">
      <h3 className="font-semibold text-sm mb-2">Input Configuration</h3>
      <p className="text-xs text-muted-foreground">
        Using default input for {category} algorithm. Custom input editing coming soon.
      </p>
    </div>
  );
};
