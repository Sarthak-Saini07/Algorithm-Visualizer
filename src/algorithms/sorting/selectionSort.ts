import { AlgorithmConfig, AlgorithmGenerator, ArrayElement } from '../types';

function* selectionSortGenerator(input: number[]): AlgorithmGenerator {
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
    message: 'Starting Selection Sort. We will find the minimum element and place it at the beginning.',
  };

  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Reset states
    arr.forEach((e, idx) => {
      if (idx < i) e.state = 'sorted';
      else e.state = 'default';
    });

    arr[i].state = 'pivot';

    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
      metrics: { comparisons, swaps, operations },
      message: `Starting pass ${i + 1}. Looking for minimum in unsorted portion starting at index ${i}.`,
    };

    for (let j = i + 1; j < n; j++) {
      arr[j].state = 'comparing';
      comparisons++;
      operations++;

      yield {
        stepIndex: stepIndex++,
        visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
        metrics: { comparisons, swaps, operations },
        message: `Comparing ${arr[j].value} with current minimum ${arr[minIdx].value}`,
      };

      if (arr[j].value < arr[minIdx].value) {
        if (minIdx !== i) {
          arr[minIdx].state = 'default';
        }
        minIdx = j;
        arr[minIdx].state = 'pivot';

        yield {
          stepIndex: stepIndex++,
          visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
          metrics: { comparisons, swaps, operations },
          message: `Found new minimum: ${arr[minIdx].value} at index ${minIdx}`,
        };
      } else {
        arr[j].state = 'default';
      }
    }

    if (minIdx !== i) {
      arr[i].state = 'swapping';
      arr[minIdx].state = 'swapping';

      yield {
        stepIndex: stepIndex++,
        visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
        metrics: { comparisons, swaps, operations },
        message: `Swapping ${arr[i].value} at index ${i} with minimum ${arr[minIdx].value} at index ${minIdx}`,
      };

      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
      swaps++;
      operations++;
    }

    arr[i].state = 'sorted';

    yield {
      stepIndex: stepIndex++,
      visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
      metrics: { comparisons, swaps, operations },
      message: `Element ${arr[i].value} is now in its final sorted position at index ${i}.`,
    };
  }

  arr[n - 1].state = 'sorted';

  yield {
    stepIndex: stepIndex++,
    visualState: { type: 'array', elements: arr.map(e => ({ ...e })) },
    metrics: { comparisons, swaps, operations },
    message: `Selection Sort complete! Total: ${comparisons} comparisons, ${swaps} swaps.`,
  };
}

export const selectionSort: AlgorithmConfig = {
  info: {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'sorting',
    description: 'Divides the array into sorted and unsorted portions, repeatedly finding the minimum from the unsorted portion and adding it to the sorted portion.',
    timeComplexity: {
      best: 'O(n²)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    spaceComplexity: 'O(1)',
    stable: false,
    inPlace: true,
  },
  defaultInput: () => [64, 34, 25, 12, 22, 11, 90, 45, 33, 77],
  run: selectionSortGenerator,
};
