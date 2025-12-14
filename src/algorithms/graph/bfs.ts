// import { AlgorithmConfig, AlgorithmGenerator, Graph, GraphNode, GraphEdge } from '../types';

// function* bfsGenerator(input: Graph): AlgorithmGenerator {
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
//     message: `Starting BFS from node ${startNode.id}. We will explore all nodes level by level.`,
//   };

//   const visited = new Set<string>();
//   const queue: string[] = [startNode.id];
//   visited.add(startNode.id);

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

//   startNode.state = 'active';
//   operations++;

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'graph', graph },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `Added starting node ${startNode.id} to the queue.`,
//   };

//   while (queue.length > 0) {
//     const currentId = queue.shift()!;
//     const currentNode = getNode(currentId)!;
//     currentNode.state = 'current';
//     operations++;

//     yield {
//       stepIndex: stepIndex++,
//       visualState: { type: 'graph', graph },
//       metrics: { comparisons: 0, swaps: 0, operations },
//       message: `Visiting node ${currentId}. Queue: [${queue.join(', ')}]`,
//     };

//     const neighbors = adjacencyList.get(currentId) || [];

//     for (const neighborId of neighbors) {
//       operations++;

//       if (!visited.has(neighborId)) {
//         visited.add(neighborId);
//         queue.push(neighborId);

//         const neighborNode = getNode(neighborId)!;
//         neighborNode.state = 'active';

//         const edge = getEdge(currentId, neighborId);
//         if (edge) edge.state = 'active';

//         yield {
//           stepIndex: stepIndex++,
//           visualState: { type: 'graph', graph },
//           metrics: { comparisons: 0, swaps: 0, operations },
//           message: `Discovered node ${neighborId} from ${currentId}. Added to queue.`,
//         };
//       }
//     }

//     currentNode.state = 'visited';
//     graph.edges.filter(e => 
//       (e.from === currentId || (!graph.directed && e.to === currentId)) && 
//       e.state === 'active'
//     ).forEach(e => e.state = 'visited');

//     yield {
//       stepIndex: stepIndex++,
//       visualState: { type: 'graph', graph },
//       metrics: { comparisons: 0, swaps: 0, operations },
//       message: `Finished processing node ${currentId}.`,
//     };
//   }

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'graph', graph },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `BFS complete! Visited ${visited.size} nodes in ${operations} operations.`,
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

// export const bfs: AlgorithmConfig = {
//   info: {
//     id: 'bfs',
//     name: 'Breadth-First Search',
//     category: 'graph',
//     description: 'Explores a graph level by level, visiting all neighbors of a node before moving to the next level. Uses a queue data structure.',
//     timeComplexity: {
//       best: 'O(V + E)',
//       average: 'O(V + E)',
//       worst: 'O(V + E)',
//     },
//     spaceComplexity: 'O(V)',
//   },
//   defaultInput: createDefaultGraph,
//   run: bfsGenerator,
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

/* ---------- BFS Generator ---------- */
function* bfsGenerator(
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
    message: `Starting BFS from node ${startNode.id}.`,
  };

  const visited = new Set<string>();
  const queue: string[] = [];

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

  /* ---------- Start BFS ---------- */
  visited.add(startNode.id);
  queue.push(startNode.id);
  startNode.state = 'active';
  operations++;

  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'graph', graph: snapshot(graph) },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `Added ${startNode.id} to the queue.`,
  };

  /* ---------- BFS Loop ---------- */
  while (queue.length) {
    const currentId = queue.shift()!;
    const currentNode = getNode(currentId);

    currentNode.state = 'current';
    operations++;

    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'graph', graph: snapshot(graph) },
      metrics: { comparisons: 0, swaps: 0, operations },
      message: `Visiting node ${currentId}. Queue: [${queue.join(', ')}]`,
    };

    for (const neighborId of adjacencyList.get(currentId) || []) {
      operations++;

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push(neighborId);

        const neighborNode = getNode(neighborId);
        neighborNode.state = 'active';

        const edge = getEdge(currentId, neighborId);
        if (edge) edge.state = 'active';

        yield {
          stepIndex: stepIndex++,
          visualState: { type: 'graph', graph: snapshot(graph) },
          metrics: { comparisons: 0, swaps: 0, operations },
          message: `Discovered ${neighborId}, added to queue.`,
        };
      }
    }

    currentNode.state = 'visited';
    graph.edges.forEach(e => {
      if (e.state === 'active') e.state = 'visited';
    });

    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'graph', graph: snapshot(graph) },
      metrics: { comparisons: 0, swaps: 0, operations },
      message: `Finished processing node ${currentId}.`,
    };
  }

  /* ---------- Finished ---------- */
  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'graph', graph: snapshot(graph) },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `BFS complete. Visited ${visited.size} nodes.`,
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
export const bfs: AlgorithmConfig = {
  info: {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'graph',
    description:
      'Traverses the graph level by level using a queue.',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
    },
    spaceComplexity: 'O(V)',
  },
  defaultInput: createDefaultGraph,
  run: bfsGenerator,
};
