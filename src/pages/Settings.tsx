import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header, Card, Button, Modal, NumberStepper } from '../components/common';
import { useGoals, useSettings } from '../hooks';
import { oneRmFormulas, OneRmFormula } from '../utils/oneRmCalculations';
import { formatGoalType, goalTypeLabels } from '../utils/formatters';

export function Settings() {
  const { currentGoal, updateGoal } = useGoals();
  const { settings, setOneRmFormula } = useSettings();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);

  // Goal form state
  const [goalType, setGoalType] = useState(currentGoal?.goalType || 'maintain');
  const [targetWeight, setTargetWeight] = useState(currentGoal?.targetWeight || 70);
  const [targetCalories, setTargetCalories] = useState(currentGoal?.targetCalories || 2000);
  const [targetProtein, setTargetProtein] = useState(currentGoal?.targetProtein || 120);
  const [targetFat, setTargetFat] = useState(currentGoal?.targetFat || 55);
  const [targetCarbs, setTargetCarbs] = useState(currentGoal?.targetCarbs || 250);

  const handleSaveGoal = async () => {
    if (!currentGoal?.id) return;
    await updateGoal(currentGoal.id, {
      goalType: goalType as 'diet' | 'bulk' | 'maintain',
      targetWeight,
      targetCalories,
      targetProtein,
      targetFat,
      targetCarbs,
    });
    setIsGoalModalOpen(false);
  };

  const handleFormulaSelect = async (formula: OneRmFormula) => {
    await setOneRmFormula(formula);
    setIsFormulaModalOpen(false);
  };

  return (
    <div className="flex flex-col min-h-full">
      <Header
        title="設定"
        leftAction={
          <Link to="/" className="p-2 -ml-2 text-gray-500 hover:text-gray-700">
            <ChevronLeft className="w-5 h-5" />
          </Link>
        }
      />

      <main className="flex-1 px-4 py-4 pb-24 space-y-4 max-w-lg mx-auto w-full">
        {/* Goal Setting */}
        <Card onClick={() => setIsGoalModalOpen(true)}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">目標設定</h3>
              <p className="text-sm text-gray-500 mt-1">
                {currentGoal ? formatGoalType(currentGoal.goalType) : '未設定'}
                {currentGoal?.targetWeight && ` / ${currentGoal.targetWeight}kg`}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* 1RM Formula */}
        <Card onClick={() => setIsFormulaModalOpen(true)}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">1RM計算式</h3>
              <p className="text-sm text-gray-500 mt-1">
                {settings?.oneRmFormula
                  ? oneRmFormulas[settings.oneRmFormula].name
                  : 'Epley式'}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </Card>

        {/* App Info */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-2">アプリについて</h3>
          <p className="text-sm text-gray-500">Body Analyst v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">
            ボディメイクを行う人のための記録・可視化アプリ
          </p>
        </Card>
      </main>

      {/* Goal Setting Modal */}
      <Modal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        title="目標設定"
      >
        <div className="p-4 space-y-6">
          {/* Goal Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目標タイプ
            </label>
            <div className="flex gap-2">
              {(['diet', 'maintain', 'bulk'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setGoalType(type)}
                  className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                    goalType === type
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {goalTypeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Target Weight */}
          <div className="flex justify-center">
            <NumberStepper
              value={targetWeight}
              onChange={setTargetWeight}
              min={30}
              max={200}
              step={0.5}
              label="目標体重"
              unit="kg"
            />
          </div>

          {/* Target Calories */}
          <div className="flex justify-center">
            <NumberStepper
              value={targetCalories}
              onChange={setTargetCalories}
              min={1000}
              max={5000}
              step={50}
              label="目標カロリー"
              unit="kcal"
            />
          </div>

          {/* PFC Targets */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <NumberStepper
                value={targetProtein}
                onChange={setTargetProtein}
                min={0}
                max={500}
                step={5}
                label="P (g)"
                size="sm"
              />
            </div>
            <div className="flex flex-col items-center">
              <NumberStepper
                value={targetFat}
                onChange={setTargetFat}
                min={0}
                max={300}
                step={5}
                label="F (g)"
                size="sm"
              />
            </div>
            <div className="flex flex-col items-center">
              <NumberStepper
                value={targetCarbs}
                onChange={setTargetCarbs}
                min={0}
                max={600}
                step={5}
                label="C (g)"
                size="sm"
              />
            </div>
          </div>

          <Button onClick={handleSaveGoal} fullWidth size="lg">
            保存
          </Button>
        </div>
      </Modal>

      {/* 1RM Formula Modal */}
      <Modal
        isOpen={isFormulaModalOpen}
        onClose={() => setIsFormulaModalOpen(false)}
        title="1RM計算式の選択"
      >
        <div className="p-4 space-y-2">
          {Object.values(oneRmFormulas).map((formula) => (
            <button
              key={formula.id}
              onClick={() => handleFormulaSelect(formula.id)}
              className={`w-full text-left p-4 rounded-xl transition-colors ${
                settings?.oneRmFormula === formula.id
                  ? 'bg-primary-50 border-2 border-primary-500'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <h4 className="font-semibold text-gray-900">{formula.name}</h4>
              <code className="text-xs text-primary-600 block mt-1">
                {formula.formula}
              </code>
              <p className="text-sm text-gray-500 mt-2">{formula.description}</p>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
