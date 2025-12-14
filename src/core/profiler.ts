import { AlgorithmConfig } from '../algorithms/types';
import { createRunner } from './runner';

export interface ProfilerDataPoint {
  inputSize: number;
  operations: number;
  comparisons: number;
  swaps: number;
  executionTime: number;
}

export interface ProfilerResult {
  algorithmId: string;
  algorithmName: string;
  dataPoints: ProfilerDataPoint[];
}

export function profileAlgorithm(
  algorithm: AlgorithmConfig,
  inputSizes: number[] = [10, 25, 50, 100, 200],
  generateInput: (size: number) => any = (size) => 
    Array.from({ length: size }, () => Math.floor(Math.random() * 100))
): ProfilerResult {
  const dataPoints: ProfilerDataPoint[] = [];
  
  for (const size of inputSizes) {
    const input = generateInput(size);
    
    const startTime = performance.now();
    const runner = createRunner(algorithm, input);
    const endTime = performance.now();
    
    const finalSnapshot = runner.snapshots[runner.snapshots.length - 1];
    
    dataPoints.push({
      inputSize: size,
      operations: finalSnapshot?.metrics.operations ?? 0,
      comparisons: finalSnapshot?.metrics.comparisons ?? 0,
      swaps: finalSnapshot?.metrics.swaps ?? 0,
      executionTime: endTime - startTime,
    });
  }
  
  return {
    algorithmId: algorithm.info.id,
    algorithmName: algorithm.info.name,
    dataPoints,
  };
}

export function profileMultipleAlgorithms(
  algorithms: AlgorithmConfig[],
  inputSizes: number[] = [10, 25, 50, 100, 200],
  generateInput: (size: number) => any = (size) => 
    Array.from({ length: size }, () => Math.floor(Math.random() * 100))
): ProfilerResult[] {
  return algorithms.map(algo => profileAlgorithm(algo, inputSizes, generateInput));
}

export function exportResultsAsJSON(results: ProfilerResult[]): string {
  return JSON.stringify(results, null, 2);
}

export function exportResultsAsCSV(results: ProfilerResult[]): string {
  const headers = ['Algorithm', 'Input Size', 'Operations', 'Comparisons', 'Swaps', 'Execution Time (ms)'];
  const rows: string[] = [headers.join(',')];
  
  for (const result of results) {
    for (const point of result.dataPoints) {
      rows.push([
        result.algorithmName,
        point.inputSize,
        point.operations,
        point.comparisons,
        point.swaps,
        point.executionTime.toFixed(2),
      ].join(','));
    }
  }
  
  return rows.join('\n');
}
