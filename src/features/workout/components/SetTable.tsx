interface SetData {
  weight: string;
  reps: string;
  rpe: string;
}

interface SetTableProps {
  sets: SetData[];
  showRpe: boolean;
  onShowRpeChange: (show: boolean) => void;
  onSetChange: (index: number, field: keyof SetData, value: string) => void;
  onAddSet: () => void;
  onRemoveSet: (index: number) => void;
}

export function SetTable({
  sets,
  showRpe,
  onShowRpeChange,
  onSetChange,
  onAddSet,
  onRemoveSet,
}: SetTableProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={showRpe}
          onChange={(e) => onShowRpeChange(e.target.checked)}
          className="rounded border-gray-300"
        />
        RPEを記録する
      </label>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 border-b border-gray-200">
              <th className="py-2 pr-2 w-12">セット</th>
              <th className="py-2 px-2">重量(kg)</th>
              <th className="py-2 px-2">回数</th>
              {showRpe && <th className="py-2 px-2 w-20">RPE</th>}
              <th className="py-2 pl-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {sets.map((set, index) => (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-2 pr-2 text-gray-500 font-medium">{index + 1}</td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    step="0.5"
                    value={set.weight}
                    onChange={(e) => onSetChange(index, 'weight', e.target.value)}
                    placeholder="80"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </td>
                <td className="py-2 px-2">
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => onSetChange(index, 'reps', e.target.value)}
                    placeholder="10"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </td>
                {showRpe && (
                  <td className="py-2 px-2">
                    <select
                      value={set.rpe}
                      onChange={(e) => onSetChange(index, 'rpe', e.target.value)}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    >
                      <option value="">-</option>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((v) => (
                        <option key={v} value={String(v)}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                <td className="py-2 pl-2">
                  {sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveSet(index)}
                      className="text-gray-400 hover:text-red-500 text-lg leading-none"
                      aria-label={`セット${index + 1}を削除`}
                    >
                      &times;
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={onAddSet}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        + セットを追加
      </button>
    </div>
  );
}

export type { SetData };
