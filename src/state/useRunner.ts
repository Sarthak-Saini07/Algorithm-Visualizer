import { useState, useCallback, useEffect, useRef } from 'react';
import { AlgorithmConfig, AlgorithmSnapshot } from '../algorithms/types';
import { 
  Runner, 
  createRunner, 
  stepForward, 
  stepBackward, 
  reset, 
  goToStep,
  getCurrentSnapshot 
} from '../core/runner';

interface UseRunnerReturn {
  currentSnapshot: AlgorithmSnapshot | null;
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  isComplete: boolean;
  speed: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  forward: () => void;
  backward: () => void;
  goTo: (step: number) => void;
  resetRunner: () => void;
  setSpeed: (speed: number) => void;
  loadAlgorithm: (config: AlgorithmConfig, input?: any) => void;
}

export function useRunner(initialConfig?: AlgorithmConfig): UseRunnerReturn {
  const [runner, setRunner] = useState<Runner | null>(() => 
    initialConfig ? createRunner(initialConfig) : null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // ms per step
  const intervalRef = useRef<number | null>(null);
  const configRef = useRef<AlgorithmConfig | null>(initialConfig ?? null);

  const currentSnapshot = runner ? getCurrentSnapshot(runner) : null;
  const currentStep = runner?.currentIndex ?? 0;
  const totalSteps = runner?.snapshots.length ?? 0;
  const isComplete = runner?.isComplete ?? false;

  const clearPlayInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    if (!runner || runner.isComplete) return;
    setIsPlaying(true);
  }, [runner]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearPlayInterval();
  }, [clearPlayInterval]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const forward = useCallback(() => {
    if (!runner) return;
    setRunner(stepForward(runner));
  }, [runner]);

  const backward = useCallback(() => {
    if (!runner) return;
    setRunner(stepBackward(runner));
  }, [runner]);

  const goTo = useCallback((step: number) => {
    if (!runner) return;
    setRunner(goToStep(runner, step));
  }, [runner]);

  const resetRunner = useCallback(() => {
    pause();
    if (configRef.current) {
      setRunner(createRunner(configRef.current));
    }
  }, [pause]);

  const loadAlgorithm = useCallback((config: AlgorithmConfig, input?: any) => {
    pause();
    configRef.current = config;
    setRunner(createRunner(config, input));
  }, [pause]);

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && runner && !runner.isComplete) {
      intervalRef.current = window.setInterval(() => {
        setRunner(prev => {
          if (!prev) return prev;
          const next = stepForward(prev);
          if (next.isComplete) {
            setIsPlaying(false);
            clearPlayInterval();
          }
          return next;
        });
      }, speed);
    } else {
      clearPlayInterval();
    }

    return clearPlayInterval;
  }, [isPlaying, speed, runner?.isComplete, clearPlayInterval]);

  // Stop playing when complete
  useEffect(() => {
    if (isComplete) {
      setIsPlaying(false);
    }
  }, [isComplete]);

  return {
    currentSnapshot,
    currentStep,
    totalSteps,
    isPlaying,
    isComplete,
    speed,
    play,
    pause,
    togglePlay,
    forward,
    backward,
    goTo,
    resetRunner,
    setSpeed,
    loadAlgorithm,
  };
}
