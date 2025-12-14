import React from 'react';
import { AlgorithmMetrics, AlgorithmInfo } from '../algorithms/types';
import { Clock, GitCompare, ArrowUpDown, Activity, Info } from 'lucide-react';

interface MetricsPanelProps {
  metrics: AlgorithmMetrics | null;
  algorithmInfo: AlgorithmInfo | null;
  currentStep: number;
  totalSteps: number;
  message: string;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  algorithmInfo,
  currentStep,
  totalSteps,
  message,
}) => {
  return (
    <div className="space-y-4">
      {/* Current message */}
      <div className="p-4 bg-card rounded-lg border border-border">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Step {currentStep + 1} of {totalSteps}</p>
            <p className="text-sm text-muted-foreground mt-1">{message || 'Ready to start'}</p>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      {metrics && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-card rounded-lg border border-border text-center">
            <GitCompare className="w-4 h-4 text-algo-compare mx-auto mb-1" />
            <p className="text-2xl font-bold font-mono">{metrics.comparisons}</p>
            <p className="text-xs text-muted-foreground">Comparisons</p>
          </div>
          <div className="p-3 bg-card rounded-lg border border-border text-center">
            <ArrowUpDown className="w-4 h-4 text-algo-swap mx-auto mb-1" />
            <p className="text-2xl font-bold font-mono">{metrics.swaps}</p>
            <p className="text-xs text-muted-foreground">Swaps</p>
          </div>
          <div className="p-3 bg-card rounded-lg border border-border text-center">
            <Activity className="w-4 h-4 text-algo-current mx-auto mb-1" />
            <p className="text-2xl font-bold font-mono">{metrics.operations}</p>
            <p className="text-xs text-muted-foreground">Operations</p>
          </div>
        </div>
      )}

      {/* Algorithm info */}
      {algorithmInfo && (
        <div className="p-4 bg-card rounded-lg border border-border space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Complexity Analysis
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Best:</span>
              <span className="ml-2 font-mono text-success">{algorithmInfo.timeComplexity.best}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Average:</span>
              <span className="ml-2 font-mono text-primary">{algorithmInfo.timeComplexity.average}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Worst:</span>
              <span className="ml-2 font-mono text-destructive">{algorithmInfo.timeComplexity.worst}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Space:</span>
              <span className="ml-2 font-mono">{algorithmInfo.spaceComplexity}</span>
            </div>
          </div>
          {(algorithmInfo.stable !== undefined || algorithmInfo.inPlace !== undefined) && (
            <div className="flex gap-4 pt-2 border-t border-border">
              {algorithmInfo.stable !== undefined && (
                <span className={`text-xs px-2 py-1 rounded ${algorithmInfo.stable ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {algorithmInfo.stable ? 'Stable' : 'Not Stable'}
                </span>
              )}
              {algorithmInfo.inPlace !== undefined && (
                <span className={`text-xs px-2 py-1 rounded ${algorithmInfo.inPlace ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {algorithmInfo.inPlace ? 'In-Place' : 'Uses Extra Space'}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
