import React, { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { AlgorithmSelect } from '../components/AlgorithmSelect';
import { InputPanel } from '../components/InputPanel';
import { MetricsPanel } from '../components/MetricsPanel';
import { ComparisonPanel } from '../components/ComparisonPanel';
import { VisualizerWrapper } from '../visualizers/VisualizerWrapper';
import { PlayPause } from '../components/Controls/PlayPause';
import { StepButtons } from '../components/Controls/StepButtons';
import { SpeedSlider } from '../components/Controls/SpeedSlider';
import { ResetButton } from '../components/Controls/ResetButton';
import { useRunner } from '../state/useRunner';
import { useComparison } from '../state/useComparison';
import { AlgorithmConfig } from '../algorithms/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, X, Play, BarChart3 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const Index: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmConfig | null>(null);
  const [customInput, setCustomInput] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('visualize');

  const {
    currentSnapshot,
    currentStep,
    totalSteps,
    isPlaying,
    isComplete,
    speed,
    play,
    pause,
    togglePlay,
    forward,
    backward,
    goTo,
    resetRunner,
    setSpeed,
    loadAlgorithm,
  } = useRunner();

  const {
    selectedAlgorithms,
    comparisonResults,
    profilerResults,
    addAlgorithm,
    removeAlgorithm,
    clearAlgorithms,
    runCompare,
    runProfile,
    exportJSON,
    exportCSV,
  } = useComparison();

  const handleAlgorithmSelect = useCallback((config: AlgorithmConfig) => {
    setSelectedAlgorithm(config);
    loadAlgorithm(config, customInput);
  }, [loadAlgorithm, customInput]);

  const handleInputChange = useCallback((input: any) => {
    setCustomInput(input);
    if (selectedAlgorithm) {
      loadAlgorithm(selectedAlgorithm, input);
    }
  }, [selectedAlgorithm, loadAlgorithm]);

  const handleAddToComparison = () => {
    if (selectedAlgorithm) {
      addAlgorithm(selectedAlgorithm);
    }
  };

  const handleRunComparison = () => {
    const input = customInput || selectedAlgorithm?.defaultInput();
    runCompare(input);
  };

  const handleRunProfiler = () => {
    runProfile([10, 25, 50, 75, 100]);
  };

  const handleExportJSON = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'algorithm-profiler-results.json';
    a.click();
  };

  const handleExportCSV = () => {
    const csv = exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'algorithm-profiler-results.csv';
    a.click();
  };

  const progressPercent = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-card">
              <TabsTrigger value="visualize" className="gap-2">
                <Play className="w-4 h-4" />
                Visualize
              </TabsTrigger>
              <TabsTrigger value="compare" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Compare & Profile
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-3">
              <AlgorithmSelect
                selectedId={selectedAlgorithm?.info.id || null}
                onSelect={handleAlgorithmSelect}
              />
              {activeTab === 'compare' && selectedAlgorithm && (
                <Button onClick={handleAddToComparison} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add to Comparison
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="visualize" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main visualization area */}
              <div className="lg:col-span-2 space-y-4">
                {/* Visualizer */}
                <div className="bg-card rounded-xl border border-border overflow-hidden min-h-[400px]">
                  <VisualizerWrapper state={currentSnapshot?.visualState || null} />
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <Progress value={progressPercent} className="h-2" />
                  <div 
                    className="h-1 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      goTo(Math.floor(percent * (totalSteps - 1)));
                    }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 p-4 bg-card rounded-lg border border-border">
                  <StepButtons
                    onStepForward={forward}
                    onStepBackward={backward}
                    onFirst={() => goTo(0)}
                    onLast={() => goTo(totalSteps - 1)}
                    canStepForward={currentStep < totalSteps - 1}
                    canStepBackward={currentStep > 0}
                  />
                  <PlayPause
                    isPlaying={isPlaying}
                    onToggle={togglePlay}
                    disabled={!selectedAlgorithm || isComplete}
                  />
                  <SpeedSlider speed={speed} onSpeedChange={setSpeed} />
                  <ResetButton onReset={resetRunner} />
                </div>

                {/* Timeline slider */}
                {totalSteps > 0 && (
                  <div className="flex items-center gap-4 px-4">
                    <span className="text-xs text-muted-foreground font-mono w-16">
                      Step {currentStep + 1}
                    </span>
                    <Slider
                      value={[currentStep]}
                      min={0}
                      max={Math.max(0, totalSteps - 1)}
                      step={1}
                      onValueChange={(v) => goTo(v[0])}
                      className="flex-1"
                    />
                    <span className="text-xs text-muted-foreground font-mono w-16 text-right">
                      of {totalSteps}
                    </span>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {selectedAlgorithm && (
                  <>
                    {/* Algorithm description */}
                    <div className="p-4 bg-card rounded-lg border border-border">
                      <h2 className="font-semibold mb-2">{selectedAlgorithm.info.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {selectedAlgorithm.info.description}
                      </p>
                    </div>

                    {/* Input panel */}
                    <InputPanel
                      category={selectedAlgorithm.info.category}
                      onInputChange={handleInputChange}
                    />
                  </>
                )}

                {/* Metrics */}
                <MetricsPanel
                  metrics={currentSnapshot?.metrics || null}
                  algorithmInfo={selectedAlgorithm?.info || null}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  message={currentSnapshot?.message || ''}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Selected algorithms for comparison */}
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-semibold mb-3">Selected Algorithms</h3>
                  {selectedAlgorithms.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Add algorithms using the dropdown above
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedAlgorithms.map((algo) => (
                        <div
                          key={algo.info.id}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <span className="text-sm">{algo.info.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
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
                  <div className="space-y-2">
                    <Button onClick={handleRunComparison} className="w-full gap-2">
                      <Play className="w-4 h-4" />
                      Run Comparison
                    </Button>
                    <Button onClick={handleRunProfiler} variant="secondary" className="w-full gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Run Profiler
                    </Button>
                    <Button onClick={clearAlgorithms} variant="outline" className="w-full">
                      Clear All
                    </Button>
                  </div>
                )}

                {selectedAlgorithm && (
                  <InputPanel
                    category={selectedAlgorithm.info.category}
                    onInputChange={handleInputChange}
                  />
                )}
              </div>

              {/* Comparison results */}
              <div className="lg:col-span-2">
                <ComparisonPanel
                  results={comparisonResults}
                  profilerResults={profilerResults}
                  onExportJSON={handleExportJSON}
                  onExportCSV={handleExportCSV}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Algorithm Visualizer — Built for learning and interview preparation</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
