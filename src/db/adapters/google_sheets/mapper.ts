// Type conversion utilities for Google Sheets API responses

/**
 * Convert a 2D array from Sheets into an array of objects
 * First row is assumed to be headers
 */
export function rowsToObjects<T = any>(rows: any[][]): T[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  const headers = rows[0];
  const dataRows = rows.slice(1);

  return dataRows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj as T;
  });
}

/**
 * Convert an object into a row array
 */
export function objectToRow(obj: any, headers: string[]): any[] {
  return headers.map(header => obj[header] ?? '');
}

/**
 * Parse date fields in an object
 */
export function parseDates(obj: any, dateFields: string[]): any {
  const result = { ...obj };
  dateFields.forEach(field => {
    if (result[field]) {
      result[field] = new Date(result[field]);
    }
  });
  return result;
}

/**
 * Format date fields in an object for storage
 */
export function formatDates(obj: any, dateFields: string[]): any {
  const result = { ...obj };
  dateFields.forEach(field => {
    if (result[field] instanceof Date) {
      result[field] = result[field].toISOString();
    }
  });
  return result;
}
