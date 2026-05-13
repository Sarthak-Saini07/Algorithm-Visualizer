import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Lightbulb, Code2, Sparkles, AlertCircle, RefreshCw, Layers, Zap, Activity, GitCompare, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AlgorithmSnapshot, AlgorithmInfo } from '../algorithms/types';

interface AIPanelProps {
  snapshot: AlgorithmSnapshot | null;
  algorithmInfo: AlgorithmInfo | null;
  currentStep: number;
  totalSteps: number;
}

const generateExplanation = (snapshot: AlgorithmSnapshot | null, algoName: string) => {
  if (!snapshot) return null;

  // Layer 1: Procedural Generation from engine snapshot
  const { message, visualState, metrics } = snapshot;
  
  let detailedContext = message;
  let actionType = 'Observation';
  let badgeColor = 'text-primary';

  if (message.toLowerCase().includes('compar')) {
    actionType = 'Comparing';
    badgeColor = 'text-warning';
  } else if (message.toLowerCase().includes('swap')) {
    actionType = 'Swapping';
    badgeColor = 'text-destructive';
  } else if (message.toLowerCase().includes('sort')) {
    actionType = 'Sorted';
    badgeColor = 'text-success';
  } else if (message.toLowerCase().includes('pivot')) {
    actionType = 'Pivot Selection';
    badgeColor = 'text-accent';
  } else if (message.toLowerCase().includes('merg')) {
    actionType = 'Merging';
    badgeColor = 'text-primary';
  }

  // Derive active values if array
  let activeValues: number[] = [];
  if (visualState.type === 'array') {
    activeValues = visualState.elements
      .filter(el => el.state === 'comparing' || el.state === 'swapping' || el.state === 'pivot')
      .map(el => el.value);
  }

  return {
    actionType,
    badgeColor,
    message: detailedContext,
    activeValues,
    phase: metrics.currentPhase || 'Executing'
  };
};

const AIPanelContent: React.FC<AIPanelProps> = ({ snapshot, algorithmInfo, currentStep, totalSteps }) => {
  const explanation = useMemo(() => generateExplanation(snapshot, algorithmInfo?.name || ''), [snapshot, algorithmInfo]);

  if (!algorithmInfo || !snapshot) {
    return (
      <>
        <div className="h-16 flex items-center px-5 border-b border-border/50 gap-2 text-primary shrink-0">
          <BrainCircuit className="w-5 h-5" />
          <span className="font-semibold tracking-tight text-foreground">AI Copilot</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-50">
          <BrainCircuit className="w-12 h-12 mb-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground mb-2">Awaiting Execution</h3>
          <p className="text-sm text-muted-foreground">Select an algorithm and begin execution to see real-time analysis.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="h-16 flex items-center px-5 border-b border-border/50 gap-2 text-primary shrink-0 bg-background/50 backdrop-blur-md">
        <BrainCircuit className="w-5 h-5" />
        <span className="font-semibold tracking-tight text-foreground">AI Copilot</span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground bg-secondary/20 px-2 py-1 rounded-md">
            Step {currentStep + 1}/{Math.max(1, totalSteps)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentStep} // Forces animation on step change
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="p-5 rounded-xl glass bg-card/50 border-border/50 space-y-4 relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Current Operation</span>
              </div>
              {explanation?.actionType && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-background/50 border border-border/50 ${explanation.badgeColor}`}>
                  {explanation.actionType}
                </span>
              )}
            </div>

            <p className="text-sm text-foreground leading-relaxed">
              {explanation?.message}
            </p>

            {explanation?.activeValues && explanation.activeValues.length > 0 && (
              <div className="flex gap-2 pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground my-auto">Active Values:</span>
                {explanation.activeValues.map((val, idx) => (
                  <span key={idx} className="text-xs font-mono bg-background px-2 py-1 rounded border border-border/50">
                    {val}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium px-1">
            <Activity className="w-4 h-4 text-primary" />
            <span>Execution Metrics</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-card/50 rounded-lg border border-border/50 text-center shadow-sm">
              <GitCompare className="w-4 h-4 text-algo-compare mx-auto mb-1" />
              <p className="text-xl font-bold font-mono text-foreground">{snapshot.metrics.comparisons}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Comparisons</p>
            </div>
            <div className="p-3 bg-card/50 rounded-lg border border-border/50 text-center shadow-sm">
              <ArrowUpDown className="w-4 h-4 text-algo-swap mx-auto mb-1" />
              <p className="text-xl font-bold font-mono text-foreground">{snapshot.metrics.swaps}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Swaps</p>
            </div>
            <div className="p-3 bg-card/50 rounded-lg border border-border/50 text-center shadow-sm">
              <Activity className="w-4 h-4 text-algo-current mx-auto mb-1" />
              <p className="text-xl font-bold font-mono text-foreground">{snapshot.metrics.operations}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Operations</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-foreground font-medium px-1">
            <Lightbulb className="w-4 h-4 text-warning" />
            <span>Algorithm Profile</span>
          </div>
          <div className="p-4 rounded-xl border border-border/50 bg-card/50 shadow-sm space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time (Worst)</span>
                <span className="font-mono text-warning">{algorithmInfo.timeComplexity.worst}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time (Best)</span>
                <span className="font-mono text-success">{algorithmInfo.timeComplexity.best}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Space</span>
                <span className="font-mono text-success">{algorithmInfo.spaceComplexity}</span>
              </div>
            </div>
            
            {(algorithmInfo.stable !== undefined || algorithmInfo.inPlace !== undefined) && (
              <div className="flex gap-2 pt-3 border-t border-border/50">
                {algorithmInfo.stable !== undefined && (
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border ${algorithmInfo.stable ? 'bg-success/10 text-success border-success/20' : 'bg-muted text-muted-foreground border-border/50'}`}>
                    {algorithmInfo.stable ? 'Stable' : 'Not Stable'}
                  </span>
                )}
                {algorithmInfo.inPlace !== undefined && (
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded border ${algorithmInfo.inPlace ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border/50'}`}>
                    {algorithmInfo.inPlace ? 'In-Place' : 'Extra Space'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {snapshot.code && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground font-medium px-1">
              <Code2 className="w-4 h-4 text-accent" />
              <span>Execution Line</span>
            </div>
            <div className="p-4 rounded-xl border border-border/50 bg-card/50 overflow-x-auto shadow-sm">
              <pre className="text-xs font-mono leading-loose text-muted-foreground">
                <code className="text-accent">Line {snapshot.code.line}:</code> {snapshot.code.highlight || 'Executing...'}
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-border/50 shrink-0 bg-background/50 backdrop-blur-md">
        <Button variant="outline" className="w-full gap-2 text-xs h-9 border-border/50 hover:bg-card">
          <Zap className="w-3 h-3 text-primary" /> Request Deep Insight
        </Button>
      </div>
    </>
  );
};

export const AIPanel: React.FC<AIPanelProps> = (props) => {
  return (
    <>
      {/* Desktop Panel */}
      <div className="w-80 xl:w-96 border-l border-border/50 bg-card/50 backdrop-blur-xl h-screen sticky top-0 flex-col hidden lg:flex shrink-0">
        <AIPanelContent {...props} />
      </div>

      {/* Mobile Floating Button & Sheet */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground glow-primary border-none">
              <BrainCircuit className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 border-l border-border/50 bg-card/95 backdrop-blur-xl flex flex-col">
            <AIPanelContent {...props} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
