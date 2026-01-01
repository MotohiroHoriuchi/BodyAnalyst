import { useState, useRef, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { ChevronLeft, ChevronRight, MoreVertical, Edit2, Trash2, Copy } from 'lucide-react';
import { AnalyticsWindow, WindowSize } from '../../db/database';
import { useAnalyticsData } from '../../hooks/useAnalyticsData';
import { useSettings } from '../../hooks';
import { formatVolume } from '../../utils/formatters';

interface AnalyticsWindowCardProps {
  window: AnalyticsWindow;
  onEdit: (window: AnalyticsWindow) => void;
  onDelete: (id: number) => void;
  onDuplicate: (id: number) => void;
  onPeriodChange: (id: number, periodDays: number) => void;
  onResize: (id: number, size: WindowSize) => void;
  isDragging?: boolean;
}

// グリッド行高さ180pxに基づくチャート高さ
// 1x1/2x1: 180px - パディング32px - ヘッダー32px - リサイズハンドル余白8px = 108px
// 2x2: 360px - パディング32px - ヘッダー32px - リサイズハンドル余白8px = 288px
const chartHeights: Record<WindowSize, number> = {
  '1x1': 100,
  '2x1': 100,
  '2x2': 280,
};


export function AnalyticsWindowCard({
  window,
  onEdit,
  onDelete,
  onDuplicate,
  onPeriodChange,
  onResize,
  isDragging,
}: AnalyticsWindowCardProps) {
  const { settings } = useSettings();
  const { dataset1, dataset2, isLoading } = useAnalyticsData(
    window.data1,
    window.data2,
    window.periodDays,
    settings?.oneRmFormula || 'epley'
  );

  const [showMenu, setShowMenu] = useState(false);
  const [localPeriod, setLocalPeriod] = useState(window.periodDays);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ピンチジェスチャー用
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialPeriod, setInitialPeriod] = useState(window.periodDays);

  // リサイズ用
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ピンチジェスチャー
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setInitialPinchDistance(distance);
      setInitialPeriod(localPeriod);
    }
  }, [localPeriod]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance !== null) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / initialPinchDistance;

      // ピンチイン（縮小）で期間を増やす、ピンチアウト（拡大）で期間を減らす
      let newPeriod = Math.round(initialPeriod / scale);
      newPeriod = Math.max(7, Math.min(365, newPeriod));
      setLocalPeriod(newPeriod);
    }
  }, [initialPinchDistance, initialPeriod]);

  const handleTouchEnd = useCallback(() => {
    if (initialPinchDistance !== null && localPeriod !== window.periodDays) {
      onPeriodChange(window.id!, localPeriod);
    }
    setInitialPinchDistance(null);
  }, [initialPinchDistance, localPeriod, window.id, window.periodDays, onPeriodChange]);

  // リサイズハンドルのドラッグ
  const handleResizeStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setResizeStartPos({ x: clientX, y: clientY });
  }, []);

  // ドラッグ距離からサイズを計算する関数
  const calculateNewSize = useCallback((deltaX: number, deltaY: number): WindowSize => {
    const threshold = 50;

    if (window.size === '1x1') {
      if (deltaX > threshold && deltaY > threshold) {
        return '2x2';
      } else if (deltaX > threshold) {
        return '2x1';
      }
    } else if (window.size === '2x1') {
      if (deltaY > threshold) {
        return '2x2';
      } else if (deltaX < -threshold) {
        return '1x1';
      }
    } else if (window.size === '2x2') {
      if (deltaX < -threshold && deltaY < -threshold) {
        return '1x1';
      } else if (deltaY < -threshold) {
        return '2x1';
      }
    }
    return window.size;
  }, [window.size]);

  // 最後に適用したサイズを追跡（連続更新防止用）
  const lastAppliedSize = useRef<WindowSize>(window.size);

  useEffect(() => {
    lastAppliedSize.current = window.size;
  }, [window.size]);

  useEffect(() => {
    if (!isResizing) return;

    // リサイズ中はbodyのスクロールを無効化
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    const handleResizeMove = (e: MouseEvent | TouchEvent) => {
      // タッチイベントのデフォルト動作（スクロール）を防止
      if ('touches' in e) {
        e.preventDefault();
      }

      const clientX = 'touches' in e ? (e as TouchEvent).touches[0]?.clientX ?? (e as TouchEvent).changedTouches[0]?.clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? (e as TouchEvent).touches[0]?.clientY ?? (e as TouchEvent).changedTouches[0]?.clientY : (e as MouseEvent).clientY;

      const deltaX = clientX - resizeStartPos.x;
      const deltaY = clientY - resizeStartPos.y;

      const newSize = calculateNewSize(deltaX, deltaY);

      // リアルタイムでサイズを変更（前回と異なる場合のみ）
      if (newSize !== lastAppliedSize.current) {
        lastAppliedSize.current = newSize;
        onResize(window.id!, newSize);
      }
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      // スクロールを再度有効化
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };

    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    // passive: false を指定して preventDefault() を有効化
    document.addEventListener('touchmove', handleResizeMove, { passive: false });
    document.addEventListener('touchend', handleResizeEnd);

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.removeEventListener('touchmove', handleResizeMove);
      document.removeEventListener('touchend', handleResizeEnd);
      // クリーンアップ時もスクロールを復元
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isResizing, resizeStartPos, window.size, window.id, onResize, calculateNewSize]);

  // 矢印ボタンで期間変更
  const changePeriod = (delta: number) => {
    const periods = [7, 14, 30, 60, 90, 180, 365];
    const currentIndex = periods.indexOf(localPeriod);
    let newIndex = currentIndex;

    if (currentIndex === -1) {
      // カスタム期間の場合、最も近いプリセットを探す
      newIndex = periods.findIndex(p => p >= localPeriod);
      if (newIndex === -1) newIndex = periods.length - 1;
    } else {
      newIndex = Math.max(0, Math.min(periods.length - 1, currentIndex + delta));
    }

    const newPeriod = periods[newIndex];
    setLocalPeriod(newPeriod);
    onPeriodChange(window.id!, newPeriod);
  };

  // データを統合（オーバーレイ表示用）
  const mergedData = (() => {
    if (!dataset1) return [];

    const dataMap = new Map<string, { date: string; value1?: number; value2?: number }>();

    dataset1.data.forEach(d => {
      dataMap.set(d.dateRaw, { date: d.date, value1: d.value });
    });

    if (dataset2) {
      dataset2.data.forEach(d => {
        const existing = dataMap.get(d.dateRaw);
        if (existing) {
          existing.value2 = d.value;
        } else {
          dataMap.set(d.dateRaw, { date: d.date, value2: d.value });
        }
      });
    }

    return Array.from(dataMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  })();

  const formatValue = (value: number, dataType: string): string => {
    if (dataType === 'weight') return `${value}kg`;
    if (dataType === 'bodyFat') return `${value}%`;
    if (dataType === 'calories') return `${value}kcal`;
    if (dataType === 'protein' || dataType === 'fat' || dataType === 'carbs') return `${value}g`;
    if (dataType.includes('volume') || dataType === 'totalVolume') return formatVolume(value);
    if (dataType.includes('1rm') || dataType.includes('maxWeight')) return `${value}kg`;
    return String(value);
  };

  const getPeriodLabel = (days: number): string => {
    if (days <= 7) return '1週間';
    if (days <= 14) return '2週間';
    if (days <= 30) return '1ヶ月';
    if (days <= 60) return '2ヶ月';
    if (days <= 90) return '3ヶ月';
    if (days <= 180) return '6ヶ月';
    return '1年';
  };

  const chartHeight = chartHeights[window.size];

  // 両方のデータセットで同じグラフタイプの場合
  const useComposedChart = dataset1 && dataset2;
  const chart1Type = window.data1.chartType;
  const chart2Type = window.data2?.chartType;

  return (
    <div
      ref={containerRef}
      className={`relative bg-white rounded-2xl p-4 shadow-sm h-full ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${isResizing ? 'ring-2 ring-primary-500' : ''} transition-transform`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700 truncate flex-1">
          {window.name}
        </h3>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400">{getPeriodLabel(localPeriod)}</span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[120px]">
                <button
                  onClick={() => {
                    onEdit(window);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit2 className="w-4 h-4" />
                  編集
                </button>
                <button
                  onClick={() => {
                    onDuplicate(window.id!);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                  複製
                </button>
                <button
                  onClick={() => {
                    onDelete(window.id!);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  削除
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 期間変更ボタン（タッチ以外） */}
      <div className="hidden sm:flex items-center justify-center gap-2 mb-2">
        <button
          onClick={() => changePeriod(1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="期間を広げる"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
        <span className="text-xs text-gray-500 min-w-[60px] text-center">
          {localPeriod}日間
        </span>
        <button
          onClick={() => changePeriod(-1)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="期間を狭める"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* グラフ */}
      <div style={{ height: chartHeight }}>
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : mergedData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-400">データがありません</p>
          </div>
        ) : useComposedChart ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={mergedData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              {dataset2 && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
              )}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value, name) => {
                  if (typeof value !== 'number') return [String(value), String(name)];
                  const dataType = name === 'value1' ? window.data1.dataType : window.data2?.dataType;
                  return [formatValue(value, dataType || ''), name === 'value1' ? window.data1.exerciseName || window.name : window.data2?.exerciseName || ''];
                }}
              />
              {chart1Type === 'bar' ? (
                <Bar
                  yAxisId="left"
                  dataKey="value1"
                  fill={window.data1.color}
                  radius={[2, 2, 0, 0]}
                />
              ) : (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="value1"
                  stroke={window.data1.color}
                  strokeWidth={2}
                  dot={{ fill: window.data1.color, r: 3 }}
                />
              )}
              {dataset2 && (
                chart2Type === 'bar' ? (
                  <Bar
                    yAxisId="right"
                    dataKey="value2"
                    fill={window.data2!.color}
                    radius={[2, 2, 0, 0]}
                  />
                ) : (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="value2"
                    stroke={window.data2!.color}
                    strokeWidth={2}
                    dot={{ fill: window.data2!.color, r: 3 }}
                  />
                )
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : chart1Type === 'bar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mergedData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => {
                  if (typeof value !== 'number') return [String(value), window.name];
                  return [formatValue(value, window.data1.dataType), window.name];
                }}
              />
              <Bar
                dataKey="value1"
                fill={window.data1.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mergedData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(value) => {
                  if (typeof value !== 'number') return [String(value), window.name];
                  return [formatValue(value, window.data1.dataType), window.name];
                }}
              />
              <Line
                type="monotone"
                dataKey="value1"
                stroke={window.data1.color}
                strokeWidth={2}
                dot={{ fill: window.data1.color, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 凡例（2データある場合、1x1サイズでは非表示） */}
      {dataset2 && window.size !== '1x1' && (
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: window.data1.color }}
            />
            <span className="text-xs text-gray-500">
              {window.data1.exerciseName || window.data1.dataType}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: window.data2!.color }}
            />
            <span className="text-xs text-gray-500">
              {window.data2!.exerciseName || window.data2!.dataType}
            </span>
          </div>
        </div>
      )}

      {/* リサイズ中のインジケーター */}
      {isResizing && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-primary-500 pointer-events-none z-20" />
      )}

      {/* リサイズハンドル（右下角） */}
      <div
        onMouseDown={handleResizeStart}
        onTouchStart={handleResizeStart}
        className={`absolute bottom-1 right-1 w-6 h-6 cursor-se-resize group flex items-center justify-center transition-transform ${
          isResizing ? 'scale-125' : ''
        }`}
        title="ドラッグでリサイズ"
      >
        <svg
          className={`w-4 h-4 transition-colors ${
            isResizing ? 'text-primary-500' : 'text-gray-300 group-hover:text-primary-500'
          }`}
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M14 14H12V12H14V14ZM14 10H12V8H14V10ZM10 14H8V12H10V14ZM14 6H12V4H14V6ZM10 10H8V8H10V10ZM6 14H4V12H6V14Z" />
        </svg>
      </div>
    </div>
  );
}
