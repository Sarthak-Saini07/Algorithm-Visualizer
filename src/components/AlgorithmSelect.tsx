import React, { useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  const [open, setOpen] = useState(false);
  const categories: AlgorithmCategory[] = ['sorting', 'graph', 'dp'];
  const selectedConfig = selectedId ? algorithmRegistry.get(selectedId) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between bg-black/40 border-white/10 hover:bg-white/5 transition-colors font-medium backdrop-blur-md"
        >
          {selectedConfig ? (
            <span className="flex items-center gap-2">
              <span className="text-primary">{categoryIcons[selectedConfig.info.category]}</span>
              {selectedConfig.info.name}
            </span>
          ) : (
            <span className="text-muted-foreground">Select algorithm...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0 bg-[#0a0a0a] border-white/10 shadow-2xl backdrop-blur-xl">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search algorithms..." className="border-none focus:ring-0" />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>No algorithm found.</CommandEmpty>
            {categories.map((category) => {
              const algorithms = getAlgorithmsByCategory(category);
              if (algorithms.length === 0) return null;

              return (
                <CommandGroup 
                  key={category} 
                  heading={
                    <div className="flex items-center gap-2 text-muted-foreground font-medium py-1">
                      {categoryIcons[category]}
                      {categoryNames[category]}
                    </div>
                  }
                >
                  {algorithms.map((algo) => (
                    <CommandItem
                      key={algo.info.id}
                      value={algo.info.id}
                      onSelect={(currentValue) => {
                        const config = algorithmRegistry.get(currentValue);
                        if (config) {
                          onSelect(config);
                        }
                        setOpen(false);
                      }}
                      className={cn(
                        "cursor-pointer rounded-md my-1 aria-selected:bg-primary/20 aria-selected:text-primary transition-colors",
                        selectedId === algo.info.id ? "bg-primary/10 text-primary font-medium" : ""
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-primary",
                          selectedId === algo.info.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {algo.info.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
