// import { AlgorithmConfig, AlgorithmGenerator, Graph } from '../types';

// function* dfsGenerator(input: Graph): AlgorithmGenerator {
//   const graph: Graph = {
//     nodes: input.nodes.map(n => ({ ...n, state: 'default' })),
//     edges: input.edges.map(e => ({ ...e, state: 'default' })),
//     directed: input.directed,
//   };

//   let operations = 0;
//   let stepIndex = 0;

//   const startNode = graph.nodes[0];
//   if (!startNode) {
//     yield {
//       stepIndex: 0,
//       visualState: { type: 'graph', graph },
//       metrics: { comparisons: 0, swaps: 0, operations: 0 },
//       message: 'Empty graph - nothing to traverse.',
//     };
//     return;
//   }

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'graph', graph },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `Starting DFS from node ${startNode.id}. We will explore as deep as possible before backtracking.`,
//   };

//   const visited = new Set<string>();
//   const stack: string[] = [];

//   // Build adjacency list
//   const adjacencyList = new Map<string, string[]>();
//   graph.nodes.forEach(n => adjacencyList.set(n.id, []));
//   graph.edges.forEach(e => {
//     adjacencyList.get(e.from)?.push(e.to);
//     if (!graph.directed) {
//       adjacencyList.get(e.to)?.push(e.from);
//     }
//   });

//   const getNode = (id: string) => graph.nodes.find(n => n.id === id);
//   const getEdge = (from: string, to: string) => 
//     graph.edges.find(e => 
//       (e.from === from && e.to === to) || 
//       (!graph.directed && e.from === to && e.to === from)
//     );

//   function* dfs(nodeId: string): Generator<void, void, unknown> {
//     visited.add(nodeId);
//     stack.push(nodeId);
//     const node = getNode(nodeId)!;
//     node.state = 'current';
//     operations++;

//     yield;

//     const neighbors = adjacencyList.get(nodeId) || [];

//     for (const neighborId of neighbors) {
//       operations++;

//       if (!visited.has(neighborId)) {
//         const edge = getEdge(nodeId, neighborId);
//         if (edge) edge.state = 'active';

//         const neighborNode = getNode(neighborId)!;
//         neighborNode.state = 'active';

//         yield;

//         yield* dfs(neighborId);

//         // Backtrack
//         node.state = 'current';
//         if (edge) edge.state = 'visited';

//         yield;
//       }
//     }

//     node.state = 'visited';
//     stack.pop();

//     yield;
//   }

//   const generator = dfs(startNode.id);
//   let result = generator.next();

//   while (!result.done) {
//     yield {
//       stepIndex: stepIndex++,
//       visualState: { type: 'graph', graph },
//       metrics: { comparisons: 0, swaps: 0, operations },
//       message: `DFS traversal. Stack: [${stack.join(' → ')}]`,
//     };
//     result = generator.next();
//   }

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'graph', graph },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `DFS complete! Visited ${visited.size} nodes in ${operations} operations.`,
//   };
// }

// function createDefaultGraph(): Graph {
//   return {
//     directed: false,
//     nodes: [
//       { id: 'A', x: 200, y: 50, state: 'default' },
//       { id: 'B', x: 100, y: 150, state: 'default' },
//       { id: 'C', x: 300, y: 150, state: 'default' },
//       { id: 'D', x: 50, y: 250, state: 'default' },
//       { id: 'E', x: 150, y: 250, state: 'default' },
//       { id: 'F', x: 250, y: 250, state: 'default' },
//       { id: 'G', x: 350, y: 250, state: 'default' },
//     ],
//     edges: [
//       { from: 'A', to: 'B', state: 'default' },
//       { from: 'A', to: 'C', state: 'default' },
//       { from: 'B', to: 'D', state: 'default' },
//       { from: 'B', to: 'E', state: 'default' },
//       { from: 'C', to: 'F', state: 'default' },
//       { from: 'C', to: 'G', state: 'default' },
//     ],
//   };
// }

// export const dfs: AlgorithmConfig = {
//   info: {
//     id: 'dfs',
//     name: 'Depth-First Search',
//     category: 'graph',
//     description: 'Explores a graph by going as deep as possible along each branch before backtracking. Uses a stack (or recursion).',
//     timeComplexity: {
//       best: 'O(V + E)',
//       average: 'O(V + E)',
//       worst: 'O(V + E)',
//     },
//     spaceComplexity: 'O(V)',
//   },
//   defaultInput: createDefaultGraph,
//   run: dfsGenerator,
// };
import { AlgorithmConfig, AlgorithmGenerator, Graph } from '../types';

/* ---------- helper: deep snapshot ---------- */
function snapshot(graph: Graph): Graph {
  return {
    directed: graph.directed,
    nodes: graph.nodes.map(n => ({ ...n })),
    edges: graph.edges.map(e => ({ ...e })),
  };
}

/* ---------- DFS Generator ---------- */
function* dfsGenerator(
  input: Graph & { startNodeId?: string }
): AlgorithmGenerator {

  const graph: Graph = {
    directed: input.directed,
    nodes: input.nodes.map(n => ({ ...n, state: 'default' })),
    edges: input.edges.map(e => ({ ...e, state: 'default' })),
  };

  let operations = 0;
  let stepIndex = 0;

  const startNode =
    graph.nodes.find(n => n.id === input.startNodeId) ??
    graph.nodes[0];

  if (!startNode) {
    yield {
      stepIndex,
      visualState: { type: 'graph', graph: snapshot(graph) },
      metrics: { comparisons: 0, swaps: 0, operations },
      message: 'Empty graph — nothing to traverse.',
    };
    return;
  }

  /* ---------- Initial State ---------- */
  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'graph', graph: snapshot(graph) },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `Starting DFS from node ${startNode.id}.`,
  };

  const visited = new Set<string>();
  const stack: string[] = [];

  /* ---------- Build adjacency list ---------- */
  const adjacencyList = new Map<string, string[]>();
  graph.nodes.forEach(n => adjacencyList.set(n.id, []));
  graph.edges.forEach(e => {
    adjacencyList.get(e.from)?.push(e.to);
    if (!graph.directed) adjacencyList.get(e.to)?.push(e.from);
  });

  const getNode = (id: string) => graph.nodes.find(n => n.id === id)!;
  const getEdge = (a: string, b: string) =>
    graph.edges.find(
      e =>
        (e.from === a && e.to === b) ||
        (!graph.directed && e.from === b && e.to === a)
    );

  /* ---------- DFS Recursive Generator ---------- */
  function* dfsVisit(nodeId: string): Generator<void, void, unknown> {
    visited.add(nodeId);
    stack.push(nodeId);

    const node = getNode(nodeId);
    node.state = 'current';
    operations++;

    yield;

    for (const neighborId of adjacencyList.get(nodeId) || []) {
      operations++;

      if (!visited.has(neighborId)) {
        const edge = getEdge(nodeId, neighborId);
        if (edge) edge.state = 'active';

        const neighborNode = getNode(neighborId);
        neighborNode.state = 'active';

        yield;

        yield* dfsVisit(neighborId);

        /* ---------- Backtracking ---------- */
        node.state = 'current';
        if (edge) edge.state = 'visited';

        yield;
      }
    }

    node.state = 'visited';
    stack.pop();

    yield;
  }

  /* ---------- Drive the DFS generator ---------- */
  const internalGenerator = dfsVisit(startNode.id);
  let result = internalGenerator.next();

  while (!result.done) {
    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'graph', graph: snapshot(graph) },
      metrics: { comparisons: 0, swaps: 0, operations },
      message: `DFS traversal. Stack: [${stack.join(' → ')}]`,
    };
    result = internalGenerator.next();
  }

  /* ---------- Finished ---------- */
  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'graph', graph: snapshot(graph) },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `DFS complete. Visited ${visited.size} nodes.`,
  };
}

/* ---------- Default Graph ---------- */
function createDefaultGraph(): Graph {
  return {
    directed: false,
    nodes: [
      { id: 'A', x: 200, y: 50, state: 'default' },
      { id: 'B', x: 100, y: 150, state: 'default' },
      { id: 'C', x: 300, y: 150, state: 'default' },
      { id: 'D', x: 50, y: 250, state: 'default' },
      { id: 'E', x: 150, y: 250, state: 'default' },
      { id: 'F', x: 250, y: 250, state: 'default' },
      { id: 'G', x: 350, y: 250, state: 'default' },
    ],
    edges: [
      { from: 'A', to: 'B', state: 'default' },
      { from: 'A', to: 'C', state: 'default' },
      { from: 'B', to: 'D', state: 'default' },
      { from: 'B', to: 'E', state: 'default' },
      { from: 'C', to: 'F', state: 'default' },
      { from: 'C', to: 'G', state: 'default' },
    ],
  };
}

/* ---------- Export ---------- */
export const dfs: AlgorithmConfig = {
  info: {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'graph',
    description:
      'Explores a graph by going as deep as possible before backtracking.',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
    },
    spaceComplexity: 'O(V)',
  },
  defaultInput: createDefaultGraph,
  run: dfsGenerator,
};
