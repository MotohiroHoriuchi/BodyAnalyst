import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { ExerciseMaster } from '../../db/database';
import { useExerciseMaster } from '../../hooks';
import { formatBodyPart } from '../../utils/formatters';

interface ExerciseSearchProps {
  onSelect: (exercise: ExerciseMaster) => void;
}

export function ExerciseSearch({ onSelect }: ExerciseSearchProps) {
  const { searchExercises, exercisesByBodyPart } = useExerciseMaster();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExerciseMaster[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      const search = async () => {
        setIsSearching(true);
        const exercises = await searchExercises(query);
        setResults(exercises);
        setIsSearching(false);
      };

      const timeoutId = setTimeout(search, 200);
      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [query, searchExercises]);

  const bodyPartOrder = ['chest', 'back', 'shoulder', 'arm', 'leg', 'core', 'other'];

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="種目を検索..."
          className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="max-h-80 overflow-y-auto">
        {query.trim() ? (
          // Search Results
          isSearching ? (
            <p className="text-center py-4 text-gray-400">検索中...</p>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => onSelect(exercise)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <span className="font-medium text-gray-700">{exercise.name}</span>
                  <span className="text-sm text-gray-400">
                    {formatBodyPart(exercise.bodyPart)}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-400">
              該当する種目がありません
            </p>
          )
        ) : (
          // Grouped by Body Part
          exercisesByBodyPart && (
            <div className="space-y-4">
              {bodyPartOrder.map((bodyPart) => {
                const exercises = exercisesByBodyPart[bodyPart];
                if (!exercises || exercises.length === 0) return null;

                return (
                  <div key={bodyPart}>
                    <h4 className="text-sm font-semibold text-gray-500 mb-2 px-2">
                      {formatBodyPart(bodyPart)}
                    </h4>
                    <div className="space-y-1">
                      {exercises.map((exercise) => (
                        <button
                          key={exercise.id}
                          onClick={() => onSelect(exercise)}
                          className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <span className="font-medium text-gray-700">
                            {exercise.name}
                          </span>
                          {exercise.isCompound && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded">
                              Compound
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
