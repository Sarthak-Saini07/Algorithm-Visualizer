// import { AlgorithmConfig, AlgorithmGenerator, DPTable, DPCell } from '../types';

// interface KnapsackInput {
//   weights: number[];
//   values: number[];
//   capacity: number;
// }

// function* knapsackGenerator(input: KnapsackInput): AlgorithmGenerator {
//   const { weights, values, capacity } = input;
//   const n = values.length;

//   // Initialize DP table
//   const cells: DPCell[][] = [];
//   for (let i = 0; i <= n; i++) {
//     cells[i] = [];
//     for (let w = 0; w <= capacity; w++) {
//       cells[i][w] = {
//         value: 0,
//         state: 'default',
//         row: i,
//         col: w,
//       };
//     }
//   }

//   const dpTable: DPTable = {
//     cells,
//     rowLabels: ['∅', ...values.map((v, i) => `Item ${i + 1} (v=${v}, w=${weights[i]})`)],
//     colLabels: Array.from({ length: capacity + 1 }, (_, i) => `${i}`),
//   };

//   let operations = 0;
//   let stepIndex = 0;

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'dp', table: dpTable },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `Starting 0/1 Knapsack. Items: ${n}, Capacity: ${capacity}. Building DP table.`,
//   };

//   // Fill DP table
//   for (let i = 1; i <= n; i++) {
//     for (let w = 1; w <= capacity; w++) {
//       // Reset previous highlights
//       cells.forEach(row => row.forEach(cell => {
//         if (cell.state === 'current') cell.state = 'computed';
//       }));

//       cells[i][w].state = 'current';
//       operations++;

//       const itemWeight = weights[i - 1];
//       const itemValue = values[i - 1];

//       yield {
//         stepIndex: stepIndex++,
//         visualState: { type: 'dp', table: dpTable },
//         metrics: { comparisons: 0, swaps: 0, operations },
//         message: `Considering item ${i} (value=${itemValue}, weight=${itemWeight}) for capacity ${w}`,
//       };

//       if (itemWeight > w) {
//         // Can't include this item
//         cells[i][w].value = cells[i - 1][w].value as number;

//         yield {
//           stepIndex: stepIndex++,
//           visualState: { type: 'dp', table: dpTable },
//           metrics: { comparisons: 0, swaps: 0, operations },
//           message: `Item ${i} too heavy (${itemWeight} > ${w}). Taking value from above: ${cells[i][w].value}`,
//         };
//       } else {
//         // Can include or exclude
//         const exclude = cells[i - 1][w].value as number;
//         const include = (cells[i - 1][w - itemWeight].value as number) + itemValue;

//         cells[i][w].value = Math.max(exclude, include);

//         yield {
//           stepIndex: stepIndex++,
//           visualState: { type: 'dp', table: dpTable },
//           metrics: { comparisons: 0, swaps: 0, operations },
//           message: `Exclude: ${exclude}, Include: ${include}. Best: ${cells[i][w].value}`,
//         };
//       }

//       cells[i][w].state = 'computed';
//     }
//   }

//   // Backtrack to find selected items
//   const selected: number[] = [];
//   let w = capacity;
//   for (let i = n; i > 0 && w > 0; i--) {
//     if (cells[i][w].value !== cells[i - 1][w].value) {
//       selected.unshift(i);
//       cells[i][w].state = 'optimal';
//       w -= weights[i - 1];
//     }
//   }

//   // Mark the path
//   dpTable.highlightPath = selected.map((i, idx) => [i, capacity - selected.slice(idx + 1).reduce((sum, j) => sum + weights[j - 1], 0)]);

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'dp', table: dpTable },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `Knapsack complete! Maximum value: ${cells[n][capacity].value}. Selected items: ${selected.join(', ')}`,
//   };
// }

// function createDefaultInput(): KnapsackInput {
//   return {
//     weights: [2, 3, 4, 5],
//     values: [3, 4, 5, 6],
//     capacity: 8,
//   };
// }

// export const knapsack: AlgorithmConfig = {
//   info: {
//     id: 'knapsack',
//     name: '0/1 Knapsack',
//     category: 'dp',
//     description: 'Given items with weights and values, find the maximum value that can be obtained with a given capacity constraint. Each item can be taken or left (0/1).',
//     timeComplexity: {
//       best: 'O(n × W)',
//       average: 'O(n × W)',
//       worst: 'O(n × W)',
//     },
//     spaceComplexity: 'O(n × W)',
//   },
//   defaultInput: createDefaultInput,
//   run: knapsackGenerator,
// };

import { AlgorithmConfig, AlgorithmGenerator, DPTable, DPCell } from '../types';

interface KnapsackInput {
  weights: number[];
  values: number[];
  capacity: number;
}

/* ---------- snapshot helper (CRITICAL) ---------- */
function snapshotTable(table: DPTable): DPTable {
  return {
    ...table,
    cells: table.cells.map(row =>
      row.map(cell => ({ ...cell }))
    ),
    highlightPath: table.highlightPath
      ? table.highlightPath.map(([r, c]) => [r, c])
      : undefined,
  };
}


function* knapsackGenerator(input: KnapsackInput): AlgorithmGenerator {
  const { weights, values, capacity } = input;
  const n = values.length;

  /* ---------- init DP table ---------- */
  const cells: DPCell[][] = [];
  for (let i = 0; i <= n; i++) {
    cells[i] = [];
    for (let w = 0; w <= capacity; w++) {
      cells[i][w] = {
        value: 0,
        state: 'default',
        row: i,
        col: w,
      };
    }
  }

  const dpTable: DPTable = {
    cells,
    rowLabels: ['∅', ...values.map((v, i) => `Item ${i + 1} (v=${v}, w=${weights[i]})`)],
    colLabels: Array.from({ length: capacity + 1 }, (_, i) => `${i}`),
  };

  let operations = 0;
  let stepIndex = 0;

  /* ---------- initial state ---------- */
  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'dp', table: snapshotTable(dpTable) },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `Starting 0/1 Knapsack. Items=${n}, Capacity=${capacity}.`,
  };

  /* ---------- fill DP table ---------- */
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {

      // clear previous "current"
      dpTable.cells.flat().forEach(cell => {
        if (cell.state === 'current') cell.state = 'computed';
      });

      const cell = dpTable.cells[i][w];
      cell.state = 'current';
      operations++;

      const itemWeight = weights[i - 1];
      const itemValue = values[i - 1];

      yield {
        stepIndex: stepIndex++,
        visualState: { type: 'dp', table: snapshotTable(dpTable) },
        metrics: { comparisons: 0, swaps: 0, operations },
        message: `Considering item ${i} (w=${itemWeight}, v=${itemValue}) at capacity ${w}.`,
      };

      if (itemWeight > w) {
        cell.value = dpTable.cells[i - 1][w].value as number;

        yield {
          stepIndex: stepIndex++,
          visualState: { type: 'dp', table: snapshotTable(dpTable) },
          metrics: { comparisons: 0, swaps: 0, operations },
          message: `Too heavy → copy value ${cell.value}.`,
        };
      } else {
        const exclude = dpTable.cells[i - 1][w].value as number;
        const include =
          (dpTable.cells[i - 1][w - itemWeight].value as number) + itemValue;

        cell.value = Math.max(exclude, include);

        yield {
          stepIndex: stepIndex++,
          visualState: { type: 'dp', table: snapshotTable(dpTable) },
          metrics: { comparisons: 0, swaps: 0, operations },
          message: `Exclude=${exclude}, Include=${include} → Best=${cell.value}.`,
        };
      }

      cell.state = 'computed';
    }
  }

  /* ---------- backtrack ---------- */
  const selected: number[] = [];
  let w = capacity;

  for (let i = n; i > 0 && w > 0; i--) {
    if (dpTable.cells[i][w].value !== dpTable.cells[i - 1][w].value) {
      selected.unshift(i);
      dpTable.cells[i][w].state = 'optimal';
      w -= weights[i - 1];
    }
  }

  dpTable.highlightPath = selected.map((itemIndex, idx) => {
    const usedWeight = selected
      .slice(idx + 1)
      .reduce((sum, j) => sum + weights[j - 1], 0);
    return [itemIndex, capacity - usedWeight];
  });

  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'dp', table: snapshotTable(dpTable) },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `Knapsack complete! Max value = ${dpTable.cells[n][capacity].value}. Selected items: ${selected.join(', ')}`,
  };
}

/* ---------- default input ---------- */
function createDefaultInput(): KnapsackInput {
  return {
    weights: [2, 3, 4, 5],
    values: [3, 4, 5, 6],
    capacity: 8,
  };
}

export const knapsack: AlgorithmConfig = {
  info: {
    id: 'knapsack',
    name: '0/1 Knapsack',
    category: 'dp',
    description:
      'Maximize total value with weight constraint using DP.',
    timeComplexity: {
      best: 'O(n × W)',
      average: 'O(n × W)',
      worst: 'O(n × W)',
    },
    spaceComplexity: 'O(n × W)',
  },
  defaultInput: createDefaultInput,
  run: knapsackGenerator,
};
