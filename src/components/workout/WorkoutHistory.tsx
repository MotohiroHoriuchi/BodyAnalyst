import { Card, EmptyState } from '../common';
import { WorkoutSession } from '../../db/database';
import { getRelativeDateLabel } from '../../utils/dateUtils';
import { formatVolume, formatBodyPart, formatMinutes } from '../../utils/formatters';
import { Dumbbell } from 'lucide-react';

interface WorkoutHistoryProps {
  sessions: WorkoutSession[] | undefined;
  onSessionClick?: (session: WorkoutSession) => void;
}

export function WorkoutHistory({ sessions, onSessionClick }: WorkoutHistoryProps) {
  if (!sessions) {
    return <div className="text-center py-8 text-gray-400">読み込み中...</div>;
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={<Dumbbell className="w-12 h-12" />}
        title="トレーニング記録がありません"
        description="ワークアウトを開始して記録を残しましょう"
      />
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-500 px-1">履歴</h3>
      {sessions.map((session) => {
        const bodyParts = session.exercises
          .map((e) => e.bodyPart)
          .filter((v, i, a) => a.indexOf(v) === i)
          .map(formatBodyPart)
          .join('・');

        const durationMinutes = session.endTime
          ? Math.round(
              (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) /
                1000 /
                60
            )
          : null;

        return (
          <Card
            key={session.id}
            padding="sm"
            onClick={onSessionClick ? () => onSessionClick(session) : undefined}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {getRelativeDateLabel(session.date)}
                </p>
                <p className="font-medium text-gray-900 mt-1">
                  {bodyParts || '記録なし'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatVolume(session.totalVolume)}
                </p>
                {durationMinutes && (
                  <p className="text-sm text-gray-400">
                    {formatMinutes(durationMinutes)}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
