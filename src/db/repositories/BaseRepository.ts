import { IStorageAdapter } from '../interfaces/IStorageAdapter';

export abstract class BaseRepository<T> {
  private cache: Map<string, T[]> = new Map();
  private cacheTimestamp: Map<string, number> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor(protected adapter: IStorageAdapter) {}

  protected async fetchWithCache(
    collection: string,
    query?: any,
    forceRefresh = false
  ): Promise<T[]> {
    const cacheKey = this.getCacheKey(collection, query);

    if (!forceRefresh && this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const data = await this.adapter.read<T>(collection, query);
    this.cache.set(cacheKey, data);
    this.cacheTimestamp.set(cacheKey, Date.now());

    return data;
  }

  protected invalidateCache(collection?: string): void {
    if (collection) {
      // Invalidate all cache entries for this collection
      const keysToDelete: string[] = [];
      this.cache.forEach((_, key) => {
        if (key.startsWith(`${collection}:`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => {
        this.cache.delete(key);
        this.cacheTimestamp.delete(key);
      });
    } else {
      // Clear all cache
      this.cache.clear();
      this.cacheTimestamp.clear();
    }
  }

  private isCacheValid(cacheKey: string): boolean {
    if (!this.cache.has(cacheKey)) {
      return false;
    }

    const timestamp = this.cacheTimestamp.get(cacheKey);
    if (!timestamp) {
      return false;
    }

    return Date.now() - timestamp < this.cacheTTL;
  }

  private getCacheKey(collection: string, query?: any): string {
    const queryStr = query ? JSON.stringify(query) : 'all';
    return `${collection}:${queryStr}`;
  }
}
