# Dashboard Block Size Specifications

## Overview
Dashboard blocks follow a 2-column grid system optimized for mobile-first design. Block sizes are defined by their width (columns) and height (rows).

## Block Size Definitions

### Size Notation: `[width]x[height]`
- **Width**: Number of columns (1 or 2)
- **Height**: Number of rows (1 or 2)

### Available Sizes

#### 1x1 (Small Square)
- **Width**: 1 column (50% of screen width)
- **Height**: Equal to width (aspect-ratio: 1/1)
- **Use Case**: Glanceable metrics, small charts
- **CSS Classes**: `col-span-1 aspect-square`

#### 2x1 (Horizontal Rectangle)
- **Width**: 2 columns (100% of screen width)
- **Height**: Half of width (aspect-ratio: 2/1)
- **Use Case**: Wide charts, trend lines, horizontal data visualization
- **CSS Classes**: `col-span-2 aspect-[2/1]`
- **Note**: This is the RECOMMENDED size for most charts

#### 2x2 (Large Square)
- **Width**: 2 columns (100% of screen width)
- **Height**: Equal to width (aspect-ratio: 1/1)
- **Use Case**: Detailed charts, complex visualizations
- **CSS Classes**: `col-span-2 aspect-square`

## Grid Layout

### Mobile (Default)
```
┌─────────┬─────────┐
│  1x1    │  1x1    │  Row 1
├─────────┴─────────┤
│       2x1         │  Row 2
├─────────┬─────────┤
│  1x1    │  1x1    │  Row 3
├─────────┴─────────┤
│                   │
│       2x2         │  Row 4-5
│                   │
└───────────────────┘
```

### Desktop (Same as Mobile)
- Uses the same 2-column grid
- Blocks maintain their proportions
- Maximum width: 6xl container (max-w-6xl)

## Implementation

### Chart Heights
Block content (charts) use responsive heights based on aspect-ratio:

- **1x1 blocks**: 100% height (fills square container)
- **2x1 blocks**: 100% height (fills rectangle container, half height of width)
- **2x2 blocks**: 100% height (fills large square container)

All charts use `ResponsiveContainer` with `height="100%"` to fill their parent container.

### Grid Configuration
```tsx
<div className="grid grid-cols-2 gap-3">
  {/* Blocks */}
</div>
```

## Design Principles

1. **Mobile-First**: All sizes are optimized for mobile screens
2. **Consistent Heights**: Row heights are uniform across the grid
3. **2-Column Base**: The grid always uses 2 columns, never 1
4. **Flexible Width**: Blocks can span 1 or 2 columns
5. **Flexible Height**: Blocks can span 1 or 2 rows

## Examples

### Recommended Default Layout
```
┌─────────────────┐
│  Volume (2x1)   │  Primary: Training Volume
├────────┬────────┤
│Calories│ Weight │  Secondary: Calorie & Weight
│ (1x1)  │ (1x1)  │
└────────┴────────┘
```

### Power User Layout
```
┌────────┬────────┐
│  PFC   │ Cals   │  Quick metrics
│ (1x1)  │ (1x1)  │
├────────┴────────┤
│                 │
│  Volume (2x2)   │  Detailed view
│                 │
└─────────────────┘
```
