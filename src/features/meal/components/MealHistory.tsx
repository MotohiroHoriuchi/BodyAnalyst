import { MealRecord } from '../../../types/meal';

interface MealHistoryProps {
  records: MealRecord[];
  loading: boolean;
}

export function MealHistory({ records, loading }: MealHistoryProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">まだ記録がありません</p>
      </div>
    );
  }

  const getMealTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      breakfast: '朝食',
      lunch: '昼食',
      dinner: '夕食',
      snack: '間食',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">記録履歴</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日付</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">食事</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">カロリー</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">F</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">C</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getMealTypeLabel(record.mealType)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {record.totalCalories} kcal
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.totalProtein}g
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.totalFat}g
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.totalCarbs}g
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
