import { IStorageAdapter } from './interfaces/IStorageAdapter';

/**
 * AdapterProxy - delegates all IStorageAdapter calls to the current adapter.
 * Allows runtime switching between IndexedDB and GoogleSheets adapters.
 */
export class AdapterProxy implements IStorageAdapter {
  private current: IStorageAdapter;

  constructor(initial: IStorageAdapter) {
    this.current = initial;
  }

  getCurrent(): IStorageAdapter {
    return this.current;
  }

  setCurrent(adapter: IStorageAdapter): void {
    this.current = adapter;
  }

  async initialize(): Promise<void> {
    return this.current.initialize();
  }

  isReady(): boolean {
    return this.current.isReady();
  }

  async read<T = any>(collection: string, query?: any): Promise<T[]> {
    return this.current.read<T>(collection, query);
  }

  async create(collection: string, data: any): Promise<string> {
    return this.current.create(collection, data);
  }

  async createBatch(collection: string, dataArray: any[]): Promise<string[]> {
    if (this.current.createBatch) {
      return this.current.createBatch(collection, dataArray);
    }
    // Fallback: sequential creates
    const ids: string[] = [];
    for (const data of dataArray) {
      ids.push(await this.current.create(collection, data));
    }
    return ids;
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    return this.current.update(collection, id, data);
  }

  async delete(collection: string, id: string): Promise<void> {
    return this.current.delete(collection, id);
  }
}
