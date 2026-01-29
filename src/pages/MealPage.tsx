import { useMeal, MealInput, MealHistory } from '../features/meal';

export function MealPage() {
  const { records, loading, saveMeal, refresh } = useMeal();

  const handleSave = async (record: any) => {
    await saveMeal(record);
    refresh();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">食事記録</h1>

      <MealInput onSave={handleSave} />

      <MealHistory records={records} loading={loading} />
    </div>
  );
}
