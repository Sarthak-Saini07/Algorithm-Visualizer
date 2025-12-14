import { AlgorithmSnapshot, AlgorithmGenerator, AlgorithmConfig } from '../algorithms/types';

export interface Runner {
  snapshots: AlgorithmSnapshot[];
  currentIndex: number;
  isComplete: boolean;
  generator: AlgorithmGenerator | null;
}

export function createRunner(config: AlgorithmConfig, input?: any): Runner {
  const actualInput = input ?? config.defaultInput();
  const generator = config.run(actualInput);
  
  // Collect all snapshots
  const snapshots: AlgorithmSnapshot[] = [];
  let result = generator.next();
  
  while (!result.done) {
    if (result.value) {
      snapshots.push(result.value);
    }
    result = generator.next();
  }
  
  return {
    snapshots,
    currentIndex: 0,
    isComplete: false,
    generator: null,
  };
}

export function stepForward(runner: Runner): Runner {
  if (runner.currentIndex >= runner.snapshots.length - 1) {
    return { ...runner, isComplete: true };
  }
  
  return {
    ...runner,
    currentIndex: runner.currentIndex + 1,
    isComplete: runner.currentIndex + 1 >= runner.snapshots.length - 1,
  };
}

export function stepBackward(runner: Runner): Runner {
  if (runner.currentIndex <= 0) {
    return runner;
  }
  
  return {
    ...runner,
    currentIndex: runner.currentIndex - 1,
    isComplete: false,
  };
}

export function goToStep(runner: Runner, step: number): Runner {
  const clampedStep = Math.max(0, Math.min(step, runner.snapshots.length - 1));
  
  return {
    ...runner,
    currentIndex: clampedStep,
    isComplete: clampedStep >= runner.snapshots.length - 1,
  };
}

export function reset(runner: Runner): Runner {
  return {
    ...runner,
    currentIndex: 0,
    isComplete: false,
  };
}

export function getCurrentSnapshot(runner: Runner): AlgorithmSnapshot | null {
  if (runner.snapshots.length === 0) return null;
  return runner.snapshots[runner.currentIndex];
}
