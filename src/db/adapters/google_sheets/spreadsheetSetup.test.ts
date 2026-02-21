import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { findExistingSpreadsheet } from './spreadsheetSetup';

describe('findExistingSpreadsheet()', () => {
  const mockFilesList = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('gapi', {
      client: {
        drive: {
          files: {
            list: mockFilesList,
          },
        },
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('スプレッドシートが存在する場合、IDと名前を返すこと', async () => {
    mockFilesList.mockResolvedValue({
      result: { files: [{ id: 'sheet-123', name: 'BodyAnalyst Data' }] },
    });

    const result = await findExistingSpreadsheet();

    expect(result).toEqual({ id: 'sheet-123', name: 'BodyAnalyst Data' });
  });

  it('スプレッドシートが存在しない場合、null を返すこと', async () => {
    mockFilesList.mockResolvedValue({
      result: { files: [] },
    });

    const result = await findExistingSpreadsheet();

    expect(result).toBeNull();
  });

  it('files フィールドが undefined の場合、null を返すこと', async () => {
    mockFilesList.mockResolvedValue({ result: {} });

    const result = await findExistingSpreadsheet();

    expect(result).toBeNull();
  });

  it('modifiedTime 降順・pageSize 1 で検索すること', async () => {
    mockFilesList.mockResolvedValue({
      result: { files: [{ id: 'latest', name: 'BodyAnalyst Data' }] },
    });

    await findExistingSpreadsheet();

    expect(mockFilesList).toHaveBeenCalledWith(
      expect.objectContaining({
        q: expect.stringContaining("name = 'BodyAnalyst Data'"),
        orderBy: 'modifiedTime desc',
        pageSize: 1,
      }),
    );
  });

  it('trashed=false でゴミ箱のファイルを除外すること', async () => {
    mockFilesList.mockResolvedValue({
      result: { files: [{ id: 'active', name: 'BodyAnalyst Data' }] },
    });

    await findExistingSpreadsheet();

    expect(mockFilesList).toHaveBeenCalledWith(
      expect.objectContaining({
        q: expect.stringContaining('trashed = false'),
      }),
    );
  });

  it('Drive API がエラーをスローした場合、例外を伝播すること', async () => {
    mockFilesList.mockRejectedValue(new Error('Drive API Error'));

    await expect(findExistingSpreadsheet()).rejects.toThrow('Drive API Error');
  });
});
