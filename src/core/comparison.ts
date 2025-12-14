import { AlgorithmConfig } from '../algorithms/types';
import { createRunner, Runner, getCurrentSnapshot } from './runner';

export interface ComparisonResult {
  algorithmId: string;
  algorithmName: string;
  totalSteps: number;
  comparisons: number;
  swaps: number;
  operations: number;
  executionTime: number;
}

export function runComparison(
  algorithms: AlgorithmConfig[],
  input: any
): ComparisonResult[] {
  return algorithms.map(algo => {
    const startTime = performance.now();
    const runner = createRunner(algo, input);
    const endTime = performance.now();
    
    const finalSnapshot = runner.snapshots[runner.snapshots.length - 1];
    
    return {
      algorithmId: algo.info.id,
      algorithmName: algo.info.name,
      totalSteps: runner.snapshots.length,
      comparisons: finalSnapshot?.metrics.comparisons ?? 0,
      swaps: finalSnapshot?.metrics.swaps ?? 0,
      operations: finalSnapshot?.metrics.operations ?? 0,
      executionTime: endTime - startTime,
    };
  });
}

export interface ComparisonState {
  runners: Map<string, Runner>;
  results: ComparisonResult[];
}

export function createComparisonState(
  algorithms: AlgorithmConfig[],
  input: any
): ComparisonState {
  const runners = new Map<string, Runner>();
  
  algorithms.forEach(algo => {
    runners.set(algo.info.id, createRunner(algo, input));
  });
  
  const results = runComparison(algorithms, input);
  
  return { runners, results };
}
