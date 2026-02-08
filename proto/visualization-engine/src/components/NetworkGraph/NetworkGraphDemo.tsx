// proto/visualization-engine/src/components/NetworkGraph/NetworkGraphDemo.tsx
import { useState, useEffect } from 'react';
import { PipelineEngine } from '../../../src/Pipeline';
import { MockDataSource } from '../../../src/sources/MockDataSource';
import { TokenizerFilter } from '../../../src/filters/TokenizerFilter';
import {
  NetworkGraphSink,
  type NetworkGraphOutput,
} from '../../../src/sinks/NetworkGraphSink';
import { NetworkGraph } from './NetworkGraph';
import type { DataFrame } from '../../../src/types';

// Hardcoded Japanese workout journal data
const workoutJournalData: DataFrame = [
  {
    timestamp: Date.now() - 86400000 * 6,
    attributes: {
      notes: '腰痛がひどい ベンチプレス 肩こり カフェイン摂取',
      condition: '不調',
    },
  },
  {
    timestamp: Date.now() - 86400000 * 5,
    attributes: {
      notes: 'スクワット 腰痛 膝の違和感 睡眠不足',
      condition: '不調',
    },
  },
  {
    timestamp: Date.now() - 86400000 * 4,
    attributes: {
      notes: 'ベンチプレス 好調 カフェイン摂取 肩こり改善',
      condition: '好調',
    },
  },
  {
    timestamp: Date.now() - 86400000 * 3,
    attributes: {
      notes: 'デッドリフト 腰痛 ストレッチ不足 カフェイン摂取',
      condition: '不調',
    },
  },
  {
    timestamp: Date.now() - 86400000 * 2,
    attributes: {
      notes: 'スクワット ベンチプレス 好調 睡眠十分',
      condition: '好調',
    },
  },
  {
    timestamp: Date.now() - 86400000,
    attributes: {
      notes: 'ベンチプレス デッドリフト 肩こり ストレッチ実施',
      condition: '普通',
    },
  },
  {
    timestamp: Date.now(),
    attributes: {
      notes: 'スクワット 好調 カフェイン摂取 睡眠十分',
      condition: '好調',
    },
  },
];

export function NetworkGraphDemo() {
  const [graphOutput, setGraphOutput] = useState<NetworkGraphOutput | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    const runPipeline = async () => {
      try {
        const source = new MockDataSource(workoutJournalData);
        const sink = new NetworkGraphSink({
          tokenField: 'tokens',
          attributeFields: ['condition'],
        });

        const pipeline = new PipelineEngine<NetworkGraphOutput>(source, sink);
        pipeline.addFilter(
          new TokenizerFilter({
            sourceField: 'notes',
            targetField: 'tokens',
            method: 'whitespace',
            minTokenLength: 2,
          })
        );

        const result = await pipeline.execute();
        setGraphOutput(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'パイプライン実行エラー');
      }
    };

    runPipeline();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">
          ネットワークグラフ プロトタイプ
        </h1>
        <p className="text-neutral-500 mb-6">
          ワークアウト日誌のテキストデータからトークンの共起関係を可視化
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-sm mb-4">
            {error}
          </div>
        )}

        {selectedNode && (
          <div className="bg-primary-50 text-primary-700 p-3 rounded-sm mb-4">
            選択ノード: <strong>{selectedNode}</strong>
          </div>
        )}

        {graphOutput ? (
          <div className="bg-white border border-neutral-200 rounded-sm overflow-hidden">
            <NetworkGraph
              data={graphOutput}
              width={900}
              height={600}
              onNodeClick={setSelectedNode}
            />
          </div>
        ) : (
          !error && (
            <div className="text-neutral-500">パイプライン実行中...</div>
          )
        )}

        {graphOutput && (
          <div className="mt-4 text-sm text-neutral-500">
            ノード数: {graphOutput.nodes.length} / リンク数:{' '}
            {graphOutput.links.length}
          </div>
        )}
      </div>
    </div>
  );
}
