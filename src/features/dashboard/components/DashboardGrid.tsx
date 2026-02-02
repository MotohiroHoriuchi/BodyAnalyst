import { useState } from 'react';
import { Settings, Plus, Eye, EyeOff } from 'lucide-react';
import { useDashboardStore } from '../store/useDashboardStore';
import { EditableBlock } from './EditableBlock';
import { BlockContent } from './BlockContent';
import { AddBlockModal } from './AddBlockModal';

export function DashboardGrid() {
  const {
    blocks,
    editMode,
    setEditMode,
    removeBlock,
    resizeBlock,
    reorderBlocks,
    toggleBlockVisibility,
  } = useDashboardStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [_draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  const visibleBlocks = blocks.filter((block) => block.visible).sort((a, b) => a.position - b.position);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('blockId');

    if (sourceId === targetId) return;

    const sourceIndex = visibleBlocks.findIndex((b) => b.id === sourceId);
    const targetIndex = visibleBlocks.findIndex((b) => b.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newBlocks = [...visibleBlocks];
    const [removed] = newBlocks.splice(sourceIndex, 1);
    newBlocks.splice(targetIndex, 0, removed);

    reorderBlocks(newBlocks);
    setDraggedBlockId(null);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#1C1C1E] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#F2F2F7] dark:bg-[#1C1C1E] border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">ダッシュボード</h1>
          <div className="flex items-center gap-2">
            {editMode && (
              <button
                onClick={() => setShowAddModal(true)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                aria-label="Add block"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setEditMode(!editMode)}
              className={`p-2 rounded-lg transition-colors ${
                editMode
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={editMode ? 'Exit edit mode' : 'Enter edit mode'}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div
          className="grid grid-cols-2 gap-3 auto-rows-min"
          style={
            {
              '--row-height': 'calc((100vw - 2rem - 0.75rem) / 2)', // (viewport - padding - gap) / 2 columns
            } as React.CSSProperties
          }
        >
          {visibleBlocks.map((block) => (
            <div
              key={block.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, block.id)}
            >
              <EditableBlock
                id={block.id}
                size={block.size}
                editMode={editMode}
                onDelete={() => removeBlock(block.id)}
                onResize={(size) => resizeBlock(block.id, size)}
                onDragStart={() => setDraggedBlockId(block.id)}
                onDragEnd={() => setDraggedBlockId(null)}
              >
                <BlockContent
                  type={block.type}
                  size={block.size}
                  title={block.config?.title}
                />
              </EditableBlock>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {visibleBlocks.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mb-4">
              <EyeOff className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ブロックがありません
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              編集モードでブロックを追加してください
            </p>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                編集モードに入る
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hidden Blocks Panel (Edit Mode Only) */}
      {editMode && blocks.some((b) => !b.visible) && (
        <div className="fixed bottom-20 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              非表示のブロック
            </h3>
            <div className="flex gap-2 overflow-x-auto">
              {blocks
                .filter((b) => !b.visible)
                .map((block) => (
                  <button
                    key={block.id}
                    onClick={() => toggleBlockVisibility(block.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{block.config?.title || block.type}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Block Modal */}
      {showAddModal && <AddBlockModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
