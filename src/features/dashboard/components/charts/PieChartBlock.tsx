import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import type { RechartsProps } from '../../engine/types';

interface PieChartBlockProps {
  data: RechartsProps;
  blockSize?: '1x1' | '2x1' | '2x2';
  height?: number;
}

/**
 * Pie Chart Component
 *
 * Specialized component for rendering pie charts with PFC balance and other proportional data.
 * Supports custom colors and labels.
 */
export function PieChartBlock({ data, blockSize = '1x1', height = 300 }: PieChartBlockProps) {
  const { series = [] } = data;

  // Show legend for larger blocks
  const showLegend = blockSize === '2x1' || blockSize === '2x2';

  // Transform data for pie chart format
  // Recharts Pie expects: [{ name: string, value: number }, ...]
  const pieData = data.data.map((item, index) => {
    // Use the first series' dataKey as the value field
    const valueKey = series[0]?.dataKey || 'value';
    const nameKey = 'name' in item ? 'name' : Object.keys(item)[0];

    return {
      name: item[nameKey] || `Item ${index + 1}`,
      value: item[valueKey] || 0,
    };
  });

  // Extract colors from series
  const colors = series.map(s => s.color);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel as any}
          outerRadius={blockSize === '1x1' ? 60 : 80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />

        {showLegend && (
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            iconType="circle"
            iconSize={8}
          />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}

/**
 * Custom label renderer for pie slices
 * Shows percentage value inside each slice
 */
function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if percentage is significant enough
  if (percent < 0.05) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={11}
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}
