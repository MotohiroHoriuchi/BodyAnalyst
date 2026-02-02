/**
 * Dashboard Block Types
 * Defines the structure and configuration for customizable dashboard blocks
 */

/**
 * Block Size Definition (WidthxHeight)
 * - 1x1: 1 column wide, 1 row tall (small square, 50% width)
 * - 2x1: 2 columns wide, 1 row tall (horizontal rectangle, 100% width)
 * - 2x2: 2 columns wide, 2 rows tall (large square, 100% width, double height)
 */
export type BlockSize = '1x1' | '2x1' | '2x2';

export type BlockType =
  | 'weight_trend'
  | 'volume_trend'
  | 'calorie_trend'
  | 'pfc_trend'
  | 'pfc_balance';

export interface DashboardBlock {
  id: string;
  type: BlockType;
  size: BlockSize;
  position: number; // Order in the grid (0, 1, 2, ...)
  visible: boolean;
  config?: {
    title?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    grouping?: 'day' | 'week' | 'month';
  };
}

export interface DashboardLayout {
  blocks: DashboardBlock[];
  editMode: boolean;
  lastModified: Date;
}

export const DEFAULT_BLOCKS: DashboardBlock[] = [
  {
    id: 'default-volume-weight',
    type: 'volume_trend',
    size: '2x1',
    position: 0,
    visible: true,
    config: {
      title: 'トレーニングボリューム & 体重',
    },
  },
  {
    id: 'default-calorie-weight',
    type: 'calorie_trend',
    size: '1x1',
    position: 1,
    visible: true,
    config: {
      title: 'カロリー摂取量',
    },
  },
];
