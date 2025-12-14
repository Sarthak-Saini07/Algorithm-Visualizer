import { AlgorithmConfig, AlgorithmGenerator, ArrayElement, AlgorithmSnapshot } from '../types';

function* bubbleSortGenerator(input: number[]): AlgorithmGenerator {
  const arr: ArrayElement[] = input.map((value, index) => ({
    value,
    state: 'default',
    originalIndex: index,
  }));

  let comparisons = 0;
  let swaps = 0;
  let operations = 0;
  let stepIndex = 0;

  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
    metrics: { comparisons, swaps, operations },
    message: 'Starting Bubble Sort. We will repeatedly compare adjacent elements and swap if they are in wrong order.',
  };

  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Reset previous states
      arr.forEach(e => {
        if (e.state !== 'sorted') e.state = 'default';
      });

      // Mark comparing elements
      arr[j].state = 'comparing';
      arr[j + 1].state = 'comparing';
      comparisons++;
      operations++;

      yield {
        stepIndex: stepIndex++,
        visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
        metrics: { comparisons, swaps, operations },
        message: `Comparing elements at index ${j} (${arr[j].value}) and ${j + 1} (${arr[j + 1].value})`,
      };

      if (arr[j].value > arr[j + 1].value) {
        // Mark as swapping
        arr[j].state = 'swapping';
        arr[j + 1].state = 'swapping';

        yield {
          stepIndex: stepIndex++,
          visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
          metrics: { comparisons, swaps, operations },
          message: `${arr[j].value} > ${arr[j + 1].value}, swapping elements`,
        };

        // Perform swap
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swaps++;
        operations++;
        swapped = true;

        yield {
          stepIndex: stepIndex++,
          visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
          metrics: { comparisons, swaps, operations },
          message: `Swapped! Elements are now in correct relative order.`,
        };
      }
    }

    // Mark the last unsorted element as sorted
    arr[n - i - 1].state = 'sorted';

    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
      metrics: { comparisons, swaps, operations },
      message: `Pass ${i + 1} complete. Element ${arr[n - i - 1].value} is now in its final position.`,
    };

    if (!swapped) {
      // Array is already sorted
      arr.forEach(e => e.state = 'sorted');

      yield {
        stepIndex: stepIndex++,
        visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
        metrics: { comparisons, swaps, operations },
        message: 'No swaps in this pass - array is sorted! Early termination.',
      };
      return;
    }
  }

  // Mark first element as sorted
  arr[0].state = 'sorted';

  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
    metrics: { comparisons, swaps, operations },
    message: `Bubble Sort complete! Total: ${comparisons} comparisons, ${swaps} swaps.`,
  };
}

export const bubbleSort: AlgorithmConfig = {
  info: {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    timeComplexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: true,
    inPlace: true,
  },
  defaultInput: () => [64, 34, 25, 12, 22, 11, 90, 45, 33, 77],
  run: bubbleSortGenerator,
};
