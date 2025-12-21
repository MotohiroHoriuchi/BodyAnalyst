import { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { Card, Modal } from '../common';
import { SetInput } from './SetInput';
import { OneRmDisplay } from './OneRmDisplay';
import { WorkoutExercise, WorkoutSet } from '../../db/database';
import { formatBodyPart } from '../../utils/formatters';
import { OneRmFormula } from '../../utils/oneRmCalculations';

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  oneRmFormula: OneRmFormula;
  onAddSet: (set: WorkoutSet) => void;
  onRemove: () => void;
}

export function ExerciseCard({ exercise, oneRmFormula, onAddSet, onRemove }: ExerciseCardProps) {
  const [isAddingSet, setIsAddingSet] = useState(false);

  const workSets = exercise.sets.filter((s) => !s.isWarmup);
  const bestSet = workSets.reduce<WorkoutSet | null>((best, set) => {
    if (!best) return set;
    const bestVolume = best.weight * best.reps;
    const setVolume = set.weight * set.reps;
    return setVolume > bestVolume ? set : best;
  }, null);

  const handleSaveSet = (setData: Omit<WorkoutSet, 'completedAt'>) => {
    onAddSet({
      ...setData,
      completedAt: new Date(),
    });
    setIsAddingSet(false);
  };

  const lastSet = exercise.sets[exercise.sets.length - 1];

  return (
    <Card padding="sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{exercise.exerciseName}</h3>
          <p className="text-sm text-gray-500">{formatBodyPart(exercise.bodyPart)}</p>
        </div>
        <button
          onClick={onRemove}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="種目を削除"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Sets List */}
      {exercise.sets.length > 0 && (
        <div className="space-y-2 mb-3">
          {exercise.sets.map((set, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 py-2 px-3 rounded-lg ${
                set.isWarmup ? 'bg-gray-50' : 'bg-primary-50'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-sm text-gray-500 w-8">
                {set.isWarmup ? 'W' : set.setNumber}.
              </span>
              <span className="font-medium text-gray-900">
                {set.weight}kg × {set.reps}
              </span>
              {set.rpe && (
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                  RPE {set.rpe}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 1RM Display */}
      {bestSet && (
        <OneRmDisplay
          weight={bestSet.weight}
          reps={bestSet.reps}
          selectedFormula={oneRmFormula}
        />
      )}

      {/* Add Set Button */}
      <button
        onClick={() => setIsAddingSet(true)}
        className="w-full mt-3 py-2 flex items-center justify-center gap-2 text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        セット追加
      </button>

      {/* Set Input Modal */}
      <Modal
        isOpen={isAddingSet}
        onClose={() => setIsAddingSet(false)}
        title="セットを記録"
      >
        <SetInput
          setNumber={workSets.length + 1}
          previousSet={lastSet}
          onSave={handleSaveSet}
          onCancel={() => setIsAddingSet(false)}
        />
      </Modal>
    </Card>
  );
}
