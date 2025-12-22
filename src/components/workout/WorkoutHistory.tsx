import { useState } from 'react';
import { Card, EmptyState, Button, Drawer } from '../common';
import { WorkoutSession, WorkoutExercise, WorkoutSet } from '../../db/database';
import { getRelativeDateLabel } from '../../utils/dateUtils';
import { formatVolume, formatBodyPart, formatMinutes } from '../../utils/formatters';
import { Dumbbell, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';

interface WorkoutHistoryProps {
  sessions: WorkoutSession[] | undefined;
  onDelete?: (sessionId: number) => void;
  onEdit?: (session: WorkoutSession) => void;
}

export function WorkoutHistory({ sessions, onDelete, onEdit }: WorkoutHistoryProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

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

  const handleDelete = (sessionId: number) => {
    if (onDelete) {
      onDelete(sessionId);
    }
    setDeleteConfirmId(null);
  };

  const toggleExpand = (sessionId: number) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  return (
    <>
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

          const isExpanded = expandedSessionId === session.id;

          return (
            <Card key={session.id} padding="sm">
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => toggleExpand(session.id!)}
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    {getRelativeDateLabel(session.date)}
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {bodyParts || '記録なし'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
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
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 mt-1" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 mt-1" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Exercise Details */}
                  {session.exercises.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {session.exercises.map((exercise, idx) => (
                        <ExerciseDetail key={idx} exercise={exercise} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mb-4">種目の記録がありません</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {onEdit && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onEdit(session)}
                        className="flex-1"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        編集
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(session.id!)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        削除
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Delete Confirmation Drawer */}
      <Drawer
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="トレーニング記録を削除"
      >
        <div className="flex flex-col h-full">
          {/* ボタン - 上部に配置 */}
          <div className="flex-shrink-0 flex gap-2 p-4 border-b border-gray-100 bg-white">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmId(null)}
              fullWidth
            >
              キャンセル
            </Button>
            <Button
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-red-500 hover:bg-red-600"
              fullWidth
            >
              削除
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-gray-700">
              このトレーニング記録を削除しますか？この操作は取り消せません。
            </p>
          </div>
        </div>
      </Drawer>
    </>
  );
}

// Exercise Detail Sub-component
function ExerciseDetail({ exercise }: { exercise: WorkoutExercise }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-900">{exercise.exerciseName}</span>
        <span className="text-xs text-gray-400">{formatBodyPart(exercise.bodyPart)}</span>
      </div>
      {exercise.sets.length > 0 ? (
        <div className="space-y-1">
          {exercise.sets.map((set, idx) => (
            <SetDetail key={idx} set={set} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">セットの記録なし</p>
      )}
    </div>
  );
}

// Set Detail Sub-component
function SetDetail({ set }: { set: WorkoutSet }) {
  return (
    <div className="flex items-center text-sm">
      <span className={`w-16 ${set.isWarmup ? 'text-orange-500' : 'text-gray-600'}`}>
        {set.isWarmup ? 'W-up' : `${set.setNumber}セット`}
      </span>
      <span className="text-gray-900">
        {set.weight}kg × {set.reps}回
      </span>
      {set.rpe && (
        <span className="ml-2 text-xs text-gray-400">RPE {set.rpe}</span>
      )}
    </div>
  );
}
