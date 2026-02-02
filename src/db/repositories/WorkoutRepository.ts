import { BaseRepository } from './BaseRepository';
import { WorkoutSession, ExerciseMaster } from '../../types/workout';
import { IStorageAdapter } from '../interfaces/IStorageAdapter';

const SESSIONS_COLLECTION = 'WorkoutSessions';
const EXERCISES_COLLECTION = 'ExerciseMaster';

export class WorkoutRepository extends BaseRepository<WorkoutSession> {
  constructor(adapter: IStorageAdapter) {
    super(adapter);
  }

  async getAllSessions(forceRefresh = false): Promise<WorkoutSession[]> {
    const records = await this.fetchWithCache(SESSIONS_COLLECTION, undefined, forceRefresh);
    return records.map(this.mapToWorkoutSession).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async findSessionsByDateRange(start: Date, end: Date): Promise<WorkoutSession[]> {
    const all = await this.getAllSessions();
    return all.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= start && sessionDate <= end;
    });
  }

  async saveSession(session: WorkoutSession): Promise<void> {
    const data = {
      ...session,
      exercises: JSON.stringify(session.exercises),
      createdAt: session.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (session.id) {
      await this.adapter.update(SESSIONS_COLLECTION, String(session.id), data);
    } else {
      await this.adapter.create(SESSIONS_COLLECTION, data);
    }

    this.invalidateCache(SESSIONS_COLLECTION);
  }

  async deleteSession(id: number): Promise<void> {
    await this.adapter.delete(SESSIONS_COLLECTION, String(id));
    this.invalidateCache(SESSIONS_COLLECTION);
  }

  // Exercise Master operations
  async getAllExercises(forceRefresh = false): Promise<ExerciseMaster[]> {
    const records = await this.fetchWithCache(EXERCISES_COLLECTION, undefined, forceRefresh);
    return records.map(this.mapToExerciseMaster);
  }

  async searchExercises(query: string): Promise<ExerciseMaster[]> {
    const all = await this.getAllExercises();
    const lowerQuery = query.toLowerCase();
    return all.filter(exercise =>
      exercise.name.toLowerCase().includes(lowerQuery)
    );
  }

  async saveExercise(exercise: ExerciseMaster): Promise<void> {
    const data = {
      ...exercise,
      createdAt: exercise.createdAt || new Date(),
    };

    if (exercise.id) {
      await this.adapter.update(EXERCISES_COLLECTION, String(exercise.id), data);
    } else {
      await this.adapter.create(EXERCISES_COLLECTION, data);
    }

    this.invalidateCache(EXERCISES_COLLECTION);
  }

  private mapToWorkoutSession(data: any): WorkoutSession {
    let exercises = [];
    try {
      exercises = typeof data.exercises === 'string'
        ? JSON.parse(data.exercises)
        : data.exercises || [];
    } catch (e) {
      console.error('Error parsing exercises:', e);
    }

    return {
      id: data.id ? Number(data.id) : undefined,
      date: data.date,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
      exercises,
      totalVolume: Number(data.totalVolume || 0),
      memo: data.memo,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    };
  }

  private mapToExerciseMaster(data: any): ExerciseMaster {
    return {
      id: data.id ? Number(data.id) : undefined,
      name: data.name,
      bodyPart: data.bodyPart,
      isCompound: data.isCompound === 'true' || data.isCompound === true,
      isCustom: data.isCustom === 'true' || data.isCustom === true,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
    };
  }
}
