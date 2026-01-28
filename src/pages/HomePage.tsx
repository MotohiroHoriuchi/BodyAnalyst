export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Welcome to BodyAnalyst</h2>
          <p className="text-gray-600">
            Track your workouts, meals, and body composition all in one place.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Today's Summary</h3>
          <p className="text-2xl font-bold">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
