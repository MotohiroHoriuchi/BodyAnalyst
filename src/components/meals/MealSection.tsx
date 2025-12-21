import { Plus, Trash2 } from 'lucide-react';
import { Card } from '../common';
import { MealRecord } from '../../db/database';
import { formatCalories, mealTypeLabels, mealTypeEmojis } from '../../utils/formatters';

interface MealSectionProps {
  mealType: MealRecord['mealType'];
  meal?: MealRecord;
  onAddClick: () => void;
  onItemDelete: (itemIndex: number) => void;
}

export function MealSection({ mealType, meal, onAddClick, onItemDelete }: MealSectionProps) {
  const emoji = mealTypeEmojis[mealType];
  const label = mealTypeLabels[mealType];
  const hasItems = meal && meal.items.length > 0;

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{emoji}</span>
          <span className="font-medium text-gray-900">{label}</span>
          {hasItems && (
            <span className="text-sm text-gray-500">
              ({formatCalories(meal.totalCalories)})
            </span>
          )}
        </div>
        <button
          onClick={onAddClick}
          className="p-2 text-primary-500 hover:bg-primary-50 rounded-full transition-colors"
          aria-label="食事を追加"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {hasItems ? (
        <div className="space-y-2">
          {meal.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 pl-6 pr-2 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{item.foodName}</p>
                <p className="text-xs text-gray-500">
                  {item.amount}g - {formatCalories(item.calories)}
                </p>
              </div>
              <button
                onClick={() => onItemDelete(index)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="削除"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <button
          onClick={onAddClick}
          className="w-full py-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          タップして追加
        </button>
      )}
    </Card>
  );
}
