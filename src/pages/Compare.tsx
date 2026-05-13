import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Play, Plus, BarChart3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComparisonPanel } from '../components/ComparisonPanel';
import { AlgorithmSelect } from '../components/AlgorithmSelect';
import { InputPanel } from '../components/InputPanel';

export const Compare = () => {
  const {
    selectedAlgorithm,
    handleAlgorithmSelect,
    handleInputChange,
    comparison,
    handleAddToComparison,
    handleRunComparison,
    handleRunProfiler
  }: any = useOutletContext();

  const {
    selectedAlgorithms,
    comparisonResults,
    profilerResults,
    removeAlgorithm,
    clearAlgorithms,
    exportJSON,
    exportCSV,
  } = comparison;

  return (
    <div className="flex flex-col flex-1 h-full max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          Compare & Profile
        </h1>
        <div className="flex items-center gap-3">
          <AlgorithmSelect
            selectedId={selectedAlgorithm?.info.id || null}
            onSelect={handleAlgorithmSelect}
          />
          {selectedAlgorithm && (
            <Button onClick={handleAddToComparison} size="sm" className="gap-2 glow-primary bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Add to Comparison
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Selected algorithms for comparison */}
        <div className="space-y-4 overflow-y-auto pr-2 w-full">
          <div className="p-5 glass rounded-xl border border-border/50 shadow-sm bg-card/50 shrink-0">
            <h3 className="font-bold tracking-tight mb-4 flex items-center gap-2 text-foreground">
              <BarChart3 className="w-4 h-4 text-primary" />
              Selected Algorithms
            </h3>
            {selectedAlgorithms.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/50 text-center font-mono">
                Add algorithms using the dropdown above
              </p>
            ) : (
              <div className="space-y-2">
                {selectedAlgorithms.map((algo: any) => (
                  <div
                    key={algo.info.id}
                    className="flex items-center justify-between p-3 bg-background/50 hover:bg-background/80 transition-colors border border-border/50 rounded-lg group"
                  >
                    <span className="text-sm font-medium text-foreground">{algo.info.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-50 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeAlgorithm(algo.info.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedAlgorithms.length >= 2 && (
            <div className="space-y-3 glass p-4 rounded-xl border border-border/50 bg-card/50 shrink-0 shadow-sm">
              <Button onClick={handleRunComparison} className="w-full gap-2 glow-primary transition-all bg-primary hover:bg-primary/90 text-primary-foreground">
                <Play className="w-4 h-4" />
                Run Comparison
              </Button>
              <Button onClick={handleRunProfiler} variant="secondary" className="w-full gap-2 glow-accent transition-all">
                <BarChart3 className="w-4 h-4" />
                Run Profiler
              </Button>
              <Button onClick={clearAlgorithms} variant="outline" className="w-full border-border/50 hover:bg-destructive/10 hover:text-destructive transition-all">
                Clear All
              </Button>
            </div>
          )}

          {selectedAlgorithm && (
            <div className="shrink-0">
              <InputPanel
                category={selectedAlgorithm.info.category}
                onInputChange={handleInputChange}
              />
            </div>
          )}
        </div>

        {/* Comparison results */}
        <div className="xl:col-span-2 glass rounded-xl border border-border/50 p-1 bg-card/50 h-full overflow-hidden shadow-sm">
          <ComparisonPanel
            results={comparisonResults}
            profilerResults={profilerResults}
            onExportJSON={() => {
              const json = exportJSON();
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'algorithm-profiler-results.json';
              a.click();
            }}
            onExportCSV={() => {
              const csv = exportCSV();
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'algorithm-profiler-results.csv';
              a.click();
            }}
          />
        </div>
      </div>
    </div>
  );
};
