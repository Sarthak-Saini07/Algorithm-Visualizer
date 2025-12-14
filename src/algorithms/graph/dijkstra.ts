// import { AlgorithmConfig, AlgorithmGenerator, Graph } from '../types';

// function* dijkstraGenerator(input: Graph): AlgorithmGenerator {
//   const graph: Graph = {
//     nodes: input.nodes.map(n => ({ ...n, state: 'default', distance: Infinity })),
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
//     message: `Starting Dijkstra's algorithm from node ${startNode.id}. Finding shortest paths to all nodes.`,
//   };

//   // Build adjacency list with weights
//   const adjacencyList = new Map<string, { to: string; weight: number }[]>();
//   graph.nodes.forEach(n => adjacencyList.set(n.id, []));
//   graph.edges.forEach(e => {
//     adjacencyList.get(e.from)?.push({ to: e.to, weight: e.weight || 1 });
//     if (!graph.directed) {
//       adjacencyList.get(e.to)?.push({ to: e.from, weight: e.weight || 1 });
//     }
//   });

//   const getNode = (id: string) => graph.nodes.find(n => n.id === id);
//   const getEdge = (from: string, to: string) => 
//     graph.edges.find(e => 
//       (e.from === from && e.to === to) || 
//       (!graph.directed && e.from === to && e.to === from)
//     );

//   // Initialize distances
//   const distances = new Map<string, number>();
//   const predecessors = new Map<string, string | null>();
//   const unvisited = new Set<string>();

//   graph.nodes.forEach(n => {
//     distances.set(n.id, Infinity);
//     predecessors.set(n.id, null);
//     unvisited.add(n.id);
//     n.distance = Infinity;
//   });

//   distances.set(startNode.id, 0);
//   startNode.distance = 0;
//   startNode.state = 'active';

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { 
//       type: 'graph', 
//       graph,
//       distances,
//       predecessors,
//     },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `Initialized distances. Source node ${startNode.id} has distance 0, all others have ∞.`,
//   };

//   while (unvisited.size > 0) {
//     // Find minimum distance node
//     let minDist = Infinity;
//     let minNode: string | null = null;

//     for (const nodeId of unvisited) {
//       const dist = distances.get(nodeId)!;
//       if (dist < minDist) {
//         minDist = dist;
//         minNode = nodeId;
//       }
//       operations++;
//     }

//     if (minNode === null || minDist === Infinity) break;

//     const currentNode = getNode(minNode)!;
//     currentNode.state = 'current';
//     unvisited.delete(minNode);

//     yield {
//       stepIndex: stepIndex++,
//       visualState: { type: 'graph', graph, distances, predecessors },
//       metrics: { comparisons: 0, swaps: 0, operations },
//       message: `Selected node ${minNode} with distance ${minDist}. Exploring neighbors.`,
//     };

//     const neighbors = adjacencyList.get(minNode) || [];

//     for (const { to: neighborId, weight } of neighbors) {
//       if (!unvisited.has(neighborId)) continue;

//       const neighborNode = getNode(neighborId)!;
//       const edge = getEdge(minNode, neighborId);
      
//       const newDist = distances.get(minNode)! + weight;
//       operations++;

//       if (edge) edge.state = 'active';
//       neighborNode.state = 'active';

//       yield {
//         stepIndex: stepIndex++,
//         visualState: { type: 'graph', graph, distances, predecessors },
//         metrics: { comparisons: 0, swaps: 0, operations },
//         message: `Checking path to ${neighborId}: current distance = ${distances.get(neighborId) === Infinity ? '∞' : distances.get(neighborId)}, new distance = ${newDist}`,
//       };

//       if (newDist < distances.get(neighborId)!) {
//         distances.set(neighborId, newDist);
//         predecessors.set(neighborId, minNode);
//         neighborNode.distance = newDist;

//         yield {
//           stepIndex: stepIndex++,
//           visualState: { type: 'graph', graph, distances, predecessors },
//           metrics: { comparisons: 0, swaps: 0, operations },
//           message: `Updated distance to ${neighborId}: ${newDist} (via ${minNode})`,
//         };
//       }

//       if (edge) edge.state = 'default';
//       if (neighborNode.state === 'active') {
//         neighborNode.state = 'default';
//       }
//     }

//     currentNode.state = 'visited';

//     yield {
//       stepIndex: stepIndex++,
//       visualState: { type: 'graph', graph, distances, predecessors },
//       metrics: { comparisons: 0, swaps: 0, operations },
//       message: `Finished processing node ${minNode}.`,
//     };
//   }

//   // Mark shortest path edges
//   graph.nodes.forEach(n => {
//     const pred = predecessors.get(n.id);
//     if (pred) {
//       const edge = getEdge(pred, n.id);
//       if (edge) edge.state = 'path';
//     }
//     n.state = 'path';
//   });

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'graph', graph, distances, predecessors },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `Dijkstra's algorithm complete! Found shortest paths from ${startNode.id} to all reachable nodes.`,
//   };
// }

// function createDefaultGraph(): Graph {
//   return {
//     directed: false,
//     nodes: [
//       { id: 'A', x: 100, y: 150, state: 'default' },
//       { id: 'B', x: 200, y: 50, state: 'default' },
//       { id: 'C', x: 200, y: 250, state: 'default' },
//       { id: 'D', x: 300, y: 150, state: 'default' },
//       { id: 'E', x: 400, y: 50, state: 'default' },
//       { id: 'F', x: 400, y: 250, state: 'default' },
//     ],
//     edges: [
//       { from: 'A', to: 'B', weight: 4, state: 'default' },
//       { from: 'A', to: 'C', weight: 2, state: 'default' },
//       { from: 'B', to: 'D', weight: 5, state: 'default' },
//       { from: 'C', to: 'D', weight: 1, state: 'default' },
//       { from: 'D', to: 'E', weight: 3, state: 'default' },
//       { from: 'D', to: 'F', weight: 6, state: 'default' },
//       { from: 'B', to: 'E', weight: 2, state: 'default' },
//     ],
//   };
// }

// export const dijkstra: AlgorithmConfig = {
//   info: {
//     id: 'dijkstra',
//     name: "Dijkstra's Algorithm",
//     category: 'graph',
//     description: 'Finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights.',
//     timeComplexity: {
//       best: 'O((V + E) log V)',
//       average: 'O((V + E) log V)',
//       worst: 'O(V²)',
//     },
//     spaceComplexity: 'O(V)',
//   },
//   defaultInput: createDefaultGraph,
//   run: dijkstraGenerator,
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

function* dijkstraGenerator(
  input: Graph & { startNodeId?: string }
): AlgorithmGenerator {

  const graph: Graph = {
    directed: input.directed,
    nodes: input.nodes.map(n => ({
      ...n,
      state: 'default',
      distance: Infinity,
    })),
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

  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'graph', graph: snapshot(graph) },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `Starting Dijkstra from node ${startNode.id}.`,
  };

  /* ---------- adjacency list ---------- */
  const adjacencyList = new Map<string, { to: string; weight: number }[]>();
  graph.nodes.forEach(n => adjacencyList.set(n.id, []));
  graph.edges.forEach(e => {
    adjacencyList.get(e.from)?.push({ to: e.to, weight: e.weight ?? 1 });
    if (!graph.directed) {
      adjacencyList.get(e.to)?.push({ to: e.from, weight: e.weight ?? 1 });
    }
  });

  const getNode = (id: string) => graph.nodes.find(n => n.id === id)!;
  const getEdge = (a: string, b: string) =>
    graph.edges.find(
      e =>
        (e.from === a && e.to === b) ||
        (!graph.directed && e.from === b && e.to === a)
    );

  /* ---------- initialization ---------- */
  const distances = new Map<string, number>();
  const predecessors = new Map<string, string | null>();
  const unvisited = new Set<string>();

  graph.nodes.forEach(n => {
    distances.set(n.id, Infinity);
    predecessors.set(n.id, null);
    unvisited.add(n.id);
    n.distance = Infinity;
  });

  distances.set(startNode.id, 0);
  startNode.distance = 0;
  startNode.state = 'active';

  yield {
    stepIndex: stepIndex++,
    visualState: {
      type: 'graph',
      graph: snapshot(graph),
      distances,
      predecessors,
    },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `Initialized distances. Source ${startNode.id} = 0.`,
  };

  /* ---------- main loop ---------- */
  while (unvisited.size > 0) {
    let minNode: string | null = null;
    let minDist = Infinity;

    for (const nodeId of unvisited) {
      operations++;
      const d = distances.get(nodeId)!;
      if (d < minDist) {
        minDist = d;
        minNode = nodeId;
      }
    }

    if (minNode === null || minDist === Infinity) break;

    const currentNode = getNode(minNode);
    currentNode.state = 'current';
    unvisited.delete(minNode);

    yield {
      stepIndex: stepIndex++,
      visualState: {
        type: 'graph',
        graph: snapshot(graph),
        distances,
        predecessors,
      },
      metrics: { comparisons: 0, swaps: 0, operations },
      message: `Selected ${minNode} with distance ${minDist}.`,
    };

    for (const { to, weight } of adjacencyList.get(minNode) || []) {
      if (!unvisited.has(to)) continue;

      operations++;

      const edge = getEdge(minNode, to);
      const neighbor = getNode(to);

      if (edge) edge.state = 'active';
      neighbor.state = 'active';

      const newDist = distances.get(minNode)! + weight;

      yield {
        stepIndex: stepIndex++,
        visualState: {
          type: 'graph',
          graph: snapshot(graph),
          distances,
          predecessors,
        },
        metrics: { comparisons: 0, swaps: 0, operations },
        message: `Relaxing edge ${minNode} → ${to} (new distance ${newDist}).`,
      };

      if (newDist < distances.get(to)!) {
        distances.set(to, newDist);
        predecessors.set(to, minNode);
        neighbor.distance = newDist;

        yield {
          stepIndex: stepIndex++,
          visualState: {
            type: 'graph',
            graph: snapshot(graph),
            distances,
            predecessors,
          },
          metrics: { comparisons: 0, swaps: 0, operations },
          message: `Updated distance of ${to} to ${newDist}.`,
        };
      }

      if (edge) edge.state = 'visited';
      neighbor.state = 'default';
    }

    currentNode.state = 'visited';

    yield {
      stepIndex: stepIndex++,
      visualState: {
        type: 'graph',
        graph: snapshot(graph),
        distances,
        predecessors,
      },
      metrics: { comparisons: 0, swaps: 0, operations },
      message: `Finished processing ${minNode}.`,
    };
  }

  /* ---------- mark shortest paths ---------- */
  graph.nodes.forEach(n => {
    const pred = predecessors.get(n.id);
    if (pred) {
      const edge = getEdge(pred, n.id);
      if (edge) edge.state = 'path';
    }
    if (distances.get(n.id)! < Infinity) {
      n.state = 'path';
    }
  });

  yield {
    stepIndex: stepIndex++,
    visualState: {
      type: 'graph',
      graph: snapshot(graph),
      distances,
      predecessors,
    },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `Dijkstra complete. Shortest paths computed.`,
  };
}

/* ---------- default graph ---------- */
function createDefaultGraph(): Graph {
  return {
    directed: false,
    nodes: [
      { id: 'A', x: 100, y: 150, state: 'default' },
      { id: 'B', x: 200, y: 50, state: 'default' },
      { id: 'C', x: 200, y: 250, state: 'default' },
      { id: 'D', x: 300, y: 150, state: 'default' },
      { id: 'E', x: 400, y: 50, state: 'default' },
      { id: 'F', x: 400, y: 250, state: 'default' },
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4, state: 'default' },
      { from: 'A', to: 'C', weight: 2, state: 'default' },
      { from: 'B', to: 'D', weight: 5, state: 'default' },
      { from: 'C', to: 'D', weight: 1, state: 'default' },
      { from: 'D', to: 'E', weight: 3, state: 'default' },
      { from: 'D', to: 'F', weight: 6, state: 'default' },
      { from: 'B', to: 'E', weight: 2, state: 'default' },
    ],
  };
}

export const dijkstra: AlgorithmConfig = {
  info: {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    description:
      'Finds the shortest path from a source node to all other nodes.',
    timeComplexity: {
      best: 'O((V + E) log V)',
      average: 'O((V + E) log V)',
      worst: 'O(V²)',
    },
    spaceComplexity: 'O(V)',
  },
  defaultInput: createDefaultGraph,
  run: dijkstraGenerator,
};
