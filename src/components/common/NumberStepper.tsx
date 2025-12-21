import { Minus, Plus } from 'lucide-react';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: {
    button: 'w-8 h-8',
    input: 'w-16 h-8 text-base',
    icon: 'w-4 h-4',
  },
  md: {
    button: 'w-10 h-10',
    input: 'w-20 h-10 text-lg',
    icon: 'w-5 h-5',
  },
  lg: {
    button: 'w-12 h-12',
    input: 'w-24 h-12 text-xl',
    icon: 'w-6 h-6',
  },
};

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  unit,
  size = 'md',
}: NumberStepperProps) {
  const classes = sizeClasses[size];

  const handleDecrease = () => {
    const newValue = Math.max(min, value - step);
    onChange(Math.round(newValue * 100) / 100);
  };

  const handleIncrease = () => {
    const newValue = Math.min(max, value + step);
    onChange(Math.round(newValue * 100) / 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    onChange(Math.max(min, Math.min(max, newValue)));
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-600">{label}</label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={value <= min}
          className={`${classes.button} flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
          aria-label="減らす"
        >
          <Minus className={classes.icon} />
        </button>

        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            className={`${classes.input} text-center font-semibold bg-transparent border-b-2 border-gray-200 focus:border-primary-500 focus:outline-none transition-colors`}
            inputMode="decimal"
          />
          {unit && (
            <span className="text-gray-500 font-medium">{unit}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleIncrease}
          disabled={value >= max}
          className={`${classes.button} flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors`}
          aria-label="増やす"
        >
          <Plus className={classes.icon} />
        </button>
      </div>
    </div>
  );
}
