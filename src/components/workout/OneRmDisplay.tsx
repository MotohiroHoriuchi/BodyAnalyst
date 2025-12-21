import { useState } from 'react';
import { Info } from 'lucide-react';
import { calculateOneRm, calculateOneRmAllFormulas, OneRmFormula } from '../../utils/oneRmCalculations';

interface OneRmDisplayProps {
  weight: number;
  reps: number;
  selectedFormula: OneRmFormula;
}

export function OneRmDisplay({ weight, reps, selectedFormula }: OneRmDisplayProps) {
  const [showDetail, setShowDetail] = useState(false);

  const result = calculateOneRm(weight, reps, selectedFormula);
  const allResults = calculateOneRmAllFormulas(weight, reps);

  if (reps < 1 || weight <= 0) return null;

  return (
    <div className="bg-primary-50 rounded-xl p-4 mt-2">
      {/* Main Display */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-500">推定1RM</span>
          <div className="text-2xl font-bold text-primary-600">
            {result.estimated1RM} kg
          </div>
        </div>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="p-2 hover:bg-primary-100 rounded-full transition"
          aria-label="計算式の詳細を表示"
        >
          <Info className="w-5 h-5 text-primary-500" />
        </button>
      </div>

      {/* Detail Display */}
      {showDetail && (
        <div className="mt-4 pt-4 border-t border-primary-200">
          {/* Formula Used */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              使用した計算式: {result.formulaUsed.name}
            </h4>
            <code className="text-sm bg-white px-2 py-1 rounded text-primary-700">
              {result.formulaUsed.formula}
            </code>
            <p className="text-xs text-gray-500 mt-1">
              {result.formulaUsed.description}
            </p>
          </div>

          {/* Calculation */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">計算</h4>
            <p className="text-sm text-gray-600">
              {weight}kg × {reps}reps → <strong>{result.estimated1RM}kg</strong>
            </p>
          </div>

          {/* Comparison */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              他の計算式との比較
            </h4>
            <div className="space-y-1">
              {allResults.map(({ formula, estimated1RM }) => (
                <div
                  key={formula.id}
                  className={`flex justify-between text-sm py-1 px-2 rounded ${
                    formula.id === selectedFormula
                      ? 'bg-primary-100 font-medium'
                      : 'bg-white'
                  }`}
                >
                  <span>{formula.name}</span>
                  <span>{estimated1RM} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
