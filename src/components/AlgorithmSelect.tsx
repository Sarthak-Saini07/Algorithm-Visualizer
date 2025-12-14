import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  algorithmRegistry, 
  getAlgorithmsByCategory, 
  categoryNames,
  categoryIcons,
} from '../algorithms/registry';
import { AlgorithmCategory, AlgorithmConfig } from '../algorithms/types';

interface AlgorithmSelectProps {
  selectedId: string | null;
  onSelect: (config: AlgorithmConfig) => void;
}

export const AlgorithmSelect: React.FC<AlgorithmSelectProps> = ({ selectedId, onSelect }) => {
  const categories: AlgorithmCategory[] = ['sorting', 'graph', 'dp'];

  const handleValueChange = (value: string) => {
    const config = algorithmRegistry.get(value);
    if (config) {
      onSelect(config);
    }
  };

  return (
    <Select value={selectedId || undefined} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[280px] bg-card">
        <SelectValue placeholder="Select an algorithm..." />
      </SelectTrigger>
      <SelectContent className="bg-popover">
        {categories.map((category) => {
          const algorithms = getAlgorithmsByCategory(category);
          if (algorithms.length === 0) return null;

          return (
            <SelectGroup key={category}>
              <SelectLabel className="flex items-center gap-2">
                <span>{categoryIcons[category]}</span>
                {categoryNames[category]}
              </SelectLabel>
              {algorithms.map((algo) => (
                <SelectItem key={algo.info.id} value={algo.info.id}>
                  {algo.info.name}
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
};
