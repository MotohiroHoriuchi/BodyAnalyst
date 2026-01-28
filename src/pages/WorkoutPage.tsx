import { useWorkout } from '../features/workout';

export function WorkoutPage() {
  const { sessions, loading } = useWorkout();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Workout</h1>

      {loading && <p>Loading...</p>}

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          {sessions.length === 0
            ? 'No workout sessions yet. Start logging your training!'
            : `You have ${sessions.length} workout sessions.`}
        </p>
      </div>
    </div>
  );
}
