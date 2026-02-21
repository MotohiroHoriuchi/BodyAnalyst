import { describe, it, expect, beforeEach } from 'vitest';
import { IndexedDBAdapter } from './IndexedDBAdapter';

// fake-indexeddb/auto is loaded in src/test/setup.ts

describe('IndexedDBAdapter', () => {
  let adapter: IndexedDBAdapter;

  beforeEach(() => {
    // Create a new adapter instance with a unique DB name per test to avoid state leakage
    adapter = new IndexedDBAdapter(`TestDB_${Date.now()}_${Math.random()}`);
  });

  describe('initialize()', () => {
    it('初期化が正常に完了すること', async () => {
      await expect(adapter.initialize()).resolves.not.toThrow();
    });

    it('複数回 initialize() を呼んでもエラーにならないこと', async () => {
      await adapter.initialize();
      await expect(adapter.initialize()).resolves.not.toThrow();
    });
  });

  describe('isReady()', () => {
    it('initialize() 前は false を返すこと', () => {
      expect(adapter.isReady()).toBe(false);
    });

    it('initialize() 後は true を返すこと', async () => {
      await adapter.initialize();
      expect(adapter.isReady()).toBe(true);
    });
  });

  describe('create() / read()', () => {
    beforeEach(async () => {
      await adapter.initialize();
    });

    it('create() でレコードを作成し、read() で取得できること', async () => {
      const data = {
        date: '2026-02-21',
        weight: 70.5,
        bodyFatPercentage: 15.0,
        muscleMass: null,
        timing: 'morning',
        memo: 'テスト',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const id = await adapter.create('Weight', data);
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');

      const records = await adapter.read('Weight');
      expect(records).toHaveLength(1);
      expect(records[0]).toMatchObject(data);
      expect(records[0].id).toBeDefined();
    });

    it('複数レコードを作成できること', async () => {
      await adapter.create('Weight', { date: '2026-02-19', weight: 70.0, createdAt: '', updatedAt: '' });
      await adapter.create('Weight', { date: '2026-02-20', weight: 70.5, createdAt: '', updatedAt: '' });
      await adapter.create('Weight', { date: '2026-02-21', weight: 71.0, createdAt: '', updatedAt: '' });

      const records = await adapter.read('Weight');
      expect(records).toHaveLength(3);
    });

    it('異なるコレクションは独立していること', async () => {
      await adapter.create('Weight', { date: '2026-02-21', weight: 70.5, createdAt: '', updatedAt: '' });
      await adapter.create('MealRecords', { date: '2026-02-21', mealType: 'lunch', createdAt: '', updatedAt: '' });

      const weightRecords = await adapter.read('Weight');
      const mealRecords = await adapter.read('MealRecords');

      expect(weightRecords).toHaveLength(1);
      expect(mealRecords).toHaveLength(1);
    });
  });

  describe('update()', () => {
    beforeEach(async () => {
      await adapter.initialize();
    });

    it('update() でフィールドが更新されること', async () => {
      const id = await adapter.create('Weight', {
        date: '2026-02-21',
        weight: 70.5,
        memo: '元のメモ',
        createdAt: '',
        updatedAt: '',
      });

      await adapter.update('Weight', id, { weight: 71.0, memo: '更新後のメモ' });

      const records = await adapter.read('Weight');
      expect(records).toHaveLength(1);
      expect(records[0].weight).toBe(71.0);
      expect(records[0].memo).toBe('更新後のメモ');
      expect(records[0].date).toBe('2026-02-21'); // 未変更フィールドは保持
    });

    it('存在しない id の update() はエラーになること', async () => {
      await expect(adapter.update('Weight', '999999', { weight: 70.0 })).rejects.toThrow();
    });
  });

  describe('delete()', () => {
    beforeEach(async () => {
      await adapter.initialize();
    });

    it('delete() でレコードが削除されること', async () => {
      const id = await adapter.create('Weight', {
        date: '2026-02-21',
        weight: 70.5,
        createdAt: '',
        updatedAt: '',
      });

      await adapter.delete('Weight', id);

      const records = await adapter.read('Weight');
      expect(records).toHaveLength(0);
    });

    it('存在しない id の delete() はエラーになること', async () => {
      await expect(adapter.delete('Weight', '999999')).rejects.toThrow();
    });

    it('一部のレコードだけ削除できること', async () => {
      const id1 = await adapter.create('Weight', { date: '2026-02-19', weight: 70.0, createdAt: '', updatedAt: '' });
      await adapter.create('Weight', { date: '2026-02-20', weight: 70.5, createdAt: '', updatedAt: '' });

      await adapter.delete('Weight', id1);

      const records = await adapter.read('Weight');
      expect(records).toHaveLength(1);
      expect(records[0].date).toBe('2026-02-20');
    });
  });

  describe('read() フィルタリング', () => {
    beforeEach(async () => {
      await adapter.initialize();
      await adapter.create('Weight', { date: '2026-02-19', weight: 70.0, timing: 'morning', createdAt: '', updatedAt: '' });
      await adapter.create('Weight', { date: '2026-02-20', weight: 70.5, timing: 'evening', createdAt: '', updatedAt: '' });
      await adapter.create('Weight', { date: '2026-02-21', weight: 71.0, timing: 'morning', createdAt: '', updatedAt: '' });
    });

    it('query でフィルタリングできること', async () => {
      const records = await adapter.read('Weight', { timing: 'morning' });
      expect(records).toHaveLength(2);
      records.forEach(r => expect(r.timing).toBe('morning'));
    });

    it('query が空の場合は全件返すこと', async () => {
      const records = await adapter.read('Weight');
      expect(records).toHaveLength(3);
    });
  });

  describe('createBatch()', () => {
    beforeEach(async () => {
      await adapter.initialize();
    });

    it('createBatch() で複数レコードを一括作成できること', async () => {
      const dataArray = [
        { date: '2026-02-19', weight: 70.0, createdAt: '', updatedAt: '' },
        { date: '2026-02-20', weight: 70.5, createdAt: '', updatedAt: '' },
        { date: '2026-02-21', weight: 71.0, createdAt: '', updatedAt: '' },
      ];

      const ids = await adapter.createBatch!('Weight', dataArray);
      expect(ids).toHaveLength(3);
      ids.forEach(id => expect(typeof id).toBe('string'));

      const records = await adapter.read('Weight');
      expect(records).toHaveLength(3);
    });

    it('createBatch() で空配列を渡すと空配列が返ること', async () => {
      const ids = await adapter.createBatch!('Weight', []);
      expect(ids).toEqual([]);
    });
  });
});
