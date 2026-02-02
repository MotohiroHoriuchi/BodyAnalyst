// Spreadsheet Setup Helper

interface SheetConfig {
  name: string;
  headers: string[];
}

const SHEET_CONFIGS: SheetConfig[] = [
  {
    name: 'Weight',
    headers: ['id', 'date', 'weight', 'bodyFatPercentage', 'muscleMass', 'timing', 'memo', 'createdAt', 'updatedAt'],
  },
  {
    name: 'WorkoutSessions',
    headers: ['id', 'date', 'startTime', 'endTime', 'exercises', 'totalVolume', 'memo', 'createdAt', 'updatedAt'],
  },
  {
    name: 'ExerciseMaster',
    headers: ['id', 'name', 'bodyPart', 'isCompound', 'isCustom', 'createdAt'],
  },
  {
    name: 'MealRecords',
    headers: ['id', 'date', 'mealType', 'items', 'totalCalories', 'totalProtein', 'totalFat', 'totalCarbs', 'memo', 'createdAt', 'updatedAt'],
  },
  {
    name: 'FoodMaster',
    headers: ['id', 'name', 'caloriesPer100g', 'proteinPer100g', 'fatPer100g', 'carbsPer100g', 'isCustom', 'createdAt'],
  },
];

/**
 * Create a new spreadsheet with all required sheets
 */
export async function createSpreadsheet(): Promise<string> {
  try {
    // Create new spreadsheet
    const response = await gapi.client.sheets.spreadsheets.create({
      resource: {
        properties: {
          title: 'BodyAnalyst Data',
        },
        sheets: SHEET_CONFIGS.map(config => ({
          properties: {
            title: config.name,
          },
        })),
      },
    });

    const spreadsheetId = response.result.spreadsheetId!;
    const sheets = response.result.sheets || [];

    // Add headers to each sheet
    const requests = SHEET_CONFIGS.map((config, index) => {
      const sheetId = sheets[index]?.properties?.sheetId;
      if (sheetId === undefined) {
        throw new Error(`Could not find sheet ID for ${config.name}`);
      }

      return {
        updateCells: {
          range: {
            sheetId: sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: config.headers.length,
          },
          rows: [
            {
              values: config.headers.map(header => ({
                userEnteredValue: { stringValue: header },
                userEnteredFormat: {
                  textFormat: { bold: true },
                  backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                },
              })),
            },
          ],
          fields: 'userEnteredValue,userEnteredFormat',
        },
      };
    });

    await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: { requests },
    });

    return spreadsheetId;
  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    throw error;
  }
}

/**
 * Check if a spreadsheet exists and has all required sheets
 */
export async function validateSpreadsheet(spreadsheetId: string): Promise<boolean> {
  try {
    const response = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId,
    });

    const existingSheets = response.result.sheets?.map(s => s.properties?.title) || [];
    const requiredSheets = SHEET_CONFIGS.map(c => c.name);

    // Check if all required sheets exist
    return requiredSheets.every(name => existingSheets.includes(name));
  } catch (error) {
    console.error('Error validating spreadsheet:', error);
    return false;
  }
}

/**
 * Get spreadsheet URL
 */
export function getSpreadsheetUrl(spreadsheetId: string): string {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
}
