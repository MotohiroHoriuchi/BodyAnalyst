import { useWorkout, WorkoutInput, WorkoutHistory } from '../features/workout';

export function WorkoutPage() {
  const { sessions, loading, saveSession, refresh } = useWorkout();

  const handleSave = async (session: any) => {
    await saveSession(session);
    refresh();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">トレーニング記録</h1>

      <WorkoutInput onSave={handleSave} />

      <WorkoutHistory sessions={sessions} loading={loading} />
    </div>
  );
}
