import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from '../common';
import { calculatePFCRatio } from '../../utils/calculations';
import { formatMacro, formatPercent } from '../../utils/formatters';

interface PFCChartProps {
  protein: number;
  fat: number;
  carbs: number;
}

const COLORS = {
  protein: '#3F83F8',
  fat: '#F59E0B',
  carbs: '#10B981',
};

export function PFCChart({
  protein,
  fat,
  carbs,
}: PFCChartProps) {
  const ratio = calculatePFCRatio(protein, fat, carbs);

  const data = [
    { name: 'P', value: protein * 4, color: COLORS.protein },
    { name: 'F', value: fat * 9, color: COLORS.fat },
    { name: 'C', value: carbs * 4, color: COLORS.carbs },
  ].filter((d) => d.value > 0);

  const total = protein * 4 + fat * 9 + carbs * 4;

  return (
    <Card>
      <h3 className="text-sm font-medium text-gray-500 mb-3">PFCバランス</h3>
      <div className="flex items-center gap-4">
        {/* Chart */}
        <div className="w-24 h-24">
          {total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-xs text-gray-400">No Data</span>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS.protein }}
              />
              <span className="text-sm text-gray-600">P</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{formatMacro(protein)}</span>
              <span className="text-xs text-gray-400 ml-2">
                {formatPercent(ratio.proteinRatio)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS.fat }}
              />
              <span className="text-sm text-gray-600">F</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{formatMacro(fat)}</span>
              <span className="text-xs text-gray-400 ml-2">
                {formatPercent(ratio.fatRatio)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS.carbs }}
              />
              <span className="text-sm text-gray-600">C</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">{formatMacro(carbs)}</span>
              <span className="text-xs text-gray-400 ml-2">
                {formatPercent(ratio.carbsRatio)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
