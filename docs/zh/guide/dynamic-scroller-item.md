# DynamicScrollerItem

`DynamicScrollerItem` 是在 [DynamicScroller](./dynamic-scroller) 內部使用的量測包裝元件。它監視每個已渲染的 item，並將尺寸變化回報給 scroller。

## Props

| Prop | 預設值 | 說明 |
|------|--------|------|
| `item`（必填） | — | 在 scroller 中渲染的 item。 |
| `active`（必填） | — | 當前 item 是否為啟用狀態。未啟用時，不必要的尺寸重新計算會被跳過。 |
| `sizeDependencies` | — | 可能影響 item 尺寸的值。此 prop 會被監聽，任一值改變時會重新計算尺寸。建議使用此 prop 而非 `watchData`。 |
| `watchData` | `false` | 深度監聽 `item` 的變化以重新計算尺寸（不建議，可能影響效能）。 |
| `tag` | `'div'` | 用於渲染元件的 HTML 標籤。 |
| `emitResize` | `false` | 每次尺寸重新計算時發出 `resize` 事件（可能影響效能）。 |

## 事件

| 事件 | 說明 |
|------|------|
| `resize` | 每次尺寸重新計算時發出，僅在 `emitResize` prop 為 `true` 時有效。 |
