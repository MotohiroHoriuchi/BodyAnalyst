import { useState, useEffect } from 'react';
import { Play, Square, Plus, Clock } from 'lucide-react';
import { Header, Button, Card, Modal } from '../components/common';
import { ExerciseCard, ExerciseSearch, RestTimer, WorkoutHistory } from '../components/workout';
import { useWorkoutSessions, useSettings } from '../hooks';
import { ExerciseMaster, WorkoutExercise, WorkoutSet } from '../db/database';
import { formatVolume, formatDuration } from '../utils/formatters';

export function Workout() {
  const {
    todaySession,
    recentSessions,
    startSession,
    endSession,
    addExercise,
    updateExercise,
    removeExercise,
  } = useWorkoutSessions();
  const { settings } = useSettings();

  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Check for active session
  useEffect(() => {
    if (todaySession && !todaySession.endTime) {
      setIsActive(true);
      setSessionId(todaySession.id!);
    }
  }, [todaySession]);

  // Elapsed time counter
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && todaySession) {
      const startTime = new Date(todaySession.startTime).getTime();

      const updateElapsed = () => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      };

      updateElapsed();
      interval = setInterval(updateElapsed, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, todaySession]);

  const handleStartWorkout = async () => {
    const id = await startSession();
    if (id) {
      setSessionId(id);
      setIsActive(true);
    }
  };

  const handleEndWorkout = async () => {
    if (sessionId) {
      await endSession(sessionId);
      setIsActive(false);
      setSessionId(null);
      setElapsedTime(0);
    }
  };

  const handleAddExercise = async (exercise: ExerciseMaster) => {
    if (!sessionId) return;

    const newExercise: WorkoutExercise = {
      exerciseId: exercise.id!,
      exerciseName: exercise.name,
      bodyPart: exercise.bodyPart,
      sets: [],
      restTimes: [],
    };

    await addExercise(sessionId, newExercise);
    setIsAddingExercise(false);
  };

  const handleAddSet = async (exerciseIndex: number, set: WorkoutSet) => {
    if (!sessionId || !todaySession) return;

    const exercise = todaySession.exercises[exerciseIndex];
    const updatedExercise: WorkoutExercise = {
      ...exercise,
      sets: [...exercise.sets, set],
    };

    await updateExercise(sessionId, exerciseIndex, updatedExercise);
  };

  const handleRemoveExercise = async (exerciseIndex: number) => {
    if (!sessionId) return;
    await removeExercise(sessionId, exerciseIndex);
  };

  const oneRmFormula = settings?.oneRmFormula || 'epley';

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="🏋️ トレーニング"
        rightAction={
          isActive && (
            <div className="flex items-center gap-2 text-primary-500">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{formatDuration(elapsedTime)}</span>
            </div>
          )
        }
      />

      <main className="flex-1 px-4 py-4 pb-24 space-y-4 max-w-lg mx-auto w-full">
        {!isActive ? (
          <>
            {/* Start Workout Button */}
            <Button onClick={handleStartWorkout} fullWidth size="lg">
              <Play className="w-5 h-5 mr-2" />
              新しいワークアウトを開始
            </Button>

            {/* History */}
            <WorkoutHistory sessions={recentSessions} />
          </>
        ) : (
          <>
            {/* Active Workout Header */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">総ボリューム</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatVolume(todaySession?.totalVolume || 0)}
                  </p>
                </div>
                <Button variant="secondary" onClick={handleEndWorkout}>
                  <Square className="w-4 h-4 mr-2" />
                  終了
                </Button>
              </div>
            </Card>

            {/* Exercise List */}
            {todaySession?.exercises.map((exercise, index) => (
              <ExerciseCard
                key={index}
                exercise={exercise}
                oneRmFormula={oneRmFormula}
                onAddSet={(set) => handleAddSet(index, set)}
                onRemove={() => handleRemoveExercise(index)}
              />
            ))}

            {/* Add Exercise Button */}
            <Button
              variant="secondary"
              onClick={() => setIsAddingExercise(true)}
              fullWidth
            >
              <Plus className="w-5 h-5 mr-2" />
              種目を追加
            </Button>

            {/* Rest Timer */}
            <RestTimer />
          </>
        )}
      </main>

      {/* Add Exercise Modal */}
      <Modal
        isOpen={isAddingExercise}
        onClose={() => setIsAddingExercise(false)}
        title="種目を追加"
      >
        <div className="p-4">
          <ExerciseSearch onSelect={handleAddExercise} />
        </div>
      </Modal>
    </div>
  );
}
