import {
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CustomTooltip } from './CustomTooltip';
import type { RechartsProps } from '../../engine/types';

interface BaseChartProps {
  data: RechartsProps;
  blockSize?: '1x1' | '2x1' | '2x2';
  height?: number | string;
}

export function BaseChart({ data, blockSize = '2x1', height = 300 }: BaseChartProps) {
  const { type = 'line', series = [], xAxis, yAxis } = data;

  // Determine if we should show axes based on block size
  const showAxes = blockSize !== '1x1';
  const showLegend = blockSize === '2x1' || blockSize === '2x2';

  // Chart component selection
  const ChartComponent = getChartComponent(type);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ChartComponent data={data.data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        {/* Grid */}
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
          className="dark:stroke-gray-700"
          vertical={false}
        />

        {/* X Axis */}
        <XAxis
          dataKey={xAxis.dataKey}
          tick={showAxes ? { fill: '#6B7280', fontSize: 11 } : false}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
          tickFormatter={xAxis.tickFormatter}
        />

        {/* Y Axis */}
        <YAxis
          tick={showAxes ? { fill: '#6B7280', fontSize: 11 } : false}
          tickLine={false}
          axisLine={{ stroke: '#e5e7eb' }}
          domain={yAxis.domain}
          width={showAxes ? 40 : 0}
        />

        {/* Tooltip */}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />

        {/* Legend */}
        {showLegend && series.length > 1 && (
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
            iconType="circle"
            iconSize={8}
          />
        )}

        {/* Series */}
        {series.map((s, index) => {
          if (type === 'line') {
            return (
              <Line
                key={index}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={{ fill: s.color, r: 3 }}
                activeDot={{ r: 5 }}
              />
            );
          }

          if (type === 'area') {
            return (
              <Area
                key={index}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                fill={s.fill || s.color}
                fillOpacity={0.2}
              />
            );
          }

          if (type === 'bar') {
            return (
              <Bar
                key={index}
                dataKey={s.dataKey}
                name={s.name}
                fill={s.fill || s.color}
                radius={[4, 4, 0, 0]}
              />
            );
          }

          return null;
        })}
      </ChartComponent>
    </ResponsiveContainer>
  );
}

function getChartComponent(type: string) {
  switch (type) {
    case 'line':
      return LineChart;
    case 'bar':
      return BarChart;
    case 'area':
      return AreaChart;
    default:
      return LineChart;
  }
}
