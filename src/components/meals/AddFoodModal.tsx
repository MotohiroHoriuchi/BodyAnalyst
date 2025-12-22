import { useState } from 'react';
import { Drawer, NumberStepper, Button } from '../common';
import { FoodSearch } from './FoodSearch';
import { FoodMaster, MealItem, MealRecord } from '../../db/database';
import { calculateNutrition } from '../../utils/calculations';
import { formatCalories, formatMacro } from '../../utils/formatters';

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealRecord['mealType'];
  onAdd: (item: MealItem) => void;
}

export function AddFoodModal({ isOpen, onClose, onAdd }: AddFoodModalProps) {
  const [selectedFood, setSelectedFood] = useState<FoodMaster | null>(null);
  const [amount, setAmount] = useState(100);

  const nutrition = selectedFood
    ? calculateNutrition(
        selectedFood.caloriesPer100g,
        selectedFood.proteinPer100g,
        selectedFood.fatPer100g,
        selectedFood.carbsPer100g,
        amount
      )
    : null;

  const handleAdd = () => {
    if (!selectedFood || !nutrition) return;

    const item: MealItem = {
      foodId: selectedFood.id!,
      foodName: selectedFood.name,
      amount,
      ...nutrition,
    };

    onAdd(item);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFood(null);
    setAmount(100);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={handleClose} title="食事を追加">
      <div className="flex flex-col h-full">
        {/* 追加ボタン - 上部に配置（食材選択時のみ） */}
        {selectedFood && (
          <div className="flex-shrink-0 p-4 border-b border-gray-100 bg-white">
            <Button onClick={handleAdd} fullWidth size="lg">
              追加する
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!selectedFood ? (
            <FoodSearch onSelect={setSelectedFood} />
          ) : (
            <div className="bg-primary-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{selectedFood.name}</h3>
                <button
                  onClick={() => setSelectedFood(null)}
                  className="text-sm text-primary-500 font-medium"
                >
                  変更
                </button>
              </div>

              {/* Amount Input */}
              <div className="flex justify-center mb-4">
                <NumberStepper
                  value={amount}
                  onChange={setAmount}
                  min={1}
                  max={1000}
                  step={10}
                  unit="g"
                  size="md"
                />
              </div>

              {/* Nutrition Info */}
              {nutrition && (
                <div className="grid grid-cols-4 gap-2 text-center text-sm">
                  <div>
                    <p className="text-gray-500">Cal</p>
                    <p className="font-semibold text-gray-900">
                      {formatCalories(nutrition.calories).replace(' kcal', '')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">P</p>
                    <p className="font-semibold text-gray-900">
                      {formatMacro(nutrition.protein)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">F</p>
                    <p className="font-semibold text-gray-900">
                      {formatMacro(nutrition.fat)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">C</p>
                    <p className="font-semibold text-gray-900">
                      {formatMacro(nutrition.carbs)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
