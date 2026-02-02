import { useState, useCallback } from 'react';
import { calculateOneRM, type OneRMFormula } from '../utils/oneRmCalculator';

export function useOneRM(defaultFormula: OneRMFormula = 'epley') {
  const [formula, setFormula] = useState<OneRMFormula>(defaultFormula);

  const calculate = useCallback(
    (weight: number, reps: number): number => {
      return calculateOneRM(weight, reps, formula);
    },
    [formula]
  );

  return {
    formula,
    setFormula,
    calculate,
  };
}
