import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Play, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { VisualizerWrapper } from '../visualizers/VisualizerWrapper';
import { PlayPause } from '../components/Controls/PlayPause';
import { StepButtons } from '../components/Controls/StepButtons';
import { SpeedSlider } from '../components/Controls/SpeedSlider';
import { ResetButton } from '../components/Controls/ResetButton';
import { InputPanel } from '../components/InputPanel';
import { AlgorithmSelect } from '../components/AlgorithmSelect';

export const Workspace = () => {
  const {
    selectedAlgorithm,
    handleAlgorithmSelect,
    handleInputChange,
    runner
  }: any = useOutletContext();

  const {
    currentSnapshot,
    currentStep,
    totalSteps,
    isPlaying,
    isComplete,
    speed,
    togglePlay,
    forward,
    backward,
    goTo,
    resetRunner,
    setSpeed
  } = runner;

  const progressPercent = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  return (
    <div className="flex flex-col flex-1 h-full max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight">Workspace</h1>
        <AlgorithmSelect
          selectedId={selectedAlgorithm?.info.id || null}
          onSelect={handleAlgorithmSelect}
        />
      </div>

      {!selectedAlgorithm ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5">
          <Play className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-xl font-medium mb-2">Select an algorithm to begin</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Choose an algorithm from the dropdown above to start exploring its execution step-by-step.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Main visualization area */}
          <div className="xl:col-span-2 flex flex-col gap-4 min-h-0 w-full">
            {/* Visualizer */}
            <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden shadow-sm relative group flex-1 min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
              <VisualizerWrapper state={currentSnapshot?.visualState || null} />
            </div>

            {/* Progress bar */}
            <div className="space-y-2 shrink-0">
              <Progress value={progressPercent} className="h-2 bg-secondary" />
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
            <div className="flex flex-wrap items-center justify-center gap-4 p-4 glass rounded-xl border border-border/50 shadow-sm bg-card/80 shrink-0">
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
              <div className="flex items-center gap-4 px-4 p-3 glass rounded-lg border border-border/50 bg-card/50 shrink-0">
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
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 w-full">
            {/* Algorithm description */}
            <div className="p-5 glass rounded-xl border border-border/50 relative overflow-hidden group bg-card/50 shrink-0 shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h2 className="font-bold text-lg mb-2 text-foreground tracking-tight">{selectedAlgorithm.info.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedAlgorithm.info.description}
              </p>
            </div>

            {/* Input panel */}
            <div className="shrink-0">
              <InputPanel
                category={selectedAlgorithm.info.category}
                onInputChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
