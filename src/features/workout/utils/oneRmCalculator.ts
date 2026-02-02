/**
 * 1RM Calculation Formulas
 */

export type OneRMFormula = 'epley' | 'brzycki' | 'lander' | 'lombardi';

/**
 * Epley Formula: 1RM = weight × (1 + reps / 30)
 */
function epley(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

/**
 * Brzycki Formula: 1RM = weight × (36 / (37 - reps))
 */
function brzycki(weight: number, reps: number): number {
  return weight * (36 / (37 - reps));
}

/**
 * Lander Formula: 1RM = (100 × weight) / (101.3 - 2.67123 × reps)
 */
function lander(weight: number, reps: number): number {
  return (100 * weight) / (101.3 - 2.67123 * reps);
}

/**
 * Lombardi Formula: 1RM = weight × reps^0.10
 */
function lombardi(weight: number, reps: number): number {
  return weight * Math.pow(reps, 0.1);
}

/**
 * Calculate 1RM using the specified formula
 */
export function calculateOneRM(
  weight: number,
  reps: number,
  formula: OneRMFormula = 'epley'
): number {
  if (reps === 1) {
    return weight;
  }

  if (reps > 10) {
    // Formulas are less accurate for high reps
    return weight;
  }

  let result: number;
  switch (formula) {
    case 'brzycki':
      result = brzycki(weight, reps);
      break;
    case 'lander':
      result = lander(weight, reps);
      break;
    case 'lombardi':
      result = lombardi(weight, reps);
      break;
    case 'epley':
    default:
      result = epley(weight, reps);
      break;
  }

  return Math.round(result * 10) / 10;
}

/**
 * Calculate total volume for a workout exercise
 */
export function calculateVolume(sets: Array<{ weight: number; reps: number }>): number {
  return sets.reduce((total, set) => total + set.weight * set.reps, 0);
}
