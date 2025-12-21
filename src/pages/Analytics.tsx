import { useState, useEffect } from 'react';
import { Header, Card } from '../components/common';
import { useWeightRecords, useGoals } from '../hooks';
import { formatDate, getDateRange } from '../utils/dateUtils';
import { formatWeight, formatCalories, formatVolume } from '../utils/formatters';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { db } from '../db/database';

type Period = 'week' | 'month' | 'year';

const periodDays: Record<Period, number> = {
  week: 7,
  month: 30,
  year: 365,
};

export function Analytics() {
  const [period, setPeriod] = useState<Period>('week');
  const { getRecordsInRange } = useWeightRecords();
  const { currentGoal } = useGoals();

  const [weightData, setWeightData] = useState<{ date: string; weight: number }[]>([]);
  const [calorieData, setCalorieData] = useState<{ date: string; calories: number }[]>([]);
  const [volumeData, setVolumeData] = useState<{ date: string; volume: number }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const days = periodDays[period];
      const dates = getDateRange(days);

      // Weight data
      const weights = await getRecordsInRange(days);
      const weightMap = new Map(weights.map((w) => [w.date, w.weight]));
      setWeightData(
        dates
          .filter((date) => weightMap.has(date))
          .map((date) => ({
            date: formatDate(date, 'M/d'),
            weight: weightMap.get(date)!,
          }))
      );

      // Calorie data
      const meals = await db.mealRecords
        .where('date')
        .anyOf(dates)
        .toArray();
      const calorieMap = new Map<string, number>();
      meals.forEach((meal) => {
        const current = calorieMap.get(meal.date) || 0;
        calorieMap.set(meal.date, current + meal.totalCalories);
      });
      setCalorieData(
        dates
          .filter((date) => calorieMap.has(date))
          .map((date) => ({
            date: formatDate(date, 'M/d'),
            calories: calorieMap.get(date)!,
          }))
      );

      // Volume data
      const workouts = await db.workoutSessions
        .where('date')
        .anyOf(dates)
        .toArray();
      setVolumeData(
        workouts.map((w) => ({
          date: formatDate(w.date, 'M/d'),
          volume: w.totalVolume,
        }))
      );
    };

    loadData();
  }, [period, getRecordsInRange]);

  const targetCalories = currentGoal?.targetCalories || 2000;

  return (
    <div className="flex flex-col min-h-full">
      <Header title="📊 分析" />

      <main className="flex-1 px-4 py-4 pb-24 space-y-4 max-w-lg mx-auto w-full">
        {/* Period Selector */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          {(['week', 'month', 'year'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                period === p
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p === 'week' ? '週' : p === 'month' ? '月' : '年'}
            </button>
          ))}
        </div>

        {/* Weight Chart */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">体重推移</h3>
          {weightData.length > 1 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [formatWeight(value as number), '体重']}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3F83F8"
                    strokeWidth={2}
                    dot={{ fill: '#3F83F8', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400">データがありません</p>
          )}
        </Card>

        {/* Calorie Chart */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">カロリー推移</h3>
          {calorieData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={calorieData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [formatCalories(value as number), 'カロリー']}
                  />
                  <ReferenceLine
                    y={targetCalories}
                    stroke="#EF4444"
                    strokeDasharray="5 5"
                    label={{ value: '目標', position: 'right', fontSize: 10, fill: '#EF4444' }}
                  />
                  <Bar dataKey="calories" fill="#3F83F8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400">データがありません</p>
          )}
        </Card>

        {/* Volume Chart */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            トレーニングボリューム
          </h3>
          {volumeData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                    width={45}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [formatVolume(value as number), 'ボリューム']}
                  />
                  <Bar dataKey="volume" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400">データがありません</p>
          )}
        </Card>
      </main>
    </div>
  );
}
