import { useWeight, WeightInput, WeightHistory } from '../features/weight';

export function WeightPage() {
  const { records, loading, saveRecord, refresh } = useWeight();

  const handleSave = async (record: any) => {
    await saveRecord(record);
    refresh();
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">体重記録</h1>

      <WeightInput onSave={handleSave} />

      <WeightHistory records={records} loading={loading} />
    </div>
  );
}
