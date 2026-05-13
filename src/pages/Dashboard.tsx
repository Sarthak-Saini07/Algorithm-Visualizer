import React, { useState, useCallback } from 'react';
import { Header } from '../components/Header';
import { AlgorithmSelect } from '../components/AlgorithmSelect';
import { InputPanel } from '../components/InputPanel';
import { MetricsPanel } from '../components/MetricsPanel';
import { ComparisonPanel } from '../components/ComparisonPanel';
import { VisualizerWrapper } from '../visualizers/VisualizerWrapper';
import { Sidebar } from '../components/Sidebar';
import { AIPanel } from '../components/AIPanel';
import { cn } from '@/lib/utils';
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

const Dashboard: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmConfig | null>(null);
  const [customInput, setCustomInput] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('visualize');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="min-h-screen bg-[#030712] text-foreground flex overflow-hidden selection:bg-primary/30">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 relative",
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex-1 flex overflow-hidden relative z-10">
          {/* Main Content Column */}
          <main className="flex-1 overflow-y-auto flex flex-col">
            <Header />
            
            <div className="container py-6 flex-1 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <TabsList className="bg-white/5 backdrop-blur-md border border-white/10">
                    <TabsTrigger value="visualize" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Play className="w-4 h-4" />
                      Visualize
                    </TabsTrigger>
                    <TabsTrigger value="compare" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
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
                      <Button onClick={handleAddToComparison} size="sm" className="gap-2 glow-primary bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="w-4 h-4" />
                        Add to Comparison
                      </Button>
                    )}
                  </div>
                </div>

                <TabsContent value="visualize" className="space-y-6 flex-1">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Main visualization area */}
                    <div className="xl:col-span-2 space-y-4">
                      {/* Visualizer */}
                      <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden min-h-[500px] shadow-2xl relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                        <VisualizerWrapper state={currentSnapshot?.visualState || null} />
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2">
                        <Progress value={progressPercent} className="h-2 bg-white/5" />
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
                      <div className="flex items-center justify-center gap-4 p-4 glass rounded-xl border border-white/10 shadow-2xl bg-black/60">
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
                        <div className="flex items-center gap-4 px-4 p-3 glass rounded-lg border border-white/10 bg-black/40">
                          <span className="text-xs text-primary font-mono w-16 glow-primary font-semibold">
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

                    {/* Left Inner Sidebar (Description & Inputs) */}
                    <div className="space-y-4">
                      {selectedAlgorithm && (
                        <>
                          {/* Algorithm description */}
                          <div className="p-5 glass rounded-xl border border-white/10 relative overflow-hidden group bg-black/40">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h2 className="font-bold text-lg mb-2 text-foreground tracking-tight">{selectedAlgorithm.info.name}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {selectedAlgorithm.info.description}
                            </p>
                          </div>

                          {/* Input panel */}
                          <div className="glass rounded-xl border border-white/10 p-1 bg-black/40">
                            <InputPanel
                              category={selectedAlgorithm.info.category}
                              onInputChange={handleInputChange}
                            />
                          </div>
                        </>
                      )}

                      {/* Metrics */}
                      <div className="glass rounded-xl border border-white/10 p-1 bg-black/40">
                        <MetricsPanel
                          metrics={currentSnapshot?.metrics || null}
                          algorithmInfo={selectedAlgorithm?.info || null}
                          currentStep={currentStep}
                          totalSteps={totalSteps}
                          message={currentSnapshot?.message || ''}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="compare" className="space-y-6">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Selected algorithms for comparison */}
                    <div className="space-y-4">
                      <div className="p-5 glass rounded-xl border border-white/10 shadow-lg bg-black/40">
                        <h3 className="font-bold tracking-tight mb-4 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-primary" />
                          Selected Algorithms
                        </h3>
                        {selectedAlgorithms.length === 0 ? (
                          <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/10 text-center font-mono">
                            Add algorithms using the dropdown above
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {selectedAlgorithms.map((algo) => (
                              <div
                                key={algo.info.id}
                                className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-lg group"
                              >
                                <span className="text-sm font-medium">{algo.info.name}</span>
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
                        <div className="space-y-3 glass p-4 rounded-xl border border-white/10 bg-black/40">
                          <Button onClick={handleRunComparison} className="w-full gap-2 glow-primary transition-all bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Play className="w-4 h-4" />
                            Run Comparison
                          </Button>
                          <Button onClick={handleRunProfiler} variant="secondary" className="w-full gap-2 glow-accent transition-all">
                            <BarChart3 className="w-4 h-4" />
                            Run Profiler
                          </Button>
                          <Button onClick={clearAlgorithms} variant="outline" className="w-full border-white/10 hover:bg-destructive/10 hover:text-destructive transition-all">
                            Clear All
                          </Button>
                        </div>
                      )}

                      {selectedAlgorithm && (
                        <div className="glass rounded-xl border border-white/10 p-1 bg-black/40">
                          <InputPanel
                            category={selectedAlgorithm.info.category}
                            onInputChange={handleInputChange}
                          />
                        </div>
                      )}
                    </div>

                    {/* Comparison results */}
                    <div className="xl:col-span-2 glass rounded-xl border border-white/10 p-1 bg-black/40">
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
            </div>
          </main>
          
          {/* AI Copilot Panel */}
          <AIPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
