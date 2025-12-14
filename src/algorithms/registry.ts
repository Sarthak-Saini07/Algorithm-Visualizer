import { AlgorithmConfig, AlgorithmCategory } from './types';

// Sorting algorithms
import { bubbleSort } from './sorting/bubbleSort';
import { selectionSort } from './sorting/selectionSort';
import { mergeSort } from './sorting/mergeSort';
import { quickSort } from './sorting/quickSort';

// Graph algorithms
import { bfs } from './graph/bfs';
import { dfs } from './graph/dfs';
import { dijkstra } from './graph/dijkstra';
import { topologicalSort } from './graph/topologicalSort';

// DP algorithms
import { knapsack } from './dp/knapsack';
import { lcs } from './dp/lcs';

// Registry of all algorithms
export const algorithmRegistry: Map<string, AlgorithmConfig> = new Map([
  // Sorting
  ['bubble-sort', bubbleSort],
  ['selection-sort', selectionSort],
  ['merge-sort', mergeSort],
  ['quick-sort', quickSort],
  
  // Graph
  ['bfs', bfs],
  ['dfs', dfs],
  ['dijkstra', dijkstra],
  ['topological-sort', topologicalSort],
  
  // DP
  ['knapsack', knapsack],
  ['lcs', lcs],
]);

// Get algorithms by category
export const getAlgorithmsByCategory = (category: AlgorithmCategory): AlgorithmConfig[] => {
  return Array.from(algorithmRegistry.values()).filter(
    algo => algo.info.category === category
  );
};

// Get all categories
export const getCategories = (): AlgorithmCategory[] => {
  const categories = new Set<AlgorithmCategory>();
  algorithmRegistry.forEach(algo => categories.add(algo.info.category));
  return Array.from(categories);
};

// Get algorithm by ID
export const getAlgorithm = (id: string): AlgorithmConfig | undefined => {
  return algorithmRegistry.get(id);
};

// Category display names
export const categoryNames: Record<AlgorithmCategory, string> = {
  sorting: 'Sorting',
  graph: 'Graph',
  dp: 'Dynamic Programming',
  tree: 'Tree',
};

// Category icons (for UI)
export const categoryIcons: Record<AlgorithmCategory, string> = {
  sorting: '📊',
  graph: '🔗',
  dp: '📐',
  tree: '🌳',
};
