import React from 'react';
import { ArrayVisualizationState, ArrayElement } from '../algorithms/types';

interface ArrayVisualizerProps {
  state: ArrayVisualizationState;
}

const getBarColor = (element: ArrayElement): string => {
  switch (element.state) {
    case 'comparing':
      return 'bg-algo-compare glow-primary';
    case 'swapping':
      return 'bg-algo-swap glow-destructive';
    case 'sorted':
      return 'bg-algo-sorted';
    case 'pivot':
      return 'bg-algo-current glow-accent';
    default:
      return 'bg-primary';
  }
};

export const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ state }) => {
  const { elements } = state;
  const maxValue = Math.max(...elements.map(e => e.value), 1);
  const barWidth = Math.max(20, Math.min(60, 600 / elements.length));

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-end justify-center gap-1 p-4 min-h-[300px]">
        {elements.map((element, index) => {
          const heightPercent = (element.value / maxValue) * 100;
          
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-1"
              style={{ width: barWidth }}
            >
              <div
                className={`algo-bar ${getBarColor(element)} w-full transition-all duration-200`}
                style={{
                  height: `${Math.max(heightPercent, 5)}%`,
                  minHeight: '20px',
                }}
              />
              <span className="text-xs font-mono text-muted-foreground">
                {element.value}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 py-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-xs text-muted-foreground">Default</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-algo-compare" />
          <span className="text-xs text-muted-foreground">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-algo-swap" />
          <span className="text-xs text-muted-foreground">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-algo-sorted" />
          <span className="text-xs text-muted-foreground">Sorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-algo-current" />
          <span className="text-xs text-muted-foreground">Pivot</span>
        </div>
      </div>
    </div>
  );
};
