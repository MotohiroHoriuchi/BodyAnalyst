import { useState, useEffect, useMemo } from 'react';
import { Header, Card } from '../components/common';
import { useWeightRecords, useGoals, useSettings } from '../hooks';
import { formatDate, getDateRange } from '../utils/dateUtils';
import { formatWeight, formatCalories, formatVolume } from '../utils/formatters';
import { calculateOneRm, OneRmFormula } from '../utils/oneRmCalculations';
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
import { db, WorkoutSession } from '../db/database';
import { ChevronDown } from 'lucide-react';

type Period = 'week' | 'month' | 'year';
type ExerciseMetric = 'volume' | 'max1rm' | 'maxWeight';

const periodDays: Record<Period, number> = {
  week: 7,
  month: 30,
  year: 365,
};

const metricLabels: Record<ExerciseMetric, string> = {
  volume: 'ボリューム',
  max1rm: 'MAX 1RM（推定）',
  maxWeight: '最大挙上重量',
};

interface ExerciseDataPoint {
  date: string;
  value: number;
}

export function Analytics() {
  const [period, setPeriod] = useState<Period>('week');
  const { getRecordsInRange } = useWeightRecords();
  const { currentGoal } = useGoals();
  const { settings } = useSettings();

  const [weightData, setWeightData] = useState<{ date: string; weight: number }[]>([]);
  const [calorieData, setCalorieData] = useState<{ date: string; calories: number }[]>([]);
  const [volumeData, setVolumeData] = useState<{ date: string; volume: number }[]>([]);
  const [workoutSessions, setWorkoutSessions] = useState<WorkoutSession[]>([]);

  // 種目別分析の状態
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [selectedMetric, setSelectedMetric] = useState<ExerciseMetric>('max1rm');
  const [exerciseData, setExerciseData] = useState<ExerciseDataPoint[]>([]);

  const oneRmFormula: OneRmFormula = settings?.oneRmFormula || 'epley';

  // 全ワークアウトから種目リストを抽出
  const exerciseList = useMemo(() => {
    const exerciseMap = new Map<number, string>();
    workoutSessions.forEach(session => {
      session.exercises.forEach(exercise => {
        if (!exerciseMap.has(exercise.exerciseId)) {
          exerciseMap.set(exercise.exerciseId, exercise.exerciseName);
        }
      });
    });
    return Array.from(exerciseMap.entries()).map(([id, name]) => ({ id, name }));
  }, [workoutSessions]);

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

      // Workout sessions data
      const workouts = await db.workoutSessions
        .where('date')
        .anyOf(dates)
        .toArray();

      // Sort by date
      workouts.sort((a, b) => a.date.localeCompare(b.date));
      setWorkoutSessions(workouts);

      // Volume data - only include sessions with volume > 0
      setVolumeData(
        workouts
          .filter(w => w.totalVolume > 0)
          .map((w) => ({
            date: formatDate(w.date, 'M/d'),
            volume: w.totalVolume,
          }))
      );
    };

    loadData();
  }, [period, getRecordsInRange]);

  // 種目別データを計算
  useEffect(() => {
    if (!selectedExercise || workoutSessions.length === 0) {
      setExerciseData([]);
      return;
    }

    const exerciseId = parseInt(selectedExercise);
    const data: ExerciseDataPoint[] = [];

    workoutSessions.forEach(session => {
      const exercise = session.exercises.find(e => e.exerciseId === exerciseId);
      if (!exercise || exercise.sets.length === 0) return;

      // ウォームアップを除いたセットのみ
      const workingSets = exercise.sets.filter(s => !s.isWarmup);
      if (workingSets.length === 0) return;

      let value = 0;

      switch (selectedMetric) {
        case 'volume':
          // 総ボリューム = Σ(weight × reps)
          value = workingSets.reduce((sum, set) => sum + set.weight * set.reps, 0);
          break;
        case 'max1rm':
          // 各セットの1RM推定値の最大値
          value = Math.max(
            ...workingSets.map(set =>
              calculateOneRm(set.weight, set.reps, oneRmFormula).estimated1RM
            )
          );
          break;
        case 'maxWeight':
          // 最大挙上重量
          value = Math.max(...workingSets.map(set => set.weight));
          break;
      }

      if (value > 0) {
        data.push({
          date: formatDate(session.date, 'M/d'),
          value: Math.round(value * 10) / 10,
        });
      }
    });

    setExerciseData(data);
  }, [selectedExercise, selectedMetric, workoutSessions, oneRmFormula]);

  // 初期選択: 最初の種目を選択
  useEffect(() => {
    if (exerciseList.length > 0 && !selectedExercise) {
      setSelectedExercise(exerciseList[0].id.toString());
    }
  }, [exerciseList, selectedExercise]);

  const targetCalories = currentGoal?.targetCalories || 2000;

  const formatMetricValue = (value: number): string => {
    if (selectedMetric === 'volume') {
      return formatVolume(value);
    }
    return `${value}kg`;
  };

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
            トレーニング総ボリューム
          </h3>
          {volumeData.length > 0 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData}>
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
                    width={50}
                    tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
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
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400">データがありません</p>
          )}
        </Card>

        {/* Exercise-specific Analysis */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            種目別分析
          </h3>

          {exerciseList.length > 0 ? (
            <>
              {/* Exercise Selector */}
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">種目</label>
                <div className="relative">
                  <select
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="w-full px-3 py-2 pr-8 bg-gray-100 rounded-lg text-gray-900 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {exerciseList.map((exercise) => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Metric Selector */}
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-4">
                {(['max1rm', 'volume', 'maxWeight'] as ExerciseMetric[]).map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      selectedMetric === metric
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {metricLabels[metric]}
                  </button>
                ))}
              </div>

              {/* Chart */}
              {exerciseData.length > 0 ? (
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={exerciseData}>
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
                        width={50}
                        tickFormatter={(value) =>
                          selectedMetric === 'volume' && value >= 1000
                            ? `${(value / 1000).toFixed(0)}k`
                            : value
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value) => [formatMetricValue(value as number), metricLabels[selectedMetric]]}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ fill: '#8B5CF6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center py-8 text-gray-400">
                  この期間のデータがありません
                </p>
              )}
            </>
          ) : (
            <p className="text-center py-8 text-gray-400">
              トレーニング記録がありません
            </p>
          )}
        </Card>
      </main>
    </div>
  );
}
