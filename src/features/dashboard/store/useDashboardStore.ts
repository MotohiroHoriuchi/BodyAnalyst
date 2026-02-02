import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DashboardBlock, DashboardLayout, BlockSize } from '../types';
import { DEFAULT_BLOCKS } from '../types';

interface DashboardState extends DashboardLayout {
  // Actions
  setEditMode: (editMode: boolean) => void;
  addBlock: (block: Omit<DashboardBlock, 'id' | 'position'>) => void;
  removeBlock: (id: string) => void;
  updateBlock: (id: string, updates: Partial<DashboardBlock>) => void;
  reorderBlocks: (blocks: DashboardBlock[]) => void;
  toggleBlockVisibility: (id: string) => void;
  resizeBlock: (id: string, size: BlockSize) => void;
  resetToDefault: () => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Initial state
      blocks: DEFAULT_BLOCKS,
      editMode: false,
      lastModified: new Date(),

      // Actions
      setEditMode: (editMode) =>
        set({
          editMode,
          lastModified: new Date(),
        }),

      addBlock: (blockData) =>
        set((state) => {
          const maxPosition = Math.max(...state.blocks.map((b) => b.position), -1);
          const newBlock: DashboardBlock = {
            ...blockData,
            id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            position: maxPosition + 1,
          };

          return {
            blocks: [...state.blocks, newBlock],
            lastModified: new Date(),
          };
        }),

      removeBlock: (id) =>
        set((state) => ({
          blocks: state.blocks.filter((block) => block.id !== id),
          lastModified: new Date(),
        })),

      updateBlock: (id, updates) =>
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id ? { ...block, ...updates } : block
          ),
          lastModified: new Date(),
        })),

      reorderBlocks: (blocks) =>
        set({
          blocks: blocks.map((block, index) => ({ ...block, position: index })),
          lastModified: new Date(),
        }),

      toggleBlockVisibility: (id) =>
        set((state) => ({
          blocks: state.blocks.map((block) =>
            block.id === id ? { ...block, visible: !block.visible } : block
          ),
          lastModified: new Date(),
        })),

      resizeBlock: (id, size) =>
        set((state) => ({
          blocks: state.blocks.map((block) => (block.id === id ? { ...block, size } : block)),
          lastModified: new Date(),
        })),

      resetToDefault: () =>
        set({
          blocks: DEFAULT_BLOCKS,
          editMode: false,
          lastModified: new Date(),
        }),
    }),
    {
      name: 'dashboard-layout',
      version: 1,
    }
  )
);
