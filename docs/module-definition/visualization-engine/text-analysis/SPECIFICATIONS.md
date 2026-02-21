# Text Analysis Feature Specifications

## 1. Overview

The Text Analysis feature extends the Visualization Engine's Pipe & Filter architecture to support **qualitative data processing**. It bridges the gap between free-text workout notes (language memos) and quantitative training metrics by decomposing text into tokens and visualizing their co-occurrence relationships as a network graph.

### Purpose

Traditional fitness applications excel at analyzing quantitative data (weight × reps) but fail to leverage the qualitative observations users record—conditions, feelings, and contextual notes. This feature enables visual discovery of correlations such as:

- **Condition ↔ Performance:** "腰痛" appearing alongside decreased squat weight
- **Supplement ↔ Results:** "カフェイン" co-occurring with "PR更新"
- **Exercise ↔ Symptom:** "ベンチプレス" linked to "肩こり"

### Scope

This specification covers the prototype implementation in `proto/visualization-engine/`, consisting of:

1. **TokenizerFilter** — Decomposes text fields into token arrays
2. **NetworkGraphSink** — Converts tokenized data into network graph format

## 2. Components

### 2.1 TokenizerFilter

A `DataFilter` implementation that splits a text field in each `DataPoint` into an array of string tokens stored in a new field.

#### Configuration Interface

```typescript
interface TokenizerConfig {
  sourceField: string;
  targetField: string;
  method: 'whitespace' | 'hashtag' | 'segmenter';
  minTokenLength?: number;
  excludeTokens?: string[];
}
```

#### Tokenization Methods

| Method | Description | Use Case |
|--------|------------|----------|
| `whitespace` | Splits by whitespace, commas, and Japanese comma (`、`) | Space-separated keyword notes |
| `hashtag` | Extracts `#tag` patterns from text | Hashtag-based annotation |
| `segmenter` | Uses `Intl.Segmenter('ja', { granularity: 'word' })` | Free-form Japanese text |

#### Filtering Options

- **`minTokenLength`**: Filters tokens shorter than the specified length. Effective for removing single-character Japanese particles.
- **`excludeTokens`**: Explicit stop-word list.

Both filters are applied after tokenization, in order: `minTokenLength` → `excludeTokens`.

#### Behavior

- If the source field is `null`, missing, or not a string, produces an empty array `[]`.
- Original attributes are preserved; the target field is added alongside them.
- Input data is not mutated (immutability guaranteed).

### 2.2 NetworkGraphSink

A `DataSink` implementation that aggregates token co-occurrence across all `DataPoint` records and produces a network graph structure.

#### Configuration Interface

```typescript
interface NetworkGraphConfig {
  tokenField: string;
  attributeFields?: string[];
}
```

#### Output Interface

```typescript
interface NetworkGraphOutput {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface GraphNode {
  id: string;
  label: string;
  size: number;    // Frequency count
  group: string;   // "token" or attribute field name
}

interface GraphLink {
  source: string;
  target: string;
  weight: number;  // Co-occurrence count
}
```

#### Node Generation

- Each unique token becomes a node with `group: "token"`.
- Each unique string value from `attributeFields` becomes a node with `group: <fieldName>`.
- `size` reflects how many records contain that token/value.
- Numeric and null attribute values are ignored.

#### Link Generation

Links represent co-occurrence within the same `DataPoint` record:

1. **Token ↔ Token**: All unique pairs of tokens within the same record.
2. **Token ↔ Attribute**: Each token linked to each string attribute value in the same record.
3. **Self-links**: Prevented by deduplication.

## 3. Pipeline Integration

```
MockDataSource → TokenizerFilter → NetworkGraphSink
     ↓                  ↓                  ↓
  DataFrame         DataFrame        NetworkGraphOutput
  (raw text)      (text + tokens)    (nodes + links)
```

## 4. Technology Decisions

### Intl.Segmenter over External NLP Libraries

- **Chosen**: `Intl.Segmenter` (built-in Web API)
- **Rationale**: Zero dependencies, synchronous, sufficient for prototype
- **Future**: Swap to kuromoji.js for POS tagging if needed (Filter interface preserved)

### DataPoint Type Extension

`DataPoint.attributes` value type extended to `number | string | string[] | null` (backward-compatible).

## 5. Directory Structure

```
proto/visualization-engine/
├── src/
│   ├── filters/
│   │   └── TokenizerFilter.ts            # NEW
│   └── sinks/
│       └── NetworkGraphSink.ts           # NEW
└── tests/
    ├── tokenizer-filter.test.ts          # NEW (16 tests)
    ├── network-graph-sink.test.ts        # NEW (14 tests)
    └── text-analysis-pipeline.test.ts    # NEW (3 integration tests)
```

## 6. Test Coverage

| Test Suite | Tests | Coverage |
|-----------|-------|----------|
| TokenizerFilter | 16 | All 3 methods, filtering options, edge cases, immutability |
| NetworkGraphSink | 14 | Node/link generation, attribute fields, edge cases |
| Integration | 3 | Full pipeline with all tokenization methods |
| **Total** | **33** | |

## 7. Future Considerations

1. **BinningFilter**: Convert numeric attributes to categorical bins for network graph inclusion.
2. **Advanced NLP**: Replace `Intl.Segmenter` with kuromoji.js for POS-based filtering.
3. **Visualization Library**: Integrate with D3.js / Cytoscape.js / React Force Graph.
4. **Temporal Weighting**: Weight co-occurrences by recency.
5. **UI Integration**: Chart settings UI for pipeline configuration.
