// Weight Data Types
export interface WeightRecord {
  id?: number;
  date: string; // YYYY-MM-DD
  weight: number; // kg
  bodyFatPercentage?: number; // %
  muscleMass?: number; // kg
  timing?: 'morning' | 'evening' | 'other';
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}
