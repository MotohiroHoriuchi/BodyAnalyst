import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpreadsheetSetupModal } from './SpreadsheetSetupModal';

// Mock external boundaries
vi.mock('../../db/adapters/google_sheets/spreadsheetSetup', () => ({
  createSpreadsheet: vi.fn(),
  validateSpreadsheet: vi.fn(),
}));

vi.mock('../../auth/useAuth', () => ({
  useAuth: vi.fn(() => ({
    signOut: vi.fn(),
  })),
}));

import { createSpreadsheet } from '../../db/adapters/google_sheets/spreadsheetSetup';
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

    // Replace localStorage.setItem with a mock
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
  });

  it('「新しいスプレッドシートを作成」ボタンが表示されること', () => {
    render(
      <SpreadsheetSetupModal
        isOpen={true}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /新しいスプレッドシートを作成/ })).toBeDefined();
  });

  it('「キャンセル」ボタンが表示されること', () => {
    render(
      <SpreadsheetSetupModal
        isOpen={true}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByRole('button', { name: /キャンセル/ })).toBeDefined();
  });

  it('「新しいスプレッドシートを作成」クリックで createSpreadsheet() が呼ばれること', async () => {
    vi.mocked(createSpreadsheet).mockResolvedValue('spreadsheet-id-123');

    render(
      <SpreadsheetSetupModal
        isOpen={true}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }));

    await waitFor(() => {
      expect(createSpreadsheet).toHaveBeenCalledTimes(1);
    });
  });

  it('作成中は「作成中...」テキストが表示され、ボタンが無効になること', async () => {
    let resolveCreate!: (id: string) => void;
    vi.mocked(createSpreadsheet).mockReturnValue(
      new Promise(resolve => { resolveCreate = resolve; })
    );

    render(
      <SpreadsheetSetupModal
        isOpen={true}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }));

    await waitFor(() => {
      expect(screen.getByText('作成中...')).toBeDefined();
    });

    const btn = screen.getByRole('button', { name: /作成中/ });
    expect(btn.hasAttribute('disabled')).toBe(true);

    resolveCreate('spreadsheet-id-123');
  });

  it('作成成功時: localStorage に ID を保存し、onComplete を呼び出すこと', async () => {
    vi.mocked(createSpreadsheet).mockResolvedValue('new-spreadsheet-id');

    render(
      <SpreadsheetSetupModal
        isOpen={true}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }));

    await waitFor(() => {
      expect(mockLocalStorageSetItem).toHaveBeenCalledWith('BODYANALYST_SPREADSHEET_ID', 'new-spreadsheet-id');
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
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /新しいスプレッドシートを作成/ }));

    await waitFor(() => {
      expect(screen.getByText(/スプレッドシートの作成に失敗しました/)).toBeDefined();
    });

    expect(mockOnComplete).not.toHaveBeenCalled();
  });

  it('「キャンセル」クリックで signOut() と onCancel() が呼ばれること', async () => {
    render(
      <SpreadsheetSetupModal
        isOpen={true}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /キャンセル/ }));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('isOpen=false のときはレンダリングされないこと', () => {
    render(
      <SpreadsheetSetupModal
        isOpen={false}
        onComplete={mockOnComplete}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText(/データの保存先を設定します/)).toBeNull();
  });
});
