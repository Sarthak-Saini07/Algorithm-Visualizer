import { useState, useCallback } from 'react';
import { AlgorithmConfig } from '../algorithms/types';
import { ComparisonResult, runComparison } from '../core/comparison';
import { ProfilerResult, profileMultipleAlgorithms, exportResultsAsJSON, exportResultsAsCSV } from '../core/profiler';

interface UseComparisonReturn {
  selectedAlgorithms: AlgorithmConfig[];
  comparisonResults: ComparisonResult[];
  profilerResults: ProfilerResult[];
  isComparing: boolean;
  isProfiling: boolean;
  addAlgorithm: (config: AlgorithmConfig) => void;
  removeAlgorithm: (id: string) => void;
  clearAlgorithms: () => void;
  runCompare: (input: any) => void;
  runProfile: (inputSizes?: number[]) => void;
  exportJSON: () => string;
  exportCSV: () => string;
}

export function useComparison(): UseComparisonReturn {
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<AlgorithmConfig[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);
  const [profilerResults, setProfilerResults] = useState<ProfilerResult[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [isProfiling, setIsProfiling] = useState(false);

  const addAlgorithm = useCallback((config: AlgorithmConfig) => {
    setSelectedAlgorithms(prev => {
      if (prev.find(a => a.info.id === config.info.id)) return prev;
      return [...prev, config];
    });
  }, []);

  const removeAlgorithm = useCallback((id: string) => {
    setSelectedAlgorithms(prev => prev.filter(a => a.info.id !== id));
  }, []);

  const clearAlgorithms = useCallback(() => {
    setSelectedAlgorithms([]);
    setComparisonResults([]);
    setProfilerResults([]);
  }, []);

  const runCompare = useCallback((input: any) => {
    if (selectedAlgorithms.length < 2) return;
    
    setIsComparing(true);
    try {
      const results = runComparison(selectedAlgorithms, input);
      setComparisonResults(results);
    } finally {
      setIsComparing(false);
    }
  }, [selectedAlgorithms]);

  const runProfile = useCallback((inputSizes?: number[]) => {
    if (selectedAlgorithms.length === 0) return;
    
    setIsProfiling(true);
    try {
      const results = profileMultipleAlgorithms(selectedAlgorithms, inputSizes);
      setProfilerResults(results);
    } finally {
      setIsProfiling(false);
    }
  }, [selectedAlgorithms]);

  const exportJSON = useCallback(() => {
    return exportResultsAsJSON(profilerResults);
  }, [profilerResults]);

  const exportCSV = useCallback(() => {
    return exportResultsAsCSV(profilerResults);
  }, [profilerResults]);

  return {
    selectedAlgorithms,
    comparisonResults,
    profilerResults,
    isComparing,
    isProfiling,
    addAlgorithm,
    removeAlgorithm,
    clearAlgorithms,
    runCompare,
    runProfile,
    exportJSON,
    exportCSV,
  };
}
