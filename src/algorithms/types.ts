// Core types for the algorithm visualization system

export type BarState = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot';

export interface ArrayElement {
  value: number;
  state: BarState;
  originalIndex: number;
}

export type NodeState = 'default' | 'active' | 'visited' | 'path' | 'current';
export type EdgeState = 'default' | 'active' | 'visited' | 'path';

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  state: NodeState;
  distance?: number;
  label?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  state: EdgeState;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  directed: boolean;
}

export type CellState = 'default' | 'current' | 'computed' | 'optimal';

export interface DPCell {
  value: number | string;
  state: CellState;
  row: number;
  col: number;
}

export interface DPTable {
  cells: DPCell[][];
  rowLabels?: string[];
  colLabels?: string[];
  highlightPath?: [number, number][];
}

export interface TreeNode {
  id: string;
  value: string | number;
  children: TreeNode[];
  state: NodeState;
  x?: number;
  y?: number;
}

export interface AlgorithmMetrics {
  comparisons: number;
  swaps: number;
  operations: number;
  memoryUsed?: number;
  currentPhase?: string;
}

export type VisualizationType = 'array' | 'graph' | 'dp' | 'tree';

export interface ArrayVisualizationState {
  type: 'array';
  elements: ArrayElement[];
  auxiliaryArrays?: ArrayElement[][];
}

export interface GraphVisualizationState {
  type: 'graph';
  graph: Graph;
  distances?: Map<string, number>;
  predecessors?: Map<string, string | null>;
}

export interface DPVisualizationState {
  type: 'dp';
  table: DPTable;
  sequence1?: string;
  sequence2?: string;
}

export interface TreeVisualizationState {
  type: 'tree';
  root: TreeNode | null;
}

export type VisualizationState = 
  | ArrayVisualizationState 
  | GraphVisualizationState 
  | DPVisualizationState 
  | TreeVisualizationState;

export interface AlgorithmSnapshot {
  stepIndex: number;
  visualState: VisualizationState;
  metrics: AlgorithmMetrics;
  message: string;
  code?: {
    line: number;
    highlight?: string;
  };
}

export type AlgorithmGenerator = Generator<AlgorithmSnapshot, void, unknown>;

export type AlgorithmCategory = 'sorting' | 'graph' | 'dp' | 'tree';

export interface AlgorithmInfo {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable?: boolean;
  inPlace?: boolean;
}

export interface AlgorithmConfig {
  info: AlgorithmInfo;
  defaultInput: () => any;
  run: (input: any) => AlgorithmGenerator;
}

export interface RunnerState {
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  snapshots: AlgorithmSnapshot[];
  currentSnapshot: AlgorithmSnapshot | null;
}
