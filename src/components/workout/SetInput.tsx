import { useState } from 'react';
import { NumberStepper, Button } from '../common';
import { WorkoutSet } from '../../db/database';

interface SetInputProps {
  setNumber: number;
  previousSet?: WorkoutSet;
  onSave: (set: Omit<WorkoutSet, 'completedAt'>) => void;
  onCancel: () => void;
}

export function SetInput({ setNumber, previousSet, onSave, onCancel }: SetInputProps) {
  const [weight, setWeight] = useState(previousSet?.weight || 20);
  const [reps, setReps] = useState(previousSet?.reps || 10);
  const [rpe, setRpe] = useState<number | undefined>(previousSet?.rpe);
  const [isWarmup, setIsWarmup] = useState(false);
  const [showRpe, setShowRpe] = useState(!!previousSet?.rpe);

  const handleSave = () => {
    onSave({
      setNumber,
      weight,
      reps,
      rpe: showRpe ? rpe : undefined,
      isWarmup,
    });
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 text-center">
        セット {setNumber}
      </h3>

      {/* Weight */}
      <div className="flex justify-center">
        <NumberStepper
          value={weight}
          onChange={setWeight}
          min={0}
          max={500}
          step={2.5}
          label="重量 (kg)"
          unit="kg"
          size="lg"
        />
      </div>

      {/* Reps */}
      <div className="flex justify-center">
        <NumberStepper
          value={reps}
          onChange={setReps}
          min={1}
          max={100}
          step={1}
          label="レップ数"
          size="lg"
        />
      </div>

      {/* RPE Toggle */}
      <div>
        <button
          onClick={() => setShowRpe(!showRpe)}
          className="text-sm text-primary-500 font-medium"
        >
          {showRpe ? 'RPEを非表示' : '+ RPEを追加'}
        </button>

        {showRpe && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-600 mb-2 text-center">
              RPE (任意)
            </label>
            <div className="flex justify-center gap-1">
              {[6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => setRpe(value)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    rpe === value
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Warmup Checkbox */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={isWarmup}
          onChange={(e) => setIsWarmup(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
        />
        <span className="text-gray-700">ウォームアップセット</span>
      </label>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} fullWidth>
          キャンセル
        </Button>
        <Button onClick={handleSave} fullWidth>
          記録する
        </Button>
      </div>
    </div>
  );
}
