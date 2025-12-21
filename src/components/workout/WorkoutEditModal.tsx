import { useState, useEffect } from 'react';
import { Modal, Button } from '../common';
import { WorkoutSession, WorkoutExercise, WorkoutSet } from '../../db/database';
import { formatBodyPart } from '../../utils/formatters';
import { Trash2, Plus } from 'lucide-react';

interface WorkoutEditModalProps {
  session: WorkoutSession | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionId: number, exercises: WorkoutExercise[]) => void;
}

export function WorkoutEditModal({ session, isOpen, onClose, onSave }: WorkoutEditModalProps) {
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

  // Initialize exercises when session changes or modal opens
  useEffect(() => {
    if (isOpen && session) {
      setExercises(JSON.parse(JSON.stringify(session.exercises)));
    }
  }, [isOpen, session]);

  if (!session) return null;

  const handleRemoveExercise = (idx: number) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleRemoveSet = (exerciseIdx: number, setIdx: number) => {
    const updated = [...exercises];
    updated[exerciseIdx] = {
      ...updated[exerciseIdx],
      sets: updated[exerciseIdx].sets.filter((_, i) => i !== setIdx),
    };
    setExercises(updated);
  };

  const handleUpdateSet = (exerciseIdx: number, setIdx: number, field: keyof WorkoutSet, value: number | boolean) => {
    const updated = [...exercises];
    updated[exerciseIdx] = {
      ...updated[exerciseIdx],
      sets: updated[exerciseIdx].sets.map((set, i) =>
        i === setIdx ? { ...set, [field]: value } : set
      ),
    };
    setExercises(updated);
  };

  const handleAddSet = (exerciseIdx: number) => {
    const updated = [...exercises];
    const exercise = updated[exerciseIdx];
    const lastSet = exercise.sets[exercise.sets.length - 1];
    const newSet: WorkoutSet = {
      setNumber: exercise.sets.filter(s => !s.isWarmup).length + 1,
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      isWarmup: false,
      completedAt: new Date(),
    };
    updated[exerciseIdx] = {
      ...exercise,
      sets: [...exercise.sets, newSet],
    };
    setExercises(updated);
  };

  const handleSave = () => {
    onSave(session.id!, exercises);
    onClose();
  };

  const handleClose = () => {
    setExercises([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="トレーニングを編集"
    >
      <div className="p-4 max-h-[70vh] overflow-y-auto">
        {exercises.length === 0 ? (
          <p className="text-center text-gray-400 py-4">種目がありません</p>
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise, exerciseIdx) => (
              <div key={exerciseIdx} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-medium text-gray-900">{exercise.exerciseName}</span>
                    <span className="ml-2 text-xs text-gray-400">
                      {formatBodyPart(exercise.bodyPart)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveExercise(exerciseIdx)}
                    className="p-1 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Sets */}
                <div className="space-y-2">
                  {exercise.sets.map((set, setIdx) => (
                    <div
                      key={setIdx}
                      className="flex items-center gap-2 bg-white rounded-lg p-2"
                    >
                      <span className={`text-xs w-12 ${set.isWarmup ? 'text-orange-500' : 'text-gray-500'}`}>
                        {set.isWarmup ? 'W-up' : `${set.setNumber}セット`}
                      </span>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleUpdateSet(exerciseIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 text-sm bg-gray-100 rounded text-center"
                        step="0.5"
                      />
                      <span className="text-xs text-gray-400">kg</span>
                      <span className="text-gray-400">×</span>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleUpdateSet(exerciseIdx, setIdx, 'reps', parseInt(e.target.value) || 0)}
                        className="w-12 px-2 py-1 text-sm bg-gray-100 rounded text-center"
                      />
                      <span className="text-xs text-gray-400">回</span>
                      <button
                        onClick={() => handleRemoveSet(exerciseIdx, setIdx)}
                        className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Set Button */}
                <button
                  onClick={() => handleAddSet(exerciseIdx)}
                  className="w-full mt-2 py-1 text-sm text-primary-500 hover:bg-primary-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  セットを追加
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={handleClose} fullWidth>
            キャンセル
          </Button>
          <Button onClick={handleSave} fullWidth>
            保存
          </Button>
        </div>
      </div>
    </Modal>
  );
}
