import { useState, useEffect } from 'react';
import { Header, DateSelector } from '../components/common';
import { MealSection, AddFoodModal, PFCChart } from '../components/meals';
import { useMealRecords } from '../hooks';
import { MealRecord, MealItem } from '../db/database';
import { getToday } from '../utils/dateUtils';

const mealTypes: MealRecord['mealType'][] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function Meals() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealRecord['mealType']>('breakfast');
  const { getMealsByDate, addMeal, removeMealItem } = useMealRecords();

  useEffect(() => {
    const loadMeals = async () => {
      const data = await getMealsByDate(selectedDate);
      setMeals(data);
    };
    loadMeals();
  }, [selectedDate, getMealsByDate]);

  const getMealByType = (type: MealRecord['mealType']) => {
    return meals.find((m) => m.mealType === type);
  };

  const handleAddClick = (mealType: MealRecord['mealType']) => {
    setActiveMealType(mealType);
    setIsModalOpen(true);
  };

  const handleAddFood = async (item: MealItem) => {
    await addMeal(selectedDate, activeMealType, [item]);
    const data = await getMealsByDate(selectedDate);
    setMeals(data);
  };

  const handleItemDelete = async (mealType: MealRecord['mealType'], itemIndex: number) => {
    const meal = getMealByType(mealType);
    if (!meal?.id) return;
    await removeMealItem(meal.id, itemIndex);
    const data = await getMealsByDate(selectedDate);
    setMeals(data);
  };

  const totals = meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + meal.totalProtein,
      fat: acc.fat + meal.totalFat,
      carbs: acc.carbs + meal.totalCarbs,
    }),
    { protein: 0, fat: 0, carbs: 0 }
  );

  return (
    <div className="flex flex-col min-h-full">
      <Header title="🍽️ 食事記録" />

      <main className="flex-1 px-4 py-2 pb-24 space-y-4 max-w-lg mx-auto w-full">
        <DateSelector date={selectedDate} onChange={setSelectedDate} />

        <PFCChart
          protein={totals.protein}
          fat={totals.fat}
          carbs={totals.carbs}
        />

        <div className="space-y-3">
          {mealTypes.map((type) => (
            <MealSection
              key={type}
              mealType={type}
              meal={getMealByType(type)}
              onAddClick={() => handleAddClick(type)}
              onItemDelete={(index) => handleItemDelete(type, index)}
            />
          ))}
        </div>
      </main>

      <AddFoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mealType={activeMealType}
        onAdd={handleAddFood}
      />
    </div>
  );
}
