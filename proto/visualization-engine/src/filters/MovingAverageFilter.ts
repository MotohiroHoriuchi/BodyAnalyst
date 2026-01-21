// proto/visualization-engine/src/filters/MovingAverageFilter.ts
import { DataFilter, DataFrame, PipelineContext } from '../types';

export class MovingAverageFilter implements DataFilter {
  constructor(
    private sourceField: string,
    private targetField: string,
    private windowSize: number
  ) {}

  async execute(data: DataFrame, _context: PipelineContext): Promise<DataFrame> {
    // Ensure data is sorted by timestamp
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);

    return sortedData.map((point, index, array) => {
      // Get the window of data ending at the current point
      const start = Math.max(0, index - this.windowSize + 1);
      const window = array.slice(start, index + 1);

      // Filter out points where the source field is not a number
      const validValues = window
        .map(p => p.attributes[this.sourceField])
        .filter((v): v is number => typeof v === 'number');

      let average: number | null = null;
      if (validValues.length > 0) {
        const sum = validValues.reduce((acc, val) => acc + val, 0);
        average = sum / validValues.length;
      }

      const newAttributes = { ...point.attributes };
      newAttributes[this.targetField] = average;

      return {
        ...point,
        attributes: newAttributes,
      };
    });
  }
}
