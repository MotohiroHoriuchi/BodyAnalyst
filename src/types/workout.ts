// Workout Data Types
export interface ExerciseMaster {
  id?: number;
  name: string;
  bodyPart: 'chest' | 'back' | 'shoulder' | 'arm' | 'leg' | 'core' | 'other';
  isCompound: boolean;
  isCustom: boolean;
  createdAt: Date;
}

export interface WorkoutSet {
  setNumber: number;
  weight: number; // kg
  reps: number;
  rpe?: number; // 1-10
  isWarmup: boolean;
  completedAt: Date;
}

export interface WorkoutExercise {
  exerciseId: number;
  exerciseName: string;
  bodyPart: string;
  sets: WorkoutSet[];
  restTimes: number[]; // seconds
}

export interface WorkoutSession {
  id?: number;
  date: string; // YYYY-MM-DD
  startTime: Date;
  endTime?: Date;
  exercises: WorkoutExercise[];
  totalVolume: number;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}
