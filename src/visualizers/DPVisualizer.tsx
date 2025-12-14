import React from 'react';
import { DPVisualizationState, DPCell } from '../algorithms/types';

interface DPVisualizerProps {
  state: DPVisualizationState;
}

const getCellColor = (cell: DPCell): string => {
  switch (cell.state) {
    case 'current':
      return 'bg-algo-compare text-primary-foreground glow-primary';
    case 'computed':
      return 'bg-secondary text-secondary-foreground';
    case 'optimal':
      return 'bg-algo-sorted text-primary-foreground glow-success';
    default:
      return 'bg-cell text-foreground';
  }
};

export const DPVisualizer: React.FC<DPVisualizerProps> = ({ state }) => {
  const { table, sequence1, sequence2 } = state;
  const { cells, rowLabels, colLabels } = table;

  if (!cells || cells.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        No table data available
      </div>
    );
  }

  const maxCols = 12;
  const maxRows = 10;
  const showScrollHint = cells[0].length > maxCols || cells.length > maxRows;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <div className="inline-block min-w-full">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="w-24" />
                {colLabels?.slice(0, maxCols).map((label, i) => (
                  <th
                    key={i}
                    className="px-3 py-2 text-center text-sm font-mono text-muted-foreground border-b border-border"
                  >
                    {label}
                  </th>
                ))}
                {(colLabels?.length ?? 0) > maxCols && (
                  <th className="px-3 py-2 text-center text-sm font-mono text-muted-foreground">
                    ...
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {cells.slice(0, maxRows).map((row, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 text-right text-sm font-mono text-muted-foreground border-r border-border">
                    {rowLabels?.[i] ?? i}
                  </td>
                  {row.slice(0, maxCols).map((cell, j) => (
                    <td
                      key={j}
                      className={`px-3 py-2 text-center text-sm font-mono transition-all duration-200 ${getCellColor(cell)}`}
                      style={{ minWidth: '48px' }}
                    >
                      {cell.value}
                    </td>
                  ))}
                  {row.length > maxCols && (
                    <td className="px-3 py-2 text-center text-sm font-mono text-muted-foreground">
                      ...
                    </td>
                  )}
                </tr>
              ))}
              {cells.length > maxRows && (
                <tr>
                  <td className="px-3 py-2 text-center text-sm font-mono text-muted-foreground" colSpan={maxCols + 2}>
                    ... ({cells.length - maxRows} more rows)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showScrollHint && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Scroll to see full table
          </p>
        )}
      </div>

      {/* Sequences display */}
      {(sequence1 || sequence2) && (
        <div className="px-4 py-2 border-t border-border space-y-1">
          {sequence1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sequence 1:</span>
              <span className="font-mono text-sm">{sequence1}</span>
            </div>
          )}
          {sequence2 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sequence 2:</span>
              <span className="font-mono text-sm">{sequence2}</span>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-4 py-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-cell" />
          <span className="text-xs text-muted-foreground">Empty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-algo-compare" />
          <span className="text-xs text-muted-foreground">Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-secondary" />
          <span className="text-xs text-muted-foreground">Computed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-algo-sorted" />
          <span className="text-xs text-muted-foreground">Optimal</span>
        </div>
      </div>
    </div>
  );
};
