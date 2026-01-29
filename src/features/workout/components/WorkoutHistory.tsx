import { WorkoutSession } from '../../../types/workout';

interface WorkoutHistoryProps {
  sessions: WorkoutSession[];
  loading: boolean;
}

export function WorkoutHistory({ sessions, loading }: WorkoutHistoryProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">まだ記録がありません</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">記録履歴</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {sessions.map((session) => (
          <div key={session.id} className="p-6 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-500">{session.date}</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  Total Volume: {session.totalVolume.toLocaleString()} kg
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {session.exercises.map((exercise, idx) => (
                <div key={idx} className="bg-gray-50 rounded p-3">
                  <p className="font-medium text-gray-900">{exercise.exerciseName}</p>
                  <p className="text-sm text-gray-600">
                    {exercise.sets.length} sets × {exercise.sets[0]?.reps} reps @ {exercise.sets[0]?.weight} kg
                  </p>
                </div>
              ))}
            </div>
            {session.memo && (
              <p className="mt-3 text-sm text-gray-600">メモ: {session.memo}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
