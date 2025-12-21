import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { FoodMaster } from '../../db/database';
import { useFoodMaster, FoodCategory, foodCategoryLabels } from '../../hooks/useFoodMaster';
import { Button } from '../common';

interface FoodSearchProps {
  onSelect: (food: FoodMaster) => void;
}

export function FoodSearch({ onSelect }: FoodSearchProps) {
  const { searchFoods, foodsByCategory, addFood } = useFoodMaster();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodMaster[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // 新規食品追加フォームの状態
  const [newFoodName, setNewFoodName] = useState('');
  const [newCalories, setNewCalories] = useState('');
  const [newProtein, setNewProtein] = useState('');
  const [newFat, setNewFat] = useState('');
  const [newCarbs, setNewCarbs] = useState('');

  useEffect(() => {
    const search = async () => {
      setIsLoading(true);
      const foods = await searchFoods(query);
      setResults(foods);
      setIsLoading(false);
    };

    const timeoutId = setTimeout(search, 200);
    return () => clearTimeout(timeoutId);
  }, [query, searchFoods]);

  const handleAddFood = async () => {
    if (!newFoodName.trim()) return;

    const calories = parseFloat(newCalories) || 0;
    const protein = parseFloat(newProtein) || 0;
    const fat = parseFloat(newFat) || 0;
    const carbs = parseFloat(newCarbs) || 0;

    const id = await addFood({
      name: newFoodName.trim(),
      caloriesPer100g: calories,
      proteinPer100g: protein,
      fatPer100g: fat,
      carbsPer100g: carbs,
    });

    if (id) {
      const newFood: FoodMaster = {
        id,
        name: newFoodName.trim(),
        caloriesPer100g: calories,
        proteinPer100g: protein,
        fatPer100g: fat,
        carbsPer100g: carbs,
        isCustom: true,
        createdAt: new Date(),
      };
      onSelect(newFood);
      resetAddForm();
    }
  };

  const resetAddForm = () => {
    setShowAddForm(false);
    setNewFoodName('');
    setNewCalories('');
    setNewProtein('');
    setNewFat('');
    setNewCarbs('');
  };

  // カテゴリの表示順
  const categoryOrder: FoodCategory[] = [
    'meat',
    'seafood',
    'egg_dairy',
    'legumes',
    'grains',
    'vegetables',
    'fruits',
    'nuts',
    'oils',
    'seasonings',
    'supplements',
    'beverages',
    'other',
  ];

  if (showAddForm) {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">新しい食品を追加</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            食品名
          </label>
          <input
            type="text"
            value={newFoodName}
            onChange={(e) => setNewFoodName(e.target.value)}
            placeholder="例: プロテインバー"
            className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カロリー (100gあたり)
            </label>
            <input
              type="number"
              value={newCalories}
              onChange={(e) => setNewCalories(e.target.value)}
              placeholder="kcal"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タンパク質 (g)
            </label>
            <input
              type="number"
              value={newProtein}
              onChange={(e) => setNewProtein(e.target.value)}
              placeholder="g"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              脂質 (g)
            </label>
            <input
              type="number"
              value={newFat}
              onChange={(e) => setNewFat(e.target.value)}
              placeholder="g"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              炭水化物 (g)
            </label>
            <input
              type="number"
              value={newCarbs}
              onChange={(e) => setNewCarbs(e.target.value)}
              placeholder="g"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={resetAddForm}
            fullWidth
          >
            キャンセル
          </Button>
          <Button
            onClick={handleAddFood}
            disabled={!newFoodName.trim()}
            fullWidth
          >
            追加
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="食材を検索..."
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="max-h-80 overflow-y-auto">
        {query.trim() ? (
          // 検索結果
          isLoading ? (
            <p className="text-center py-4 text-gray-400">検索中...</p>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((food) => (
                <button
                  key={food.id}
                  onClick={() => onSelect(food)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <span className="font-medium text-gray-700">{food.name}</span>
                  <span className="text-sm text-gray-400">
                    {food.caloriesPer100g} kcal/100g
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-3">該当する食品がありません</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setNewFoodName(query);
                  setShowAddForm(true);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                「{query}」を追加
              </Button>
            </div>
          )
        ) : (
          // カテゴリ別表示
          foodsByCategory && (
            <div className="space-y-4">
              {categoryOrder.map((category) => {
                const foods = foodsByCategory[category];
                if (!foods || foods.length === 0) return null;

                return (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-gray-500 mb-2 px-2">
                      {foodCategoryLabels[category]}
                    </h4>
                    <div className="space-y-1">
                      {foods.slice(0, 5).map((food) => (
                        <button
                          key={food.id}
                          onClick={() => onSelect(food)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <span className="font-medium text-gray-700">
                            {food.name}
                          </span>
                          <span className="text-sm text-gray-400">
                            {food.caloriesPer100g} kcal
                          </span>
                        </button>
                      ))}
                      {foods.length > 5 && (
                        <p className="text-xs text-gray-400 px-3 py-1">
                          他 {foods.length - 5} 件...（検索してください）
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
