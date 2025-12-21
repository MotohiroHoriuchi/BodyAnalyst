export type OneRmFormula = 'epley' | 'brzycki' | 'lombardi' | 'oconner';

export interface OneRmFormulaInfo {
  id: OneRmFormula;
  name: string;
  formula: string;
  description: string;
  calculate: (weight: number, reps: number) => number;
}

export const oneRmFormulas: Record<OneRmFormula, OneRmFormulaInfo> = {
  epley: {
    id: 'epley',
    name: 'Epley式',
    formula: '1RM = weight × (1 + reps ÷ 30)',
    description: '最も一般的に使用される計算式。中〜高レップに適している。',
    calculate: (weight, reps) => {
      if (reps === 1) return weight;
      return weight * (1 + reps / 30);
    }
  },
  brzycki: {
    id: 'brzycki',
    name: 'Brzycki式',
    formula: '1RM = weight × (36 ÷ (37 - reps))',
    description: '低レップ（10回以下）での精度が高いとされる。',
    calculate: (weight, reps) => {
      if (reps === 1) return weight;
      if (reps >= 37) return weight * 36;
      return weight * (36 / (37 - reps));
    }
  },
  lombardi: {
    id: 'lombardi',
    name: 'Lombardi式',
    formula: '1RM = weight × reps^0.10',
    description: 'シンプルな累乗計算式。幅広いレップ範囲で安定。',
    calculate: (weight, reps) => {
      if (reps === 1) return weight;
      return weight * Math.pow(reps, 0.10);
    }
  },
  oconner: {
    id: 'oconner',
    name: "O'Conner式",
    formula: '1RM = weight × (1 + reps ÷ 40)',
    description: 'Epley式の保守的なバリエーション。',
    calculate: (weight, reps) => {
      if (reps === 1) return weight;
      return weight * (1 + reps / 40);
    }
  }
};

export function calculateOneRm(
  weight: number,
  reps: number,
  formula: OneRmFormula = 'epley'
): {
  estimated1RM: number;
  formulaUsed: OneRmFormulaInfo;
  inputWeight: number;
  inputReps: number;
} {
  const formulaInfo = oneRmFormulas[formula];
  const estimated1RM = Math.round(formulaInfo.calculate(weight, reps) * 10) / 10;

  return {
    estimated1RM,
    formulaUsed: formulaInfo,
    inputWeight: weight,
    inputReps: reps
  };
}

export function calculateOneRmAllFormulas(weight: number, reps: number): {
  formula: OneRmFormulaInfo;
  estimated1RM: number;
}[] {
  return Object.values(oneRmFormulas).map(formula => ({
    formula,
    estimated1RM: Math.round(formula.calculate(weight, reps) * 10) / 10
  }));
}
