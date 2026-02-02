import { ReactNode, useState } from 'react';
import { X, Maximize2 } from 'lucide-react';
import type { BlockSize } from '../types';

interface EditableBlockProps {
  id: string;
  size: BlockSize;
  editMode: boolean;
  onDelete?: () => void;
  onResize?: (size: BlockSize) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  children: ReactNode;
}

export function EditableBlock({
  id,
  size,
  editMode,
  onDelete,
  onResize,
  onDragStart,
  onDragEnd,
  children,
}: EditableBlockProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showResizeMenu, setShowResizeMenu] = useState(false);

  const sizeClasses = {
    '1x1': 'col-span-1 aspect-square',
    '2x1': 'col-span-2',
    '2x2': 'col-span-2',
  };

  // Height classes to ensure consistent row heights
  // 1x1 is square (aspect-ratio handles height)
  // 2x1 should match 1x1's height (one row unit)
  // 2x2 should be double the height (two row units)
  const heightClasses = {
    '1x1': '', // aspect-square handles it
    '2x1': 'h-[var(--row-height)]',
    '2x2': 'h-[calc(var(--row-height)*2+0.75rem)]', // 2 rows + 1 gap
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (!editMode) return;
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('blockId', id);
    onDragStart?.();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const handleResizeClick = (newSize: BlockSize) => {
    onResize?.(newSize);
    setShowResizeMenu(false);
  };

  return (
    <div
      className={`
        relative transition-all duration-200
        ${sizeClasses[size]}
        ${heightClasses[size]}
        ${editMode ? 'cursor-move' : ''}
        ${isDragging ? 'opacity-50 scale-95' : ''}
        ${editMode ? 'animate-wiggle' : ''}
      `}
      draggable={editMode}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Edit Mode Controls */}
      {editMode && (
        <>
          {/* Delete Button */}
          <button
            onClick={onDelete}
            className="absolute -top-2 -right-2 z-20 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
            aria-label="Delete block"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Resize Button */}
          <div className="absolute -bottom-2 -right-2 z-20">
            <button
              onClick={() => setShowResizeMenu(!showResizeMenu)}
              className="bg-blue-500 text-white rounded-full p-1.5 shadow-lg hover:bg-blue-600 transition-colors"
              aria-label="Resize block"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Resize Menu */}
            {showResizeMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 space-y-1 min-w-[160px]">
                <button
                  onClick={() => handleResizeClick('1x1')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    size === '1x1'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">小 (1x1)</div>
                  <div className="text-xs opacity-70">幅50% × 高さ1行</div>
                </button>
                <button
                  onClick={() => handleResizeClick('2x1')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    size === '2x1'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">横長 (2x1)</div>
                  <div className="text-xs opacity-70">幅100% × 高さ1行</div>
                </button>
                <button
                  onClick={() => handleResizeClick('2x2')}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    size === '2x2'
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="font-medium">大 (2x2)</div>
                  <div className="text-xs opacity-70">幅100% × 高さ2行</div>
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Content */}
      <div className="h-full">{children}</div>
    </div>
  );
}
