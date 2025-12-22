import { useState } from 'react';
import { Plus, GripVertical, Settings2 } from 'lucide-react';
import { Header, Button } from '../components/common';
import { AnalyticsWindowCard, AnalyticsWindowEditModal } from '../components/analytics';
import { useAnalyticsWindows } from '../hooks';
import { AnalyticsWindow } from '../db/database';

export function Analytics() {
  const {
    windows,
    addWindow,
    updateWindow,
    deleteWindow,
    reorderWindows,
    duplicateWindow,
    isLoading,
  } = useAnalyticsWindows();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWindow, setEditingWindow] = useState<AnalyticsWindow | null>(null);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleAddWindow = () => {
    setEditingWindow(null);
    setShowEditModal(true);
  };

  const handleEditWindow = (window: AnalyticsWindow) => {
    setEditingWindow(window);
    setShowEditModal(true);
  };

  const handleSaveWindow = async (windowData: Partial<AnalyticsWindow>) => {
    if (windowData.id) {
      // 更新
      await updateWindow(windowData.id, windowData);
    } else {
      // 新規作成
      await addWindow(
        windowData.data1!,
        windowData.data2,
        windowData.name,
        windowData.size,
        windowData.periodDays
      );
    }
  };

  const handleDeleteWindow = async (id: number) => {
    if (confirm('このウィンドウを削除しますか？')) {
      await deleteWindow(id);
    }
  };

  const handlePeriodChange = async (id: number, periodDays: number) => {
    await updateWindow(id, { periodDays });
  };

  // ドラッグ&ドロップ
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId || !windows) return;

    const draggedIndex = windows.findIndex(w => w.id === draggedId);
    const targetIndex = windows.findIndex(w => w.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newOrder = [...windows];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    await reorderWindows(newOrder.map(w => w.id!));
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  // タッチデバイス用の並べ替え（簡易版）
  const moveWindow = async (id: number, direction: 'up' | 'down') => {
    if (!windows) return;

    const currentIndex = windows.findIndex(w => w.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= windows.length) return;

    const newOrder = [...windows];
    const [removed] = newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, removed);

    await reorderWindows(newOrder.map(w => w.id!));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-full">
        <Header title="分析" />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <Header title="分析" />

      <main className="flex-1 px-4 py-4 pb-24 max-w-4xl mx-auto w-full">
        {/* ツールバー */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button onClick={handleAddWindow} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              追加
            </Button>
            {windows && windows.length > 1 && (
              <Button
                variant={isReorderMode ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setIsReorderMode(!isReorderMode)}
              >
                <Settings2 className="w-4 h-4 mr-1" />
                {isReorderMode ? '完了' : '並替'}
              </Button>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {windows?.length || 0} 個のウィンドウ
          </span>
        </div>

        {/* ウィンドウグリッド */}
        {windows && windows.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 auto-rows-[160px]">
            {windows.map((window) => (
              <div
                key={window.id}
                draggable={isReorderMode}
                onDragStart={(e) => handleDragStart(e, window.id!)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, window.id!)}
                onDragEnd={handleDragEnd}
                className={`relative ${
                  window.size === '1x1' ? 'col-span-1 row-span-1' :
                  window.size === '1x2' ? 'col-span-1 row-span-2' :
                  'col-span-2 row-span-2'
                }`}
              >
                {isReorderMode && (
                  <div className="absolute inset-0 bg-primary-500/10 rounded-2xl z-10 flex items-center justify-center">
                    <div className="flex flex-col gap-2">
                      <GripVertical className="w-8 h-8 text-primary-500 mx-auto" />
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveWindow(window.id!, 'up')}
                          className="px-3 py-1 bg-white rounded-lg text-sm shadow"
                          disabled={windows.indexOf(window) === 0}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveWindow(window.id!, 'down')}
                          className="px-3 py-1 bg-white rounded-lg text-sm shadow"
                          disabled={windows.indexOf(window) === windows.length - 1}
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <AnalyticsWindowCard
                  window={window}
                  onEdit={handleEditWindow}
                  onDelete={handleDeleteWindow}
                  onDuplicate={duplicateWindow}
                  onPeriodChange={handlePeriodChange}
                  isDragging={draggedId === window.id}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              分析ウィンドウがありません
            </h3>
            <p className="text-gray-500 mb-4 max-w-xs">
              「追加」ボタンから体重、カロリー、トレーニングデータのグラフを作成できます
            </p>
            <Button onClick={handleAddWindow}>
              <Plus className="w-4 h-4 mr-1" />
              最初のウィンドウを作成
            </Button>
          </div>
        )}
      </main>

      {/* 編集モーダル */}
      <AnalyticsWindowEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveWindow}
        editingWindow={editingWindow}
      />
    </div>
  );
}
