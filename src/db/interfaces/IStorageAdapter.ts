// Storage Adapter Interface - Abstract data source operations
export interface IStorageAdapter {
  // Read records from a collection
  read<T = any>(collection: string, query?: any): Promise<T[]>;

  // Create a new record
  create(collection: string, data: any): Promise<string>;

  // Update an existing record
  update(collection: string, id: string, data: any): Promise<void>;

  // Delete a record
  delete(collection: string, id: string): Promise<void>;

  // Initialize the adapter (e.g., authenticate)
  initialize(): Promise<void>;

  // Check if the adapter is ready
  isReady(): boolean;
}
