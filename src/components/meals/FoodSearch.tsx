import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { FoodMaster } from '../../db/database';
import { useFoodMaster } from '../../hooks';

interface FoodSearchProps {
  onSelect: (food: FoodMaster) => void;
}

export function FoodSearch({ onSelect }: FoodSearchProps) {
  const { searchFoods } = useFoodMaster();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodMaster[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

      <div className="space-y-1 max-h-60 overflow-y-auto">
        {isLoading ? (
          <p className="text-center py-4 text-gray-400">検索中...</p>
        ) : results.length > 0 ? (
          results.map((food) => (
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
          ))
        ) : (
          <p className="text-center py-4 text-gray-400">
            {query ? '該当する食材がありません' : '食材を検索してください'}
          </p>
        )}
      </div>
    </div>
  );
}
