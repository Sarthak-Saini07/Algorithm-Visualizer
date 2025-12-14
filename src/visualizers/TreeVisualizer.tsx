import React from 'react';
import { TreeVisualizationState, TreeNode } from '../algorithms/types';

interface TreeVisualizerProps {
  state: TreeVisualizationState;
}

const getNodeColor = (node: TreeNode): string => {
  switch (node.state) {
    case 'current':
      return 'fill-algo-current stroke-algo-current';
    case 'active':
      return 'fill-algo-compare stroke-algo-compare';
    case 'visited':
      return 'fill-algo-visited stroke-algo-visited';
    case 'path':
      return 'fill-algo-sorted stroke-algo-sorted';
    default:
      return 'fill-node stroke-node';
  }
};

// Calculate tree layout
function layoutTree(root: TreeNode | null, width: number, height: number): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  if (!root) return positions;

  const levelHeight = height / (getTreeDepth(root) + 1);
  
  function getTreeDepth(node: TreeNode): number {
    if (node.children.length === 0) return 0;
    return 1 + Math.max(...node.children.map(getTreeDepth));
  }

  function layout(node: TreeNode, level: number, left: number, right: number) {
    const x = (left + right) / 2;
    const y = level * levelHeight + 40;
    positions.set(node.id, { x, y });

    const childWidth = (right - left) / (node.children.length || 1);
    node.children.forEach((child, i) => {
      layout(child, level + 1, left + i * childWidth, left + (i + 1) * childWidth);
    });
  }

  layout(root, 0, 0, width);
  return positions;
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ state }) => {
  const { root } = state;
  const svgWidth = 600;
  const svgHeight = 400;

  if (!root) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No tree data available
      </div>
    );
  }

  const positions = layoutTree(root, svgWidth, svgHeight);

  function renderNode(node: TreeNode): React.ReactNode {
    const pos = positions.get(node.id);
    if (!pos) return null;

    return (
      <g key={node.id}>
        {/* Edges to children */}
        {node.children.map(child => {
          const childPos = positions.get(child.id);
          if (!childPos) return null;
          return (
            <line
              key={`${node.id}-${child.id}`}
              x1={pos.x}
              y1={pos.y}
              x2={childPos.x}
              y2={childPos.y}
              className="stroke-edge"
              strokeWidth={2}
            />
          );
        })}

        {/* Node circle */}
        <circle
          cx={pos.x}
          cy={pos.y}
          r={20}
          className={`${getNodeColor(node)} transition-all duration-300`}
          strokeWidth={2}
        />
        
        {/* Node label */}
        <text
          x={pos.x}
          y={pos.y + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground font-mono text-sm"
        >
          {node.value}
        </text>

        {/* Render children */}
        {node.children.map(child => renderNode(child))}
      </g>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 min-h-[300px]">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full max-h-[400px]"
          style={{ maxWidth: '600px' }}
        >
          {renderNode(root)}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 py-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-node" />
          <span className="text-xs text-muted-foreground">Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-algo-current" />
          <span className="text-xs text-muted-foreground">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-algo-visited" />
          <span className="text-xs text-muted-foreground">Visited</span>
        </div>
      </div>
    </div>
  );
};
