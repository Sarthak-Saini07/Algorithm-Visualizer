// import { AlgorithmConfig, AlgorithmGenerator, DPTable, DPCell } from '../types';

// interface LCSInput {
//   sequence1: string;
//   sequence2: string;
// }

// function* lcsGenerator(input: LCSInput): AlgorithmGenerator {
//   const { sequence1, sequence2 } = input;
//   const m = sequence1.length;
//   const n = sequence2.length;

//   // Initialize DP table
//   const cells: DPCell[][] = [];
//   for (let i = 0; i <= m; i++) {
//     cells[i] = [];
//     for (let j = 0; j <= n; j++) {
//       cells[i][j] = {
//         value: 0,
//         state: 'default',
//         row: i,
//         col: j,
//       };
//     }
//   }

//   const dpTable: DPTable = {
//     cells,
//     rowLabels: ['∅', ...sequence1.split('')],
//     colLabels: ['∅', ...sequence2.split('')],
//   };

//   let operations = 0;
//   let stepIndex = 0;

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'dp', table: dpTable, sequence1, sequence2 },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `Finding Longest Common Subsequence of "${sequence1}" and "${sequence2}"`,
//   };

//   // Fill DP table
//   for (let i = 1; i <= m; i++) {
//     for (let j = 1; j <= n; j++) {
//       // Reset previous highlights
//       cells.forEach(row => row.forEach(cell => {
//         if (cell.state === 'current') cell.state = 'computed';
//       }));

//       cells[i][j].state = 'current';
//       operations++;

//       const char1 = sequence1[i - 1];
//       const char2 = sequence2[j - 1];

//       yield {
//         stepIndex: stepIndex++,
//         visualState: { type: 'dp', table: dpTable, sequence1, sequence2 },
//         metrics: { comparisons: 0, swaps: 0, operations },
//         message: `Comparing "${char1}" (pos ${i}) with "${char2}" (pos ${j})`,
//       };

//       if (char1 === char2) {
//         cells[i][j].value = (cells[i - 1][j - 1].value as number) + 1;

//         yield {
//           stepIndex: stepIndex++,
//           visualState: { type: 'dp', table: dpTable, sequence1, sequence2 },
//           metrics: { comparisons: 0, swaps: 0, operations },
//           message: `Match! "${char1}" = "${char2}". LCS length = ${cells[i][j].value}`,
//         };
//       } else {
//         cells[i][j].value = Math.max(
//           cells[i - 1][j].value as number,
//           cells[i][j - 1].value as number
//         );

//         yield {
//           stepIndex: stepIndex++,
//           visualState: { type: 'dp', table: dpTable, sequence1, sequence2 },
//           metrics: { comparisons: 0, swaps: 0, operations },
//           message: `No match. Taking max(${cells[i - 1][j].value}, ${cells[i][j - 1].value}) = ${cells[i][j].value}`,
//         };
//       }

//       cells[i][j].state = 'computed';
//     }
//   }

//   // Backtrack to find LCS
//   let lcs = '';
//   let i = m, j = n;
//   const path: [number, number][] = [];

//   while (i > 0 && j > 0) {
//     if (sequence1[i - 1] === sequence2[j - 1]) {
//       lcs = sequence1[i - 1] + lcs;
//       cells[i][j].state = 'optimal';
//       path.unshift([i, j]);
//       i--;
//       j--;
//     } else if ((cells[i - 1][j].value as number) > (cells[i][j - 1].value as number)) {
//       i--;
//     } else {
//       j--;
//     }
//   }

//   dpTable.highlightPath = path;

//   yield {
//     stepIndex: stepIndex++,
//     visualState: { type: 'dp', table: dpTable, sequence1, sequence2 },
//     metrics: { comparisons: 0, swaps: 0, operations },
//     message: `LCS complete! Length: ${cells[m][n].value}, Subsequence: "${lcs}"`,
//   };
// }

// function createDefaultInput(): LCSInput {
//   return {
//     sequence1: 'ABCBDAB',
//     sequence2: 'BDCAB',
//   };
// }

// export const lcs: AlgorithmConfig = {
//   info: {
//     id: 'lcs',
//     name: 'Longest Common Subsequence',
//     category: 'dp',
//     description: 'Finds the longest subsequence common to two sequences. A subsequence is a sequence that appears in the same relative order but not necessarily contiguous.',
//     timeComplexity: {
//       best: 'O(m × n)',
//       average: 'O(m × n)',
//       worst: 'O(m × n)',
//     },
//     spaceComplexity: 'O(m × n)',
//   },
//   defaultInput: createDefaultInput,
//   run: lcsGenerator,
// };

import { AlgorithmConfig, AlgorithmGenerator, DPTable, DPCell } from '../types';

interface LCSInput {
  sequence1: string;
  sequence2: string;
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

function* lcsGenerator(input: LCSInput): AlgorithmGenerator {
  const { sequence1, sequence2 } = input;
  const m = sequence1.length;
  const n = sequence2.length;

  /* ---------- init DP table ---------- */
  const cells: DPCell[][] = [];
  for (let i = 0; i <= m; i++) {
    cells[i] = [];
    for (let j = 0; j <= n; j++) {
      cells[i][j] = {
        value: 0,
        state: 'default',
        row: i,
        col: j,
      };
    }
  }

  const dpTable: DPTable = {
    cells,
    rowLabels: ['∅', ...sequence1.split('')],
    colLabels: ['∅', ...sequence2.split('')],
  };

  let operations = 0;
  let stepIndex = 0;

  /* ---------- initial state ---------- */
  yield {
    stepIndex: stepIndex++,
    visualState: {
      type: 'dp',
      table: snapshotTable(dpTable),
      sequence1,
      sequence2,
    },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `Finding LCS of "${sequence1}" and "${sequence2}".`,
  };

  /* ---------- fill DP table ---------- */
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // clear previous current
      dpTable.cells.flat().forEach(cell => {
        if (cell.state === 'current') cell.state = 'computed';
      });

      const cell = dpTable.cells[i][j];
      cell.state = 'current';
      operations++;

      const c1 = sequence1[i - 1];
      const c2 = sequence2[j - 1];

      yield {
        stepIndex: stepIndex++,
        visualState: {
          type: 'dp',
          table: snapshotTable(dpTable),
          sequence1,
          sequence2,
        },
        metrics: { comparisons: 0, swaps: 0, operations },
        message: `Comparing '${c1}' (i=${i}) with '${c2}' (j=${j})`,
      };

      if (c1 === c2) {
        cell.value =
          (dpTable.cells[i - 1][j - 1].value as number) + 1;

        yield {
          stepIndex: stepIndex++,
          visualState: {
            type: 'dp',
            table: snapshotTable(dpTable),
            sequence1,
            sequence2,
          },
          metrics: { comparisons: 0, swaps: 0, operations },
          message: `Match! Value = ${cell.value}`,
        };
      } else {
        cell.value = Math.max(
          dpTable.cells[i - 1][j].value as number,
          dpTable.cells[i][j - 1].value as number
        );

        yield {
          stepIndex: stepIndex++,
          visualState: {
            type: 'dp',
            table: snapshotTable(dpTable),
            sequence1,
            sequence2,
          },
          metrics: { comparisons: 0, swaps: 0, operations },
          message: `No match → value = ${cell.value}`,
        };
      }

      cell.state = 'computed';
    }
  }

  /* ---------- backtracking ---------- */
  let lcs = '';
  let i = m, j = n;
  const path: [number, number][] = [];

  while (i > 0 && j > 0) {
    if (sequence1[i - 1] === sequence2[j - 1]) {
      lcs = sequence1[i - 1] + lcs;
      dpTable.cells[i][j].state = 'optimal';
      path.unshift([i, j]);
      i--;
      j--;
    } else if (
      (dpTable.cells[i - 1][j].value as number) >
      (dpTable.cells[i][j - 1].value as number)
    ) {
      i--;
    } else {
      j--;
    }
  }

  dpTable.highlightPath = path;

  yield {
    stepIndex: stepIndex++,
    visualState: {
      type: 'dp',
      table: snapshotTable(dpTable),
      sequence1,
      sequence2,
    },
    metrics: { comparisons: 0, swaps: 0, operations },
    message: `LCS complete! Length=${dpTable.cells[m][n].value}, LCS="${lcs}"`,
  };
}

/* ---------- default input ---------- */
function createDefaultInput(): LCSInput {
  return {
    sequence1: 'ABCBDAB',
    sequence2: 'BDCAB',
  };
}

export const lcs: AlgorithmConfig = {
  info: {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'dp',
    description:
      'Finds the longest subsequence common to two sequences.',
    timeComplexity: {
      best: 'O(m × n)',
      average: 'O(m × n)',
      worst: 'O(m × n)',
    },
    spaceComplexity: 'O(m × n)',
  },
  defaultInput: createDefaultInput,
  run: lcsGenerator,
};
