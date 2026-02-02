import { useState } from 'react';
import { X } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';
import type { BlockType, BlockSize } from '../types';

interface AddBlockModalProps {
  onClose: () => void;
}

const BLOCK_OPTIONS: Array<{
  type: BlockType;
  label: string;
  description: string;
}> = [
  {
    type: 'weight_trend',
    label: '体重推移',
    description: '体重・体脂肪率・筋肉量の推移を表示',
  },
  {
    type: 'volume_trend',
    label: 'トレーニングボリューム',
    description: '日別・週別のトレーニングボリューム推移',
  },
  {
    type: 'calorie_trend',
    label: 'カロリー推移',
    description: '摂取カロリーの推移',
  },
  {
    type: 'pfc_trend',
    label: 'PFC推移',
    description: 'タンパク質・脂質・炭水化物の摂取量推移',
  },
  {
    type: 'pfc_balance',
    label: 'PFCバランス',
    description: 'タンパク質・脂質・炭水化物の比率',
  },
];

export function AddBlockModal({ onClose }: AddBlockModalProps) {
  const addBlock = useDashboardStore((state) => state.addBlock);
  const [selectedType, setSelectedType] = useState<BlockType>('weight_trend');
  const [selectedSize, setSelectedSize] = useState<BlockSize>('2x1');

  const handleAdd = () => {
    const selectedOption = BLOCK_OPTIONS.find((opt) => opt.type === selectedType);
    addBlock({
      type: selectedType,
      size: selectedSize,
      visible: true,
      config: {
        title: selectedOption?.label,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            ブロックを追加
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Block Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              グラフの種類
            </label>
            <div className="space-y-2">
              {BLOCK_OPTIONS.map((option) => (
                <button
                  key={option.type}
                  onClick={() => setSelectedType(option.type)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedType === option.type
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              ブロックサイズ（幅×高さ）
            </label>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedSize('1x1')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedSize === '1x1'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="text-left">
                    <div className="font-medium">小 (1x1)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">幅50% × 高さ1行</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setSelectedSize('2x1')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedSize === '2x1'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-32 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="text-left">
                    <div className="font-medium">横長 (2x1)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">幅100% × 高さ1行（推奨）</div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setSelectedSize('2x2')}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  selectedSize === '2x2'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="text-left">
                    <div className="font-medium">大 (2x2)</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">幅100% × 高さ2行</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
