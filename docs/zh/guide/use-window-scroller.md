# useWindowScroller（Headless 視窗捲動）

`useWindowScroller` 是跟隨瀏覽器視窗捲動的虛擬清單 headless composable。

當瀏覽器 viewport 應驅動虛擬化，但你仍需要完全控制標記、包裝元素和樣式時，請使用此 API。

## 適用情境

- 頁面本身捲動，而非固定高度的內部容器。
- 你需要在正常頁面流中自訂標記。
- 你仍然需要池化渲染、捲動輔助方法、`shift` 和視窗捲動路徑上的快取還原。

## 心智模型

- `useWindowScroller` 是強制開啟 `pageMode` 的 `useRecycleScroller`。
- 你的根 `el` 保持在正常頁面流中，不應成為捲動元素。
- `pool` 仍然是想要一般 DOM 重用行為時的渲染來源。
- `totalSize` 仍屬於內部包裝元素，讓虛擬範圍與整個清單相符。
- 當頁面前後內容應包含在虛擬偏移量計算中時，可提供可選的 `before` 和 `after` refs。

## TypeScript 泛型

`useWindowScroller` 接受與 `useRecycleScroller` 相同的泛型 item 參數，讓回傳的 pool 和輔助方法保持 item 感知：

```ts
const windowScroller = useWindowScroller<Row>({
  items: rows.value,
  keyField: 'id',
  direction: 'vertical',
  itemSize: 44,
  minItemSize: null,
  sizeField: 'size',
  typeField: 'type',
  buffer: 200,
  prerender: 0,
  emitUpdate: false,
  updateInterval: 0,
}, rootEl)

windowScroller.pool.value[0]?.item.label
```

對於物件 item，`keyField` 和可變尺寸 `sizeField` 遵循與 `useRecycleScroller` 相同的編譯期檢查。

## 必要輸入

`useWindowScroller(options, el, before?, after?)`

- `options`：與 [`useRecycleScroller`](./use-recycle-scroller) 相同的核心選項，但 `pageMode` 始終被視為 `true`
- `el`：頁面流中根捲動元素的 ref
- `before`：可選，渲染在同一根元素內虛擬清單前的內容 ref
- `after`：可選，渲染在同一根元素內虛擬清單後的內容 ref

常用選項：`items`、`keyField`、`direction`、`itemSize`、`minItemSize`、`sizeField`、`typeField`、`buffer`、`shift`、`cache`
