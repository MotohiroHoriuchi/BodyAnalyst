import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpreadsheetSetupModal } from './SpreadsheetSetupModal';

// Mock external boundaries
vi.mock('../../db/adapters/google_sheets/spreadsheetSetup', () => ({
  createSpreadsheet: vi.fn(),
  validateSpreadsheet: vi.fn(),
  findExistingSpreadsheet: vi.fn(),
}));

vi.mock('../../auth/useAuth', () => ({
  useAuth: vi.fn(() => ({
    signOut: vi.fn(),
  })),
}));

import {
  createSpreadsheet,
  validateSpreadsheet,
  findExistingSpreadsheet,
} from '../../db/adapters/google_sheets/spreadsheetSetup';
import { useAuth } from '../../auth/useAuth';

describe('SpreadsheetSetupModal', () => {
  const mockOnComplete = vi.fn();
  const mockOnCancel = vi.fn();
  const mockSignOut = vi.fn();
  const mockLocalStorageSetItem = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuth).mockReturnValue({
      authState: { isSignedIn: true, user: { email: 'test@gmail.com', name: 'テスト' } },
      googleSyncStatus: 'disconnected',
      signIn: vi.fn(),
      signOut: mockSignOut,
    });

    // Replace localStorage with a mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        ...window.localStorage,
        setItem: mockLocalStorageSetItem,
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    // Default: no existing spreadsheet found
    vi.mocked(findExistingSpreadsheet).mockResolvedValue(null);
  });

  describe('自動検索', () => {
    it('モーダルが開いたとき findExistingSpreadsheet が自動で呼ばれること', async () => {
      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(findExistingSpreadsheet).toHaveBeenCalledTimes(1);
      });
    });

    it('isOpen=false のときは findExistingSpreadsheet が呼ばれないこと', () => {
      render(
        <SpreadsheetSetupModal
          isOpen={false}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      expect(findExistingSpreadsheet).not.toHaveBeenCalled();
    });

    it('検索中は「検索中...」メッセージが表示されること', () => {
      // findExistingSpreadsheet が解決しない状態を維持
      vi.mocked(findExistingSpreadsheet).mockReturnValue(new Promise(() => {}));

      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      expect(screen.getByText(/検索中/)).toBeDefined();
    });
  });

  describe('既存スプレッドシートが見つかった場合', () => {
    beforeEach(() => {
      vi.mocked(findExistingSpreadsheet).mockResolvedValue({
        id: 'existing-sheet-id',
        name: 'BodyAnalyst Data',
      });
    });

    it('スプレッドシート名が表示されること', async () => {
      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(screen.getByText('BodyAnalyst Data')).toBeDefined();
      });
    });

    it('「このスプレッドシートを使用する」ボタンが表示されること', async () => {
      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /このスプレッドシートを使用する/ }),
        ).toBeDefined();
      });
    });

    it('「新しく作成する」ボタンも表示されること', async () => {
      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /新しく作成する/ }),
        ).toBeDefined();
      });
    });

    it('「このスプレッドシートを使用する」クリックで validateSpreadsheet が呼ばれること', async () => {
      vi.mocked(validateSpreadsheet).mockResolvedValue(true);

      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /このスプレッドシートを使用する/ }),
        ).toBeDefined();
      });

      fireEvent.click(
        screen.getByRole('button', { name: /このスプレッドシートを使用する/ }),
      );

      await waitFor(() => {
        expect(validateSpreadsheet).toHaveBeenCalledWith('existing-sheet-id');
      });
    });

    it('バリデーション成功時: localStorage に ID が保存され onComplete が呼ばれること', async () => {
      vi.mocked(validateSpreadsheet).mockResolvedValue(true);

      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /このスプレッドシートを使用する/ }),
        ).toBeDefined();
      });

      fireEvent.click(
        screen.getByRole('button', { name: /このスプレッドシートを使用する/ }),
      );

      await waitFor(() => {
        expect(mockLocalStorageSetItem).toHaveBeenCalledWith(
          'BODYANALYST_SPREADSHEET_ID',
          'existing-sheet-id',
        );
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
      });
    });

    it('バリデーション失敗時: エラーメッセージが表示され onComplete は呼ばれないこと', async () => {
      vi.mocked(validateSpreadsheet).mockResolvedValue(false);

      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /このスプレッドシートを使用する/ }),
        ).toBeDefined();
      });

      fireEvent.click(
        screen.getByRole('button', { name: /このスプレッドシートを使用する/ }),
      );

      await waitFor(() => {
        expect(screen.getByText(/スプレッドシートの構造が不完全です/)).toBeDefined();
      });

      expect(mockOnComplete).not.toHaveBeenCalled();
    });

    it('「新しく作成する」クリックで createSpreadsheet が呼ばれること', async () => {
      vi.mocked(createSpreadsheet).mockResolvedValue('new-sheet-id');

      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /新しく作成する/ })).toBeDefined();
      });

      fireEvent.click(screen.getByRole('button', { name: /新しく作成する/ }));

      await waitFor(() => {
        expect(createSpreadsheet).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('既存スプレッドシートが見つからない場合', () => {
    it('「新しいスプレッドシートを作成」ボタンが表示されること', async () => {
      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }),
        ).toBeDefined();
      });
    });

    it('「このスプレッドシートを使用する」ボタンは表示されないこと', async () => {
      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(findExistingSpreadsheet).toHaveBeenCalled();
      });

      expect(
        screen.queryByRole('button', { name: /このスプレッドシートを使用する/ }),
      ).toBeNull();
    });
  });

  describe('検索エラー時', () => {
    it('検索失敗時でも「新しいスプレッドシートを作成」ボタンが表示されること', async () => {
      vi.mocked(findExistingSpreadsheet).mockRejectedValue(new Error('Drive API Error'));

      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }),
        ).toBeDefined();
      });
    });
  });

  describe('新規作成フロー', () => {
    it('作成中は「作成中...」テキストが表示され、ボタンが無効になること', async () => {
      let resolveCreate!: (id: string) => void;
      vi.mocked(createSpreadsheet).mockReturnValue(
        new Promise((resolve) => {
          resolveCreate = resolve;
        }),
      );

      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }),
        ).toBeDefined();
      });

      fireEvent.click(
        screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }),
      );

      await waitFor(() => {
        expect(screen.getByText('作成中...')).toBeDefined();
      });

      const btn = screen.getByRole('button', { name: /作成中/ });
      expect(btn.hasAttribute('disabled')).toBe(true);

      resolveCreate('new-id');
    });

    it('作成成功時: localStorage に ID を保存し、onComplete を呼び出すこと', async () => {
      vi.mocked(createSpreadsheet).mockResolvedValue('new-spreadsheet-id');

      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }),
        ).toBeDefined();
      });

      fireEvent.click(
        screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }),
      );

      await waitFor(() => {
        expect(mockLocalStorageSetItem).toHaveBeenCalledWith(
          'BODYANALYST_SPREADSHEET_ID',
          'new-spreadsheet-id',
        );
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
      });
    });

    it('作成失敗時: エラーメッセージが表示されること', async () => {
      vi.mocked(createSpreadsheet).mockRejectedValue(new Error('API Error'));

      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }),
        ).toBeDefined();
      });

      fireEvent.click(
        screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }),
      );

      await waitFor(() => {
        expect(screen.getByText(/スプレッドシートの作成に失敗しました/)).toBeDefined();
      });

      expect(mockOnComplete).not.toHaveBeenCalled();
    });
  });

  describe('キャンセル', () => {
    it('「キャンセル」クリックで signOut() と onCancel() が呼ばれること', async () => {
      render(
        <SpreadsheetSetupModal
          isOpen={true}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /キャンセル/ }));

      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('非表示', () => {
    it('isOpen=false のときはレンダリングされないこと', () => {
      render(
        <SpreadsheetSetupModal
          isOpen={false}
          onComplete={mockOnComplete}
          onCancel={mockOnCancel}
        />,
      );

      expect(screen.queryByText(/データの保存先を設定します/)).toBeNull();
    });
  });
});
