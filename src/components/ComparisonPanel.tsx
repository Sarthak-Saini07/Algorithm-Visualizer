import React from 'react';
import { ComparisonResult } from '../core/comparison';
import { ProfilerResult } from '../core/profiler';
import { Trophy, Download, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ComparisonPanelProps {
  results: ComparisonResult[];
  profilerResults: ProfilerResult[];
  onExportJSON: () => void;
  onExportCSV: () => void;
}

const COLORS = ['hsl(190, 100%, 50%)', 'hsl(320, 100%, 60%)', 'hsl(150, 100%, 45%)', 'hsl(45, 100%, 50%)'];

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  results,
  profilerResults,
  onExportJSON,
  onExportCSV,
}) => {
  if (results.length === 0 && profilerResults.length === 0) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border text-center">
        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          Select multiple algorithms to compare their performance
        </p>
      </div>
    );
  }

  // Sort by operations (ascending = better)
  const sortedResults = [...results].sort((a, b) => a.operations - b.operations);

  // Prepare chart data
  const chartData = profilerResults.length > 0
    ? profilerResults[0].dataPoints.map((_, i) => {
        const point: any = { inputSize: profilerResults[0].dataPoints[i].inputSize };
        profilerResults.forEach((result) => {
          point[result.algorithmName] = result.dataPoints[i]?.operations ?? 0;
        });
        return point;
      })
    : [];

  return (
    <div className="space-y-4">
      {/* Results table */}
      {results.length > 0 && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="w-4 h-4 text-warning" />
              Comparison Results
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-2 text-left font-medium">Rank</th>
                  <th className="px-4 py-2 text-left font-medium">Algorithm</th>
                  <th className="px-4 py-2 text-right font-medium">Steps</th>
                  <th className="px-4 py-2 text-right font-medium">Comparisons</th>
                  <th className="px-4 py-2 text-right font-medium">Swaps</th>
                  <th className="px-4 py-2 text-right font-medium">Operations</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, index) => (
                  <tr key={result.algorithmId} className="border-t border-border">
                    <td className="px-4 py-2">
                      {index === 0 ? (
                        <span className="text-warning font-bold">🥇</span>
                      ) : index === 1 ? (
                        <span className="text-muted-foreground font-bold">🥈</span>
                      ) : index === 2 ? (
                        <span className="text-destructive font-bold">🥉</span>
                      ) : (
                        <span className="text-muted-foreground">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium">{result.algorithmName}</td>
                    <td className="px-4 py-2 text-right font-mono">{result.totalSteps}</td>
                    <td className="px-4 py-2 text-right font-mono">{result.comparisons}</td>
                    <td className="px-4 py-2 text-right font-mono">{result.swaps}</td>
                    <td className="px-4 py-2 text-right font-mono font-bold">{result.operations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Profiler chart */}
      {chartData.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-semibold mb-4">Operations vs Input Size</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="inputSize" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                {profilerResults.map((result, i) => (
                  <Line
                    key={result.algorithmId}
                    type="monotone"
                    dataKey={result.algorithmName}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Export buttons */}
      {profilerResults.length > 0 && (
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExportJSON} className="gap-2">
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={onExportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      )}
    </div>
  );
};
