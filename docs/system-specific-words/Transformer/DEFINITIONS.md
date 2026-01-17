# Transformer

## Definition
A **Transformer** is a specialized pure function within the **Analytics Module**. Its primary role is to convert raw Domain Entities (such as workout logs or weight records) into formatted properties (Props) compatible with the visualization library (Recharts).

Transformers act as an abstraction layer, isolating the visualization logic from the underlying data structure. This ensures that changes in the database schema do not directly break the chart rendering, as long as the Transformer is updated.

## Japanese Explanation
**Transformer (トランスフォーマー)**
**Analytics Module** 内に存在する特化した純粋関数です。
その主な役割は、生のドメインエンティティ（ワークアウトログや体重記録など）を、可視化ライブラリ（Recharts）が解釈可能なプロップス（Props）に変換することです。

Transformerは抽象化レイヤーとして機能し、可視化ロジックを基礎となるデータ構造から切り離します。これにより、データベースのスキーマに変更があっても、Transformerさえ修正すればグラフ描画が壊れることを防げます。

## Related Terms
- **Visualization Engine**: The subsystem that orchestrates Transformers and rendering components.
- **Analytics Module**: The module containing the Transformers.
