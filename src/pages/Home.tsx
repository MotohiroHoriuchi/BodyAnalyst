import { useEffect, useState } from 'react';
import { Scale, TrendingDown, TrendingUp, Minus, Plus, Dumbbell, TrendingUp as ChartIcon } from 'lucide-react';
import { Header, Card, CircularProgress, Drawer } from '../components/common';
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
        <Card className="flex flex-col items-center py-8 animate-fade-in">
          <h2 className="text-sm font-semibold text-neutral-600 uppercase tracking-wide mb-6">Today's Progress</h2>
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
          <Card onClick={() => setIsWeightModalOpen(true)} className="animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-semibold text-neutral-700">体重</span>
              </div>
              <Plus className="w-4 h-4 text-neutral-400" />
            </div>
            {todayRecord ? (
              <>
                <p className="text-2xl font-bold text-neutral-900 tracking-tight">
                  {formatWeight(todayRecord.weight).replace(' kg', '')}
                  <span className="text-sm font-normal text-neutral-500 ml-1">kg</span>
                </p>
                {weightChange && (
                  <div className={`flex items-center gap-1 text-sm mt-2 ${
                    weightChange.isLoss ? 'text-primary-600' : weightChange.isGain ? 'text-secondary-600' : 'text-neutral-400'
                  }`}>
                    {weightChange.isLoss ? (
                      <TrendingDown className="w-4 h-4" />
                    ) : weightChange.isGain ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <Minus className="w-4 h-4" />
                    )}
                    <span className="font-medium">{formatChange(weightChange.change)}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-base text-neutral-400 font-medium">タップして記録</p>
            )}
          </Card>

          {/* PFC Card */}
          <Card className="animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                P
              </div>
              <span className="text-sm font-semibold text-neutral-700">PFC</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 font-medium">タンパク質</span>
                <span className="font-bold text-neutral-900">{formatMacro(todayTotals.totalProtein)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 font-medium">脂質</span>
                <span className="font-bold text-neutral-900">{formatMacro(todayTotals.totalFat)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 font-medium">炭水化物</span>
                <span className="font-bold text-neutral-900">{formatMacro(todayTotals.totalCarbs)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Workout */}
        <Card className="animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 bg-gradient-to-br from-primary-400 to-primary-600 rounded-md flex items-center justify-center">
              <Dumbbell className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-neutral-700">Today's Workout</span>
          </div>
          {todaySession && todaySession.exercises.length > 0 ? (
            <>
              <p className="text-xl font-bold text-neutral-900 tracking-tight">
                {formatVolume(todaySession.totalVolume)}
              </p>
              {workoutBodyParts && (
                <p className="text-sm text-neutral-500 mt-2 font-medium">{workoutBodyParts}</p>
              )}
            </>
          ) : (
            <p className="text-neutral-400 font-medium">トレーニングを開始しましょう</p>
          )}
        </Card>

        {/* Weekly Trend */}
        {chartData.length > 1 && (
          <Card className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-gradient-to-br from-neutral-300 to-neutral-500 rounded-md flex items-center justify-center">
                <ChartIcon className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-neutral-700">Weekly Trend</span>
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#948B7E', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 11, fill: '#948B7E', fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #D4CFC7',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '8px 12px',
                    }}
                    formatter={(value) => [`${value} kg`, '体重']}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3D8B6A"
                    strokeWidth={3}
                    dot={{ fill: '#3D8B6A', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </main>

      {/* Weight Input Drawer */}
      <Drawer
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
        title="体重を記録"
      >
        <div className="flex-1 overflow-y-auto">
          <WeightInput onComplete={() => setIsWeightModalOpen(false)} />
        </div>
      </Drawer>
    </div>
  );
}
