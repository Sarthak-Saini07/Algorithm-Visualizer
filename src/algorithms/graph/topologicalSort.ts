// import { AlgorithmConfig, AlgorithmGenerator, Graph } from '../types';

// function* topologicalSortGenerator(input: Graph): AlgorithmGenerator {
//   const graph: Graph = {
//     nodes: input.nodes.map(n => ({ ...n, state: 'default' })),
//     edges: input.edges.map(e => ({ ...e, state: 'default' })),
//     directed: true, // Topological sort only works on DAGs
//   };

//   let operations = 0;
//   let stepIndex = 0;

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'graph', graph },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: 'Starting Topological Sort using DFS. This orders vertices so that for every edge u→v, u comes before v.',
//   };

//   // Build adjacency list
//   const adjacencyList = new Map<string, string[]>();
//   graph.nodes.forEach(n => adjacencyList.set(n.id, []));
//   graph.edges.forEach(e => {
//     adjacencyList.get(e.from)?.push(e.to);
//   });

//   const getNode = (id: string) => graph.nodes.find(n => n.id === id);
//   const getEdge = (from: string, to: string) => 
//     graph.edges.find(e => e.from === from && e.to === to);

//   const visited = new Set<string>();
//   const result: string[] = [];
//   let hasCycle = false;
//   const inStack = new Set<string>();

//   function* dfs(nodeId: string): Generator<void, void, unknown> {
//     if (hasCycle) return;

//     visited.add(nodeId);
//     inStack.add(nodeId);
//     const node = getNode(nodeId)!;
//     node.state = 'current';
//     operations++;

//     yield;

//     const neighbors = adjacencyList.get(nodeId) || [];

//     for (const neighborId of neighbors) {
//       operations++;

//       if (inStack.has(neighborId)) {
//         hasCycle = true;
//         const neighborNode = getNode(neighborId)!;
//         neighborNode.state = 'path'; // Cycle detected
//         yield;
//         return;
//       }

//       if (!visited.has(neighborId)) {
//         const edge = getEdge(nodeId, neighborId);
//         if (edge) edge.state = 'active';

//         const neighborNode = getNode(neighborId)!;
//         neighborNode.state = 'active';

//         yield;

//         yield* dfs(neighborId);

//         if (hasCycle) return;

//         if (edge) edge.state = 'visited';
//       }
//     }

//     inStack.delete(nodeId);
//     node.state = 'visited';
//     result.unshift(nodeId); // Add to front of result

//     yield;
//   }

//   // Run DFS from all unvisited nodes
//   for (const node of graph.nodes) {
//     if (!visited.has(node.id)) {
//       const generator = dfs(node.id);
//       let dfsResult = generator.next();

//       while (!dfsResult.done) {
//         yield {
//           stepIndex: stepIndex++,
//           visualState: { type: 'graph', graph },
//           metrics: { comparisons: 0, swaps: 0, operations },
//           message: hasCycle 
//             ? 'Cycle detected! Graph is not a DAG.'
//             : `DFS traversal. Current order: [${result.join(' → ')}]`,
//         };
//         dfsResult = generator.next();
//       }

//       if (hasCycle) break;
//     }
//   }

//   if (hasCycle) {
//     yield {
//       stepIndex: stepIndex++,
//       visualState: { type: 'graph', graph },
//       metrics: { comparisons: 0, swaps: 0, operations },
//       message: 'Topological sort failed: Graph contains a cycle and is not a DAG.',
//     };
//   } else {
//     yield {
//       stepIndex: stepIndex++,
//       visualState: { type: 'graph', graph },
//       metrics: { comparisons: 0, swaps: 0, operations },
//       message: `Topological Sort complete! Order: ${result.join(' → ')}`,
//     };
//   }
// }

// function createDefaultGraph(): Graph {
//   return {
//     directed: true,
//     nodes: [
//       { id: 'A', x: 100, y: 100, state: 'default', label: 'Course A' },
//       { id: 'B', x: 250, y: 50, state: 'default', label: 'Course B' },
//       { id: 'C', x: 250, y: 150, state: 'default', label: 'Course C' },
//       { id: 'D', x: 400, y: 100, state: 'default', label: 'Course D' },
//       { id: 'E', x: 400, y: 200, state: 'default', label: 'Course E' },
//       { id: 'F', x: 250, y: 250, state: 'default', label: 'Course F' },
//     ],
//     edges: [
//       { from: 'A', to: 'B', state: 'default' },
//       { from: 'A', to: 'C', state: 'default' },
//       { from: 'B', to: 'D', state: 'default' },
//       { from: 'C', to: 'D', state: 'default' },
//       { from: 'C', to: 'E', state: 'default' },
//       { from: 'F', to: 'E', state: 'default' },
//     ],
//   };
// }

// export const topologicalSort: AlgorithmConfig = {
//   info: {
//     id: 'topological-sort',
//     name: 'Topological Sort',
//     category: 'graph',
//     description: 'Orders vertices in a directed acyclic graph (DAG) such that for every edge u→v, vertex u comes before v. Useful for scheduling tasks with dependencies.',
//     timeComplexity: {
//       best: 'O(V + E)',
//       average: 'O(V + E)',
//       worst: 'O(V + E)',
//     },
//     spaceComplexity: 'O(V)',
//   },
//   defaultInput: createDefaultGraph,
//   run: topologicalSortGenerator,
// };

import { AlgorithmConfig, AlgorithmGenerator, Graph } from '../types';

/* ---------- snapshot helper (CRITICAL) ---------- */
function snapshot(graph: Graph): Graph {
  return {
    directed: graph.directed,
    nodes: graph.nodes.map(n => ({ ...n })),
    edges: graph.edges.map(e => ({ ...e })),
  };
}

function* topologicalSortGenerator(
  input: Graph
): AlgorithmGenerator {

  const graph: Graph = {
    directed: true,
    nodes: input.nodes.map(n => ({ ...n, state: 'default' })),
    edges: input.edges.map(e => ({ ...e, state: 'default' })),
  };

  let operations = 0;
  let stepIndex = 0;

  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'graph', graph: snapshot(graph) },
    metrics: { comparisons: 0, swaps: 0, operations },
    message:
      'Starting Topological Sort (DFS-based). Nodes are ordered so every edge u→v has u before v.',
  };

  /* ---------- adjacency list ---------- */
  const adjacencyList = new Map<string, string[]>();
  graph.nodes.forEach(n => adjacencyList.set(n.id, []));
  graph.edges.forEach(e => adjacencyList.get(e.from)?.push(e.to));

  const getNode = (id: string) => graph.nodes.find(n => n.id === id)!;
  const getEdge = (a: string, b: string) =>
    graph.edges.find(e => e.from === a && e.to === b);

  const visited = new Set<string>();
  const inStack = new Set<string>();
  const result: string[] = [];
  let hasCycle = false;

  /* ---------- DFS for topo ---------- */
  function* dfsVisit(nodeId: string): Generator<void> {
    if (hasCycle) return;

    visited.add(nodeId);
    inStack.add(nodeId);

    const node = getNode(nodeId);
    node.state = 'current';
    operations++;

    yield;

    for (const neighborId of adjacencyList.get(nodeId) || []) {
      operations++;

      /* ---------- cycle detection ---------- */
      if (inStack.has(neighborId)) {
        hasCycle = true;
        const cycleNode = getNode(neighborId);
        cycleNode.state = 'path';

        const edge = getEdge(nodeId, neighborId);
        if (edge) edge.state = 'path';

        yield;
        return;
      }

      if (!visited.has(neighborId)) {
        const edge = getEdge(nodeId, neighborId);
        if (edge) edge.state = 'active';

        const neighborNode = getNode(neighborId);
        neighborNode.state = 'active';

        yield;

        yield* dfsVisit(neighborId);

        if (hasCycle) return;

        if (edge) edge.state = 'visited';
      }
    }

    inStack.delete(nodeId);
    node.state = 'visited';
    result.unshift(nodeId); // topo order build

    yield;
  }

  /* ---------- run DFS from all nodes ---------- */
  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      const internal = dfsVisit(node.id);
      let res = internal.next();

      while (!res.done) {
        yield {
          stepIndex: stepIndex++,
          visualState: { type: 'graph', graph: snapshot(graph) },
          metrics: { comparisons: 0, swaps: 0, operations },
          message: hasCycle
            ? 'Cycle detected! Graph is not a DAG.'
            : `DFS in progress. Current order: [${result.join(' → ')}]`,
        };
        res = internal.next();
      }

      if (hasCycle) break;
    }
  }

  /* ---------- final state ---------- */
  if (hasCycle) {
    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'graph', graph: snapshot(graph) },
      metrics: { comparisons: 0, swaps: 0, operations },
      message:
        'Topological sort failed: cycle detected (graph is not a DAG).',
    };
  } else {
    graph.nodes.forEach(n => (n.state = 'path'));

    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'graph', graph: snapshot(graph) },
      metrics: { comparisons: 0, swaps: 0, operations },
      message: `Topological Sort complete! Order: ${result.join(' → ')}`,
    };
  }
}

/* ---------- default graph ---------- */
function createDefaultGraph(): Graph {
  return {
    directed: true,
    nodes: [
      { id: 'A', x: 100, y: 100, state: 'default', label: 'Course A' },
      { id: 'B', x: 250, y: 50, state: 'default', label: 'Course B' },
      { id: 'C', x: 250, y: 150, state: 'default', label: 'Course C' },
      { id: 'D', x: 400, y: 100, state: 'default', label: 'Course D' },
      { id: 'E', x: 400, y: 200, state: 'default', label: 'Course E' },
      { id: 'F', x: 250, y: 250, state: 'default', label: 'Course F' },
    ],
    edges: [
      { from: 'A', to: 'B', state: 'default' },
      { from: 'A', to: 'C', state: 'default' },
      { from: 'B', to: 'D', state: 'default' },
      { from: 'C', to: 'D', state: 'default' },
      { from: 'C', to: 'E', state: 'default' },
      { from: 'F', to: 'E', state: 'default' },
    ],
  };
}

export const topologicalSort: AlgorithmConfig = {
  info: {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'graph',
    description:
      'Orders vertices of a DAG so that for every edge u→v, u appears before v.',
    timeComplexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
    },
    spaceComplexity: 'O(V)',
  },
  defaultInput: createDefaultGraph,
  run: topologicalSortGenerator,
};
