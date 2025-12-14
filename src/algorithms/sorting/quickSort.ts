import { AlgorithmConfig, AlgorithmGenerator, ArrayElement } from '../types';

function* quickSortGenerator(input: number[]): AlgorithmGenerator {
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
    message: 'Starting Quick Sort. We will choose a pivot and partition the array around it.',
  };

  function* partition(low: number, high: number): Generator<number, number, unknown> {
    const pivotValue = arr[high].value;
    arr[high].state = 'pivot';

    yield stepIndex;

    let i = low - 1;

    for (let j = low; j < high; j++) {
      arr[j].state = 'comparing';
      comparisons++;
      operations++;

      yield stepIndex;

      if (arr[j].value < pivotValue) {
        i++;
        if (i !== j) {
          arr[i].state = 'swapping';
          arr[j].state = 'swapping';

          yield stepIndex;

          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          swaps++;
          operations++;

          yield stepIndex;
        }
      }

      if (arr[j].state !== 'sorted' && arr[j].state !== 'pivot') {
        arr[j].state = 'default';
      }
      if (arr[i]?.state !== 'sorted' && arr[i]?.state !== 'pivot') {
        arr[i].state = 'default';
      }
    }

    // Place pivot in correct position
    if (i + 1 !== high) {
      arr[i + 1].state = 'swapping';
      arr[high].state = 'swapping';

      yield stepIndex;

      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      swaps++;
      operations++;
    }

    arr[i + 1].state = 'sorted';

    yield stepIndex;

    return i + 1;
  }

  function* quickSort(low: number, high: number): Generator<void, void, unknown> {
    if (low < high) {
      // Reset states for current partition
      for (let i = low; i <= high; i++) {
        if (arr[i].state !== 'sorted') {
          arr[i].state = 'default';
        }
      }

      yield;

      const partitionGen = partition(low, high);
      let result = partitionGen.next();

      while (!result.done) {
        yield;
        result = partitionGen.next();
      }

      const pi = result.value;

      yield* quickSort(low, pi - 1);
      yield* quickSort(pi + 1, high);
    } else if (low === high) {
      arr[low].state = 'sorted';
      yield;
    }
  }

  const generator = quickSort(0, arr.length - 1);
  let result = generator.next();

  while (!result.done) {
    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
      metrics: { comparisons, swaps, operations },
      message: `Partitioning... Comparisons: ${comparisons}, Swaps: ${swaps}`,
    };
    result = generator.next();
  }

  arr.forEach(e => e.state = 'sorted');

  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
    metrics: { comparisons, swaps, operations },
    message: `Quick Sort complete! Total: ${comparisons} comparisons, ${swaps} swaps.`,
  };
}

export const quickSort: AlgorithmConfig = {
  info: {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    description: 'A divide-and-conquer algorithm that picks a pivot element and partitions the array around it, placing smaller elements before and larger elements after.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(log n)',
    stable: false,
    inPlace: true,
  },
  defaultInput: () => [64, 34, 25, 12, 22, 11, 90, 45, 33, 77],
  run: quickSortGenerator,
};
