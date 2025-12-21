import { useState } from 'react';
import { NumberStepper, Button } from '../common';
import { useWeightRecords } from '../../hooks';
import { getToday } from '../../utils/dateUtils';

interface WeightInputProps {
  onComplete?: () => void;
}

export function WeightInput({ onComplete }: WeightInputProps) {
  const { todayRecord, addRecord } = useWeightRecords();
  const [weight, setWeight] = useState(todayRecord?.weight || 70);
  const [bodyFatPercentage, setBodyFatPercentage] = useState<number | undefined>(
    todayRecord?.bodyFatPercentage
  );
  const [showBodyFat, setShowBodyFat] = useState(!!todayRecord?.bodyFatPercentage);
  const [timing, setTiming] = useState<'morning' | 'evening' | 'other'>(
    todayRecord?.timing || 'morning'
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await addRecord({
        date: getToday(),
        weight,
        bodyFatPercentage: showBodyFat ? bodyFatPercentage : undefined,
        timing,
      });
      onComplete?.();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Weight Input */}
      <div className="flex flex-col items-center">
        <NumberStepper
          value={weight}
          onChange={setWeight}
          min={30}
          max={200}
          step={0.1}
          label="体重"
          unit="kg"
          size="lg"
        />
      </div>

      {/* Timing Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">
          計測タイミング
        </label>
        <div className="flex gap-2">
          {[
            { value: 'morning', label: '朝' },
            { value: 'evening', label: '夜' },
            { value: 'other', label: 'その他' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTiming(option.value as typeof timing)}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-colors ${
                timing === option.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body Fat Toggle */}
      <div>
        <button
          onClick={() => setShowBodyFat(!showBodyFat)}
          className="text-sm text-primary-500 font-medium"
        >
          {showBodyFat ? '体脂肪率を非表示' : '+ 体脂肪率を追加'}
        </button>

        {showBodyFat && (
          <div className="mt-4 flex justify-center">
            <NumberStepper
              value={bodyFatPercentage || 15}
              onChange={setBodyFatPercentage}
              min={3}
              max={50}
              step={0.1}
              label="体脂肪率"
              unit="%"
              size="md"
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        fullWidth
        size="lg"
      >
        {isSaving ? '保存中...' : '記録する'}
      </Button>
    </div>
  );
}
