import React from 'react';
import { VisualizationState } from '../algorithms/types';
import { ArrayVisualizer } from './ArrayVisualizer';
import { GraphVisualizer } from './GraphVisualizer';
import { DPVisualizer } from './DPVisualizer';
import { TreeVisualizer } from './TreeVisualizer';

interface VisualizerWrapperProps {
  state: VisualizationState | null;
}

export const VisualizerWrapper: React.FC<VisualizerWrapperProps> = ({ state }) => {
  // if (!state) {
  //   return (
  //     <div className="w-full h-full flex items-center justify-center text-muted-foreground">
  //       <div className="text-center">
  //         <p className="text-lg">Select an algorithm to begin</p>
  //         <p className="text-sm mt-2">Choose from sorting, graph, or dynamic programming algorithms</p>
  //       </div>
  //     </div>
  //   );
  // }
  if (!state) {
  return (
    <div className="w-full min-h-[400px] flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <p className="text-lg font-medium">
          Select an algorithm to begin
        </p>
        <p className="text-sm mt-2">
          Choose from sorting, graph, or dynamic programming algorithms
        </p>
      </div>
    </div>
  );
}


  switch (state.type) {
    case 'array':
      return <ArrayVisualizer state={state} />;
    case 'graph':
      return <GraphVisualizer state={state} />;
    case 'dp':
      return <DPVisualizer state={state} />;
    case 'tree':
      return <TreeVisualizer state={state} />;
    default:
      return (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          Unknown visualization type
        </div>
      );
  }
};
