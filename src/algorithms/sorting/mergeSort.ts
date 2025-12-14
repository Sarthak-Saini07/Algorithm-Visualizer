import { AlgorithmConfig, AlgorithmGenerator, ArrayElement } from '../types';

function* mergeSortGenerator(input: number[]): AlgorithmGenerator {
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
    message: 'Starting Merge Sort. We will divide the array into halves, sort them, and merge.',
  };

  function* mergeSort(left: number, right: number): Generator<void, void, unknown> {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Highlight the current division
    arr.forEach((e, idx) => {
      if (idx >= left && idx <= right) {
        e.state = 'comparing';
      } else if (e.state !== 'sorted') {
        e.state = 'default';
      }
    });

    operations++;
    yield;

    // Sort left half
    yield* mergeSort(left, mid);
    // Sort right half
    yield* mergeSort(mid + 1, right);
    // Merge the two halves
    yield* merge(left, mid, right);
  }

  function* merge(left: number, mid: number, right: number): Generator<void, void, unknown> {
    const leftArr: ArrayElement[] = [];
    const rightArr: ArrayElement[] = [];

    for (let i = left; i <= mid; i++) {
      leftArr.push({ ...arr[i] });
    }
    for (let i = mid + 1; i <= right; i++) {
      rightArr.push({ ...arr[i] });
    }

    // Highlight merge operation
    arr.forEach((e, idx) => {
      if (idx >= left && idx <= right) {
        e.state = 'comparing';
      } else if (e.state !== 'sorted') {
        e.state = 'default';
      }
    });

    yield;

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      operations++;

      if (leftArr[i].value <= rightArr[j].value) {
        arr[k] = { ...leftArr[i], state: 'swapping' };
        i++;
      } else {
        arr[k] = { ...rightArr[j], state: 'swapping' };
        j++;
      }
      swaps++;
      k++;

      yield;
    }

    while (i < leftArr.length) {
      arr[k] = { ...leftArr[i], state: 'swapping' };
      i++;
      k++;
      operations++;
      yield;
    }

    while (j < rightArr.length) {
      arr[k] = { ...rightArr[j], state: 'swapping' };
      j++;
      k++;
      operations++;
      yield;
    }

    // Mark merged section
    for (let idx = left; idx <= right; idx++) {
      arr[idx].state = right === arr.length - 1 && left === 0 ? 'sorted' : 'default';
    }

    yield;
  }

  const generator = mergeSort(0, arr.length - 1);
  let result = generator.next();

  while (!result.done) {
    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
      metrics: { comparisons, swaps, operations },
      message: `Merge Sort in progress... Comparisons: ${comparisons}, Merges: ${swaps}`,
    };
    result = generator.next();
  }

  arr.forEach(e => e.state = 'sorted');

  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
    metrics: { comparisons, swaps, operations },
    message: `Merge Sort complete! Total: ${comparisons} comparisons, ${swaps} merge operations.`,
  };
}

export const mergeSort: AlgorithmConfig = {
  info: {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    description: 'A divide-and-conquer algorithm that divides the array into halves, recursively sorts them, and then merges the sorted halves.',
    timeComplexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    spaceComplexity: 'O(n)',
    stable: true,
    inPlace: false,
  },
  defaultInput: () => [64, 34, 25, 12, 22, 11, 90, 45, 33, 77],
  run: mergeSortGenerator,
};
