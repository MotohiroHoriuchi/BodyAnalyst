import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Drawer, Button } from '../common';
import {
  AnalyticsWindow,
  AnalyticsDataConfig,
  AnalyticsDataType,
  ChartType,
  WindowSize,
} from '../../db/database';
import { dataTypeLabels, defaultColors, getDefaultWindowName } from '../../hooks/useAnalyticsWindows';
import { useExerciseOptions } from '../../hooks/useAnalyticsData';

interface AnalyticsWindowEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (window: Partial<AnalyticsWindow>) => void;
  editingWindow?: AnalyticsWindow | null;
}

const basicDataTypes: AnalyticsDataType[] = [
  'weight',
  'bodyFat',
  'calories',
  'protein',
  'fat',
  'carbs',
  'totalVolume',
];

const exerciseDataTypes: AnalyticsDataType[] = [
  'exercise_volume',
  'exercise_1rm',
  'exercise_maxWeight',
];

const windowSizes: { value: WindowSize; label: string }[] = [
  { value: '1x1', label: '小 (1×1)' },
  { value: '1x2', label: '縦長 (1×2)' },
  { value: '2x2', label: '大 (2×2)' },
];

const periodOptions = [
  { value: 7, label: '1週間' },
  { value: 14, label: '2週間' },
  { value: 30, label: '1ヶ月' },
  { value: 60, label: '2ヶ月' },
  { value: 90, label: '3ヶ月' },
  { value: 180, label: '6ヶ月' },
  { value: 365, label: '1年' },
];

export function AnalyticsWindowEditModal({
  isOpen,
  onClose,
  onSave,
  editingWindow,
}: AnalyticsWindowEditModalProps) {
  const exerciseOptions = useExerciseOptions();

  const [name, setName] = useState('');
  const [size, setSize] = useState<WindowSize>('1x1');
  const [periodDays, setPeriodDays] = useState(30);

  // Data 1
  const [data1Type, setData1Type] = useState<AnalyticsDataType>('weight');
  const [data1ExerciseId, setData1ExerciseId] = useState<number | undefined>();
  const [data1ChartType, setData1ChartType] = useState<ChartType>('line');
  const [data1Color, setData1Color] = useState(defaultColors[0]);

  // Data 2 (optional)
  const [hasData2, setHasData2] = useState(false);
  const [data2Type, setData2Type] = useState<AnalyticsDataType>('calories');
  const [data2ExerciseId, setData2ExerciseId] = useState<number | undefined>();
  const [data2ChartType, setData2ChartType] = useState<ChartType>('line');
  const [data2Color, setData2Color] = useState(defaultColors[1]);

  // 編集モードの初期化
  useEffect(() => {
    if (editingWindow) {
      setName(editingWindow.name);
      setSize(editingWindow.size);
      setPeriodDays(editingWindow.periodDays);

      setData1Type(editingWindow.data1.dataType);
      setData1ExerciseId(editingWindow.data1.exerciseId);
      setData1ChartType(editingWindow.data1.chartType);
      setData1Color(editingWindow.data1.color);

      if (editingWindow.data2) {
        setHasData2(true);
        setData2Type(editingWindow.data2.dataType);
        setData2ExerciseId(editingWindow.data2.exerciseId);
        setData2ChartType(editingWindow.data2.chartType);
        setData2Color(editingWindow.data2.color);
      } else {
        setHasData2(false);
      }
    } else {
      // 新規作成時のリセット
      setName('');
      setSize('1x1');
      setPeriodDays(30);
      setData1Type('weight');
      setData1ExerciseId(undefined);
      setData1ChartType('line');
      setData1Color(defaultColors[0]);
      setHasData2(false);
      setData2Type('calories');
      setData2ExerciseId(undefined);
      setData2ChartType('line');
      setData2Color(defaultColors[1]);
    }
  }, [editingWindow, isOpen]);

  const isExerciseType = (type: AnalyticsDataType) => type.startsWith('exercise_');

  const getExerciseName = (exerciseId?: number) => {
    if (!exerciseId) return undefined;
    return exerciseOptions.find(e => e.id === exerciseId)?.name;
  };

  const handleSave = () => {
    const data1: AnalyticsDataConfig = {
      dataType: data1Type,
      exerciseId: isExerciseType(data1Type) ? data1ExerciseId : undefined,
      exerciseName: isExerciseType(data1Type) ? getExerciseName(data1ExerciseId) : undefined,
      chartType: data1ChartType,
      color: data1Color,
    };

    let data2: AnalyticsDataConfig | undefined;
    if (hasData2) {
      data2 = {
        dataType: data2Type,
        exerciseId: isExerciseType(data2Type) ? data2ExerciseId : undefined,
        exerciseName: isExerciseType(data2Type) ? getExerciseName(data2ExerciseId) : undefined,
        chartType: data2ChartType,
        color: data2Color,
      };
    }

    const windowName = name.trim() || getDefaultWindowName(data1Type, data1.exerciseName);

    onSave({
      id: editingWindow?.id,
      name: windowName,
      data1,
      data2,
      periodDays,
      size,
    });

    onClose();
  };

  const renderDataConfig = (
    dataType: AnalyticsDataType,
    setDataType: (type: AnalyticsDataType) => void,
    exerciseId: number | undefined,
    setExerciseId: (id: number | undefined) => void,
    chartType: ChartType,
    setChartType: (type: ChartType) => void,
    color: string,
    setColor: (color: string) => void,
    label: string
  ) => (
    <div className="space-y-3 p-3 bg-gray-50 rounded-xl">
      <h4 className="text-sm font-medium text-gray-700">{label}</h4>

      {/* データタイプ選択 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">データ</label>
        <select
          value={dataType}
          onChange={(e) => {
            setDataType(e.target.value as AnalyticsDataType);
            if (!e.target.value.startsWith('exercise_')) {
              setExerciseId(undefined);
            }
          }}
          className="w-full px-3 py-2 bg-white rounded-lg text-gray-900 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <optgroup label="基本データ">
            {basicDataTypes.map(type => (
              <option key={type} value={type}>{dataTypeLabels[type]}</option>
            ))}
          </optgroup>
          {exerciseOptions.length > 0 && (
            <optgroup label="種目別データ">
              {exerciseDataTypes.map(type => (
                <option key={type} value={type}>{dataTypeLabels[type]}</option>
              ))}
            </optgroup>
          )}
        </select>
      </div>

      {/* 種目選択（種目別データの場合） */}
      {isExerciseType(dataType) && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">種目</label>
          <select
            value={exerciseId || ''}
            onChange={(e) => setExerciseId(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-3 py-2 bg-white rounded-lg text-gray-900 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">種目を選択...</option>
            {exerciseOptions.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* グラフタイプと色 */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">グラフ</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            className="w-full px-3 py-2 bg-white rounded-lg text-gray-900 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="line">折れ線</option>
            <option value="bar">棒グラフ</option>
          </select>
        </div>
        <div className="w-24">
          <label className="block text-xs text-gray-500 mb-1">色</label>
          <div className="flex gap-1 flex-wrap">
            {defaultColors.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full border-2 ${
                  color === c ? 'border-gray-900' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={editingWindow ? 'ウィンドウを編集' : '新規ウィンドウ'}>
      <div className="flex flex-col h-full">
        {/* 保存ボタン - 上部に配置 */}
        <div className="flex-shrink-0 flex gap-2 p-4 border-b border-gray-100 bg-white">
          <Button variant="secondary" onClick={onClose} fullWidth>
            キャンセル
          </Button>
          <Button
            onClick={handleSave}
            fullWidth
            disabled={isExerciseType(data1Type) && !data1ExerciseId}
          >
            {editingWindow ? '更新' : '作成'}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* ウィンドウ名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ウィンドウ名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="自動設定"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* サイズと期間 */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                サイズ
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as WindowSize)}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {windowSizes.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                期間
              </label>
              <select
                value={periodDays}
                onChange={(e) => setPeriodDays(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {periodOptions.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* データ1 */}
          {renderDataConfig(
            data1Type,
            setData1Type,
            data1ExerciseId,
            setData1ExerciseId,
            data1ChartType,
            setData1ChartType,
            data1Color,
            setData1Color,
            'データ1'
          )}

          {/* データ2（オプション） */}
          {hasData2 ? (
            <div className="relative">
              {renderDataConfig(
                data2Type,
                setData2Type,
                data2ExerciseId,
                setData2ExerciseId,
                data2ChartType,
                setData2ChartType,
                data2Color,
                setData2Color,
                'データ2（オーバーレイ）'
              )}
              <button
                onClick={() => setHasData2(false)}
                className="absolute top-3 right-3 p-1 hover:bg-gray-200 rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setHasData2(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              データ2を追加（オーバーレイ）
            </button>
          )}
        </div>
      </div>
    </Drawer>
  );
}
