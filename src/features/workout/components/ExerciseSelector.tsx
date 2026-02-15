import { ExerciseMaster } from '../../../types/workout';

const BODY_PART_ORDER = ['chest', 'back', 'shoulder', 'arm', 'leg', 'core', 'other'] as const;

const BODY_PART_LABELS: Record<string, string> = {
  chest: '胸',
  back: '背中',
  shoulder: '肩',
  arm: '腕',
  leg: '脚',
  core: '体幹',
  other: 'その他',
};

interface ExerciseSelectorProps {
  exercises: ExerciseMaster[];
  value: string;
  onChange: (exerciseId: string, exercise: ExerciseMaster | null) => void;
  disabled?: boolean;
}

export function ExerciseSelector({ exercises, value, onChange, disabled }: ExerciseSelectorProps) {
  const grouped = BODY_PART_ORDER.reduce<Record<string, ExerciseMaster[]>>((acc, part) => {
    const matched = exercises.filter((e) => e.bodyPart === part);
    if (matched.length > 0) {
      acc[part] = matched;
    }
    return acc;
  }, {});

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (!selectedId) {
      onChange('', null);
      return;
    }
    const found = exercises.find((ex) => String(ex.id) === selectedId) ?? null;
    onChange(selectedId, found);
  };

  return (
    <div>
      <label htmlFor="exercise" className="block text-sm font-medium text-gray-700 mb-1">
        種目 *
      </label>
      <select
        id="exercise"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        required
      >
        <option value="">種目を選択...</option>
        {Object.entries(grouped).map(([part, exs]) => (
          <optgroup key={part} label={BODY_PART_LABELS[part]}>
            {exs.map((ex) => (
              <option key={ex.id} value={String(ex.id)}>
                {ex.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
