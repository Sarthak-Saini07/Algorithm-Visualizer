import React from 'react';
import { GraphVisualizationState, GraphNode, GraphEdge } from '../algorithms/types';

interface GraphVisualizerProps {
  state: GraphVisualizationState;
}

const getNodeColor = (node: GraphNode): string => {
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

const getEdgeColor = (edge: GraphEdge): string => {
  switch (edge.state) {
    case 'active':
      return 'stroke-algo-current';
    case 'visited':
      return 'stroke-algo-visited';
    case 'path':
      return 'stroke-algo-sorted';
    default:
      return 'stroke-edge';
  }
};

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ state }) => {
  const { graph, distances } = state;
  const { nodes, edges, directed } = graph;

  // Calculate SVG bounds
  const padding = 50;
  const minX = Math.min(...nodes.map(n => n.x)) - padding;
  const minY = Math.min(...nodes.map(n => n.y)) - padding;
  const maxX = Math.max(...nodes.map(n => n.x)) + padding;
  const maxY = Math.max(...nodes.map(n => n.y)) + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 min-h-[300px]">
        <svg
          viewBox={`${minX} ${minY} ${width} ${height}`}
          className="w-full h-full max-h-[400px]"
          style={{ maxWidth: '600px' }}
        >
          {/* Edges */}
          {edges.map((edge, index) => {
            const from = getNode(edge.from);
            const to = getNode(edge.to);
            if (!from || !to) return null;

            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const angle = Math.atan2(dy, dx);
            const nodeRadius = 20;
            
            const startX = from.x + nodeRadius * Math.cos(angle);
            const startY = from.y + nodeRadius * Math.sin(angle);
            const endX = to.x - nodeRadius * Math.cos(angle);
            const endY = to.y - nodeRadius * Math.sin(angle);

            // Midpoint for weight label
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;

            return (
              <g key={`edge-${index}`}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  className={`${getEdgeColor(edge)} transition-all duration-300`}
                  strokeWidth={edge.state === 'default' ? 2 : 3}
                  markerEnd={directed ? 'url(#arrowhead)' : undefined}
                />
                {edge.weight !== undefined && (
                  <g>
                    <rect
                      x={midX - 12}
                      y={midY - 10}
                      width={24}
                      height={20}
                      className="fill-card"
                      rx={4}
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      className="fill-foreground text-xs font-mono"
                    >
                      {edge.weight}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Arrow marker for directed graphs */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                className="fill-edge"
              />
            </marker>
          </defs>

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id} className="transition-all duration-300">
              <circle
                cx={node.x}
                cy={node.y}
                r={20}
                className={`${getNodeColor(node)} transition-all duration-300`}
                strokeWidth={2}
              />
              <text
                x={node.x}
                y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground font-bold text-sm"
              >
                {node.id}
              </text>
              {node.distance !== undefined && node.distance !== Infinity && (
                <text
                  x={node.x}
                  y={node.y + 35}
                  textAnchor="middle"
                  className="fill-muted-foreground text-xs font-mono"
                >
                  d={node.distance}
                </text>
              )}
            </g>
          ))}
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
          <div className="w-3 h-3 rounded-full bg-algo-compare" />
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-algo-visited" />
          <span className="text-xs text-muted-foreground">Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-algo-sorted" />
          <span className="text-xs text-muted-foreground">Path</span>
        </div>
      </div>
    </div>
  );
};
