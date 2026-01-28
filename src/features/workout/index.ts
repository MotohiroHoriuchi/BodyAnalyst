// Workout Module Public API
export { useWorkout } from './hooks/useWorkout';
export { useExercise } from './hooks/useExercise';
export { useBodyweightLoad } from './hooks/useBodyweightLoad';
export { useOneRM } from './hooks/useOneRM';
export { calculateOneRM, calculateVolume, type OneRMFormula } from './utils/oneRmCalculator';
export type { WorkoutSession, WorkoutExercise, WorkoutSet, ExerciseMaster } from './types';
