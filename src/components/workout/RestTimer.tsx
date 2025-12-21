import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

interface RestTimerProps {
  onRestComplete?: (restTime: number) => void;
}

export function RestTimer({ onRestComplete }: RestTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRestTime, setLastRestTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = useCallback(() => {
    if (seconds > 0) {
      setLastRestTime(seconds);
      onRestComplete?.(seconds);
    }
    setIsRunning(false);
    setSeconds(0);
  }, [seconds, onRestComplete]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-2 text-center">
        レストタイマー
      </h3>

      {/* Timer Display */}
      <div className="text-5xl font-bold text-center text-gray-900 font-mono mb-4">
        {formatDuration(seconds)}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition"
          >
            <Play className="w-5 h-5" />
            スタート
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
          >
            <Pause className="w-5 h-5" />
            一時停止
          </button>
        )}

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition"
        >
          <RotateCcw className="w-5 h-5" />
          リセット
        </button>
      </div>

      {/* Last Rest Time */}
      {lastRestTime && (
        <p className="text-center text-sm text-gray-400 mt-4">
          前回のレスト: {formatDuration(lastRestTime)}
        </p>
      )}
    </div>
  );
}
