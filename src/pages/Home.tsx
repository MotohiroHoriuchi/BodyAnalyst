import { useEffect, useState } from 'react';
import { Scale, TrendingDown, TrendingUp, Minus, Plus } from 'lucide-react';
import { Header, Card, CircularProgress, Modal } from '../components/common';
import { WeightInput } from '../components/weight';
import { useWeightRecords, useMealRecords, useWorkoutSessions, useGoals } from '../hooks';
import { formatWeight, formatCalories, formatMacro, formatVolume, formatChange, formatBodyPart } from '../utils/formatters';
import { calculateWeightChange } from '../utils/calculations';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { formatDate } from '../utils/dateUtils';

export function Home() {
  const { todayRecord, recentRecords } = useWeightRecords();
  const { getTodayTotals } = useMealRecords();
  const { todaySession } = useWorkoutSessions();
  const { currentGoal } = useGoals();
  const [previousWeight, setPreviousWeight] = useState<number | null>(null);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  const todayTotals = getTodayTotals();

  useEffect(() => {
    if (recentRecords && recentRecords.length > 1) {
      const sorted = [...recentRecords].sort((a, b) => b.date.localeCompare(a.date));
      if (sorted.length > 1) {
        setPreviousWeight(sorted[1].weight);
      }
    }
  }, [recentRecords]);

  const weightChange = todayRecord && previousWeight
    ? calculateWeightChange(todayRecord.weight, previousWeight)
    : null;

  
  const chartData = recentRecords
    ?.slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(record => ({
      date: formatDate(record.date, 'M/d'),
      weight: record.weight,
    })) || [];

  const workoutBodyParts = todaySession?.exercises
    .map(e => e.bodyPart)
    .filter((v, i, a) => a.indexOf(v) === i)
    .map(formatBodyPart)
    .join('・') || '';

  return (
    <div className="flex flex-col min-h-full">
      <Header title="Body Analyst" showSettings />

      <main className="flex-1 px-4 py-4 pb-24 space-y-4 max-w-lg mx-auto w-full">
        {/* Today's Progress */}
        <Card className="flex flex-col items-center py-6">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Today's Progress</h2>
          <CircularProgress
            value={todayTotals.totalCalories}
            max={currentGoal?.targetCalories || 2000}
            label={`${formatCalories(todayTotals.totalCalories).replace(' kcal', '')}`}
            sublabel={`/ ${currentGoal?.targetCalories || 2000} kcal`}
          />
        </Card>

        {/* Weight & PFC Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Weight Card */}
          <Card onClick={() => setIsWeightModalOpen(true)}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-500">体重</span>
              </div>
              <Plus className="w-4 h-4 text-gray-400" />
            </div>
            {todayRecord ? (
              <>
                <p className="text-2xl font-bold text-gray-900">
                  {formatWeight(todayRecord.weight).replace(' kg', '')}
                  <span className="text-sm font-normal text-gray-500 ml-1">kg</span>
                </p>
                {weightChange && (
                  <div className={`flex items-center gap-1 text-sm mt-1 ${
                    weightChange.isLoss ? 'text-green-500' : weightChange.isGain ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {weightChange.isLoss ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : weightChange.isGain ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                    <span>{formatChange(weightChange.change)}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-lg text-gray-400">タップして記録</p>
            )}
          </Card>

          {/* PFC Card */}
          <Card>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">💪</span>
              <span className="text-sm font-medium text-gray-500">PFC</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">P</span>
                <span className="font-medium">{formatMacro(todayTotals.totalProtein)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">F</span>
                <span className="font-medium">{formatMacro(todayTotals.totalFat)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">C</span>
                <span className="font-medium">{formatMacro(todayTotals.totalCarbs)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Workout */}
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🏋️</span>
            <span className="text-sm font-medium text-gray-500">Today's Workout</span>
          </div>
          {todaySession && todaySession.exercises.length > 0 ? (
            <>
              <p className="text-xl font-bold text-gray-900">
                Volume: {formatVolume(todaySession.totalVolume)}
              </p>
              {workoutBodyParts && (
                <p className="text-sm text-gray-500 mt-1">{workoutBodyParts}</p>
              )}
            </>
          ) : (
            <p className="text-gray-400">トレーニングを開始しましょう</p>
          )}
        </Card>

        {/* Weekly Trend */}
        {chartData.length > 1 && (
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm">📈</span>
              <span className="text-sm font-medium text-gray-500">Weekly Trend</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12, fill: '#6B7280' }}
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
                    formatter={(value) => [`${value} kg`, '体重']}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3F83F8"
                    strokeWidth={2}
                    dot={{ fill: '#3F83F8', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </main>

      {/* Weight Input Modal */}
      <Modal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        title="体重を記録"
      >
        <WeightInput onComplete={() => setIsWeightModalOpen(false)} />
      </Modal>
    </div>
  );
}
