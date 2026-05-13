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
import { Outlet } from 'react-router-dom';
import { useRunner } from '../state/useRunner';
import { useComparison } from '../state/useComparison';
import { AlgorithmConfig } from '../algorithms/types';

const Dashboard: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmConfig | null>(null);
  const [customInput, setCustomInput] = useState<any>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const runner = useRunner();
  const comparison = useComparison();

  const handleAlgorithmSelect = useCallback((config: AlgorithmConfig) => {
    setSelectedAlgorithm(config);
    runner.loadAlgorithm(config, customInput);
  }, [runner.loadAlgorithm, customInput]);

  const handleInputChange = useCallback((input: any) => {
    setCustomInput(input);
    if (selectedAlgorithm) {
      runner.loadAlgorithm(selectedAlgorithm, input);
    }
  }, [selectedAlgorithm, runner.loadAlgorithm]);

  const handleAddToComparison = () => {
    if (selectedAlgorithm) {
      comparison.addAlgorithm(selectedAlgorithm);
    }
  };

  const handleRunComparison = () => {
    const input = customInput || selectedAlgorithm?.defaultInput();
    comparison.runCompare(input);
  };

  const handleRunProfiler = () => {
    comparison.runProfile([10, 25, 50, 75, 100]);
  };

  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden selection:bg-primary/30 relative">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      <div className={cn(
        "flex-1 flex flex-col h-screen transition-all duration-300 relative overflow-hidden",
        sidebarCollapsed ? "ml-20" : "ml-64"
      )}>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="flex-1 flex overflow-hidden relative z-10 w-full">
          {/* Main Content Column */}
          <main className="flex-1 overflow-hidden flex flex-col h-full min-w-0">
            <Header />
            
            <div className="container py-6 flex-1 flex flex-col min-h-0">
              <Outlet context={{
                selectedAlgorithm,
                handleAlgorithmSelect,
                handleInputChange,
                runner,
                comparison,
                handleAddToComparison,
                handleRunComparison,
                handleRunProfiler
              }} />
            </div>
          </main>
          
          {/* AI Copilot Panel */}
          <AIPanel 
            snapshot={runner.currentSnapshot}
            algorithmInfo={selectedAlgorithm?.info || null}
            currentStep={runner.currentStep}
            totalSteps={runner.totalSteps}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
