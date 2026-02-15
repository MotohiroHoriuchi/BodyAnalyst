import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 min-w-[120px]">
      {/* Date label */}
      {label && (
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          {formatTooltipDate(label)}
        </p>
      )}

      {/* Data values */}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {entry.name}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
              {formatValue(entry.value, entry.unit)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTooltipDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'M月d日(E)', { locale: ja });
  } catch {
    return dateString;
  }
}

function formatValue(value: number | string, unit?: string): string {
  if (typeof value === 'string') return value;

  // Round to 1 decimal place
  const rounded = Math.round(value * 10) / 10;

  // Add unit if provided
  if (unit) {
    return `${rounded.toLocaleString()}${unit}`;
  }

  return rounded.toLocaleString();
}
