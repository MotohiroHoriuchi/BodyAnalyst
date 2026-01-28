import { IStorageAdapter } from '../../interfaces/IStorageAdapter';
import { initializeGoogleAPI, isSignedIn, getAccessToken } from './auth';
import { rowsToObjects, objectToRow } from './mapper';

// Spreadsheet ID - should be configured per user
const SPREADSHEET_ID = import.meta.env.VITE_GOOGLE_SPREADSHEET_ID;

export class GoogleSheetsAdapter implements IStorageAdapter {
  private ready = false;

  async initialize(): Promise<void> {
    if (this.ready) return;

    await initializeGoogleAPI();
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready && isSignedIn();
  }

  async read<T = any>(collection: string, query?: any): Promise<T[]> {
    if (!this.isReady()) {
      throw new Error('Adapter not ready. Please sign in first.');
    }

    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${collection}!A:Z`, // Read all columns
      });

      const rows = response.result.values || [];
      if (rows.length === 0) {
        return [];
      }

      const objects = rowsToObjects<T>(rows);

      // Apply simple filtering if query is provided
      if (query) {
        return objects.filter(obj => {
          return Object.keys(query).every(key => {
            return (obj as any)[key] === query[key];
          });
        });
      }

      return objects;
    } catch (error) {
      console.error('Error reading from Google Sheets:', error);
      throw error;
    }
  }

  async create(collection: string, data: any): Promise<string> {
    if (!this.isReady()) {
      throw new Error('Adapter not ready. Please sign in first.');
    }

    try {
      // First, get the headers to know the column order
      const headerResponse = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${collection}!1:1`,
      });

      const headers = headerResponse.result.values?.[0] || [];
      if (headers.length === 0) {
        throw new Error(`No headers found in sheet: ${collection}`);
      }

      // Generate an ID if not provided
      const id = data.id || this.generateId();
      const dataWithId = { ...data, id };

      // Convert object to row
      const row = objectToRow(dataWithId, headers);

      // Append the row
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${collection}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row],
        },
      });

      return String(id);
    } catch (error) {
      console.error('Error creating record in Google Sheets:', error);
      throw error;
    }
  }

  async update(collection: string, id: string, data: any): Promise<void> {
    if (!this.isReady()) {
      throw new Error('Adapter not ready. Please sign in first.');
    }

    try {
      // Find the row with the given ID
      const allData = await this.read(collection);
      const rowIndex = allData.findIndex((item: any) => String(item.id) === String(id));

      if (rowIndex === -1) {
        throw new Error(`Record with id ${id} not found in ${collection}`);
      }

      // Get headers
      const headerResponse = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${collection}!1:1`,
      });

      const headers = headerResponse.result.values?.[0] || [];

      // Update the row (row index + 2 because of 0-index and header row)
      const actualRowNumber = rowIndex + 2;
      const row = objectToRow({ ...allData[rowIndex], ...data }, headers);

      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${collection}!A${actualRowNumber}:Z${actualRowNumber}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row],
        },
      });
    } catch (error) {
      console.error('Error updating record in Google Sheets:', error);
      throw error;
    }
  }

  async delete(collection: string, id: string): Promise<void> {
    if (!this.isReady()) {
      throw new Error('Adapter not ready. Please sign in first.');
    }

    try {
      // Find the row with the given ID
      const allData = await this.read(collection);
      const rowIndex = allData.findIndex((item: any) => String(item.id) === String(id));

      if (rowIndex === -1) {
        throw new Error(`Record with id ${id} not found in ${collection}`);
      }

      // Delete the row (row index + 1 because of header row)
      const actualRowNumber = rowIndex + 1;

      await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: await this.getSheetId(collection),
                  dimension: 'ROWS',
                  startIndex: actualRowNumber,
                  endIndex: actualRowNumber + 1,
                },
              },
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error deleting record from Google Sheets:', error);
      throw error;
    }
  }

  private async getSheetId(sheetName: string): Promise<number> {
    const response = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = response.result.sheets?.find(s => s.properties?.title === sheetName);
    if (!sheet || !sheet.properties) {
      throw new Error(`Sheet ${sheetName} not found`);
    }

    return sheet.properties.sheetId || 0;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
