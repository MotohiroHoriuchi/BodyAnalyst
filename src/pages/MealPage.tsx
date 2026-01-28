import { useMeal } from '../features/meal';

export function MealPage() {
  const { records, loading } = useMeal();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Meals</h1>

      {loading && <p>Loading...</p>}

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">
          {records.length === 0
            ? 'No meal records yet. Start tracking your nutrition!'
            : `You have ${records.length} meal records.`}
        </p>
      </div>
    </div>
  );
}
