import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrayVisualizationState, ArrayElement } from '../algorithms/types';
import { cn } from '@/lib/utils';

interface ArrayVisualizerProps {
  state: ArrayVisualizationState;
}

const getBarColor = (element: ArrayElement): string => {
  switch (element.state) {
    case 'comparing':
      return 'bg-algo-compare glow-warning shadow-[0_0_20px_rgba(250,204,21,0.5)]';
    case 'swapping':
      return 'bg-algo-swap glow-destructive shadow-[0_0_20px_rgba(239,68,68,0.5)]';
    case 'sorted':
      return 'bg-algo-sorted shadow-[0_0_20px_rgba(34,197,94,0.5)]';
    case 'pivot':
      return 'bg-algo-current glow-accent shadow-[0_0_20px_rgba(168,85,247,0.5)]';
    default:
      return 'bg-primary shadow-[0_0_15px_rgba(6,182,212,0.3)]';
  }
};

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ state }) => {
  const { elements } = state;
  const maxValue = Math.max(...elements.map(e => e.value), 1);
  const barWidth = Math.max(20, Math.min(60, 600 / elements.length));

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end justify-center gap-[2px] sm:gap-1 p-4 min-h-[300px] overflow-hidden relative">
        <AnimatePresence>
          {elements.map((element, index) => {
            const heightPercent = (element.value / maxValue) * 100;
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 24,
                  mass: 0.8
                }}
                key={element.originalIndex}
                className="flex flex-col items-center justify-end"
                style={{ width: barWidth }}
              >
                <div
                  className={cn(
                    "w-full rounded-t-sm relative overflow-hidden transition-colors duration-300",
                    getBarColor(element)
                  )}
                  style={{
                    height: `${Math.max(heightPercent, 5)}%`,
                    minHeight: '20px',
                  }}
                >
                  {/* Inner gradient overlay for premium look */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent mix-blend-overlay" />
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-muted-foreground mt-2 opacity-80">
                  {element.value}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 py-3 border-t border-white/5 bg-black/20 backdrop-blur-sm z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[3px] bg-primary shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
          <span className="text-xs text-muted-foreground font-medium tracking-wide">Default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[3px] bg-algo-compare shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
          <span className="text-xs text-muted-foreground font-medium tracking-wide">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[3px] bg-algo-swap shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          <span className="text-xs text-muted-foreground font-medium tracking-wide">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[3px] bg-algo-sorted shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="text-xs text-muted-foreground font-medium tracking-wide">Sorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-[3px] bg-algo-current shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <span className="text-xs text-muted-foreground font-medium tracking-wide">Pivot</span>
        </div>
      </div>
    </div>
  );
};
