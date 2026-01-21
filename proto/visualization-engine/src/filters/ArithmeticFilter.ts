// proto/visualization-engine/src/filters/ArithmeticFilter.ts
import { DataFilter, DataFrame, PipelineContext } from '../types';

export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export interface ArithmeticConfig {
  targetField: string;
  operation: Operation;
  operandA: string | number; // Field name or constant
  operandB: string | number; // Field name or constant
}

export class ArithmeticFilter implements DataFilter {
  constructor(private config: ArithmeticConfig) {}

  async execute(data: DataFrame, _context: PipelineContext): Promise<DataFrame> {
    return data.map(point => {
      const valA = this.getValue(point, this.config.operandA);
      const valB = this.getValue(point, this.config.operandB);

      let result: number | null = null;

      if (typeof valA === 'number' && typeof valB === 'number') {
        switch (this.config.operation) {
          case 'add':
            result = valA + valB;
            break;
          case 'subtract':
            result = valA - valB;
            break;
          case 'multiply':
            result = valA * valB;
            break;
          case 'divide':
            result = valB !== 0 ? valA / valB : null; // Avoid division by zero
            break;
        }
      }

      // Create a new attributes object to maintain immutability of the point structure if needed,
      // but here we just copy attributes.
      const newAttributes = { ...point.attributes };
      newAttributes[this.config.targetField] = result;

      return {
        ...point,
        attributes: newAttributes,
      };
    });
  }

  private getValue(point: any, operand: string | number): number | null {
    if (typeof operand === 'number') {
      return operand;
    }
    const val = point.attributes[operand];
    return typeof val === 'number' ? val : null;
  }
}
