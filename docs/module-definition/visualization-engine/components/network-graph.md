# NetworkGraph コンポーネント仕様書

## 概要

`NetworkGraph` は、`NetworkGraphSink` が出力する `NetworkGraphOutput`（nodes + links）を、インタラクティブな力学シミュレーショングラフとしてブラウザ上に描画する React コンポーネントである。

プロトタイプフェーズとして `proto/visualization-engine/src/components/NetworkGraph/` 配下に実装されている。

## アーキテクチャ

```
NetworkGraphOutput (Sink出力)
    │
    ▼
adaptNetworkGraphOutput() ─── 純粋関数（アダプター）
    │
    ├── ForceGraphData (nodes[], links[])
    └── GroupColorMap
    │
    ▼
NetworkGraph.tsx ─── ForceGraph2D ラッパー
    │
    └── NetworkGraphLegend.tsx ─── 凡例サブコンポーネント
```

## ファイル構成

| ファイル | 役割 |
|---------|------|
| `networkGraphAdapter.types.ts` | アダプター層の型定義 |
| `networkGraphAdapter.ts` | `NetworkGraphOutput` → `ForceGraphData` 変換（純粋関数） |
| `NetworkGraph.tsx` | React コンポーネント本体 |
| `NetworkGraphLegend.tsx` | 凡例サブコンポーネント |
| `NetworkGraphDemo.tsx` | デモページ（開発時のみ） |
| `index.ts` | barrel export |

## Props 定義

### `NetworkGraph`

| Prop | 型 | 必須 | デフォルト | 説明 |
|------|---|------|----------|------|
| `data` | `NetworkGraphOutput` | Yes | - | Sink出力データ（nodes, links） |
| `width` | `number` | Yes | - | グラフ描画幅（px） |
| `height` | `number` | Yes | - | グラフ描画高（px） |
| `showLegend` | `boolean` | No | `true` | 凡例の表示/非表示 |
| `adapterConfig` | `AdapterConfig` | No | `undefined` | アダプター設定の上書き |
| `onNodeClick` | `(nodeId: string) => void` | No | `undefined` | ノードクリック時コールバック |

### `AdapterConfig`

| フィールド | 型 | デフォルト | 説明 |
|-----------|---|----------|------|
| `minNodeVal` | `number` | `2` | ノードサイズの最小値 |
| `maxNodeVal` | `number` | `20` | ノードサイズの最大値 |
| `minLinkWidth` | `number` | `1` | リンク幅の最小値 |
| `maxLinkWidth` | `number` | `5` | リンク幅の最大値 |
| `colorOverrides` | `{ [group: string]: string }` | `undefined` | グループ色の上書き |

## データ変換ルール

### ノードサイズ（val）

`GraphNode.size` を `[minNodeVal, maxNodeVal]` の範囲に線形補間（linear interpolation）でスケーリングする。

- 全ノードのサイズが同一の場合、全ノードに中間値 `(min + max) / 2` を割り当てる。

### リンク幅（width）

`GraphLink.weight` を `[minLinkWidth, maxLinkWidth]` の範囲に線形補間でスケーリングする。

- 全リンクの weight が同一の場合、全リンクに中間値 `(min + max) / 2` を割り当てる。

### グループ色割り当て

1. 全ノードからユニークなグループ名を収集
2. `token` グループを常にパレットの先頭（`#6366F1` indigo）に配置
3. 残りのグループは名前のアルファベット順にパレットから色を割り当て
4. `colorOverrides` が指定された場合、該当グループの色を上書き

#### カラーパレット（8色）

| 順番 | 色 | HEX |
|-----|---|-----|
| 0 | Indigo | `#6366F1` |
| 1 | Amber | `#F59E0B` |
| 2 | Emerald | `#10B981` |
| 3 | Red | `#EF4444` |
| 4 | Violet | `#8B5CF6` |
| 5 | Pink | `#EC4899` |
| 6 | Teal | `#14B8A6` |
| 7 | Orange | `#F97316` |

### リンク色

全リンクに統一の半透明グレー `rgba(156, 163, 175, 0.5)` を適用。

## インタラクション仕様

| 操作 | 動作 |
|------|------|
| ドラッグ（ノード） | ノードを自由に移動。他のノードは力学シミュレーションで追従 |
| ホバー（ノード） | ツールチップ表示: `"label (size)"` 形式 |
| クリック（ノード） | `onNodeClick` コールバックが呼ばれる（設定時） |
| 初期表示 | 500ms 後に `zoomToFit(400, 50)` でグラフ全体が表示領域に収まる |

## 凡例

- コンポーネント右上に `absolute` 配置
- ヘッダー「凡例」を表示
- 各グループに対応する色丸とグループ名を一覧表示
- `showLegend={false}` で非表示化可能

## 制約事項

- **Canvas ベース**: `react-force-graph-2d` は Canvas 2D で描画するため、jsdom テストでは描画を検証できない。コンポーネントテストでは外部境界としてモックする。
- **React バージョン**: `react-kapsule`（`react-force-graph-2d` の依存）が React hooks を使用するため、Vite の `resolve.alias` で React を一元化する必要がある（`vite.config.ts` 参照）。
- **パフォーマンス**: 大量ノード（数百以上）では力学シミュレーションが重くなる可能性がある。プロトタイプフェーズでは最適化対象外。
- **テスト環境**: `react-force-graph-2d` の依存が `window.localStorage` を破壊するため、`setup.ts` で `typeof localStorage.clear === 'function'` のガードが必要。

## デモページ

開発モード時のみ `http://localhost:3000/proto/network-graph` でアクセス可能。

- `MockDataSource` + `TokenizerFilter` + `NetworkGraphSink` パイプラインを実行
- 日本語ワークアウトデータ（腰痛、肩こり、好調、カフェイン等）を使用
- ノードクリックで選択ノード名を表示
