# useRecycleScroller（Headless）

`useRecycleScroller` 是用於建立固定尺寸或預設尺寸虛擬清單的底層 composable，讓你完全掌控自訂的 HTML 結構。

當你想完全控制標記、樣式和渲染邏輯，同時將虛擬化引擎與渲染 UI 分離時，請使用此 API。

## 適用情境

- 你需要無法套用元件 slot API 的自訂 DOM 結構（例如 `<table>`）。
- 你想將虛擬化整合到現有的設計系統元件中。
- 你想直接控制渲染/池化行為（例如搭配自訂 item 包裝元素）。
- Item 尺寸在渲染前已知、固定，或已存在於資料中。

## 心智模型

- `useRecycleScroller` 完全是 headless 的。它提供虛擬化狀態，但你仍然需要自行處理包裝標記、item 標記和定位樣式。
- 捲動容器是你的元素 ref（`scrollerEl`）。它仍需要真實的可捲動尺寸設定，例如固定的 `height` 和 `overflow`。
- `totalSize` 是整個清單的虛擬尺寸，將其應用到內部包裝元素，通常使用 `minHeight` 或 `minWidth`。
- 想要與 `RecycleScroller` 相同的回收行為時，從 `pool` 渲染，而非 `visiblePool`。
- 未啟用的池化 view 保持已掛載狀態。用 `visibility: hidden` 和 `pointer-events: none` 隱藏它們，而不是從 DOM 中移除。

## TypeScript 泛型

傳入 item 型別作為泛型參數，以獲得型別化的池條目並對物件 item 欄位進行編譯期驗證：

```ts
const recycleScroller = useRecycleScroller<User>({
  items: users.value,
  keyField: 'id',
  direction: 'vertical',
  itemSize: null,
  minItemSize: 32,
  sizeField: 'size',
  typeField: 'type',
  buffer: 200,
  pageMode: false,
  prerender: 0,
  emitUpdate: false,
  updateInterval: 0,
}, scrollerEl)

recycleScroller.pool.value[0]?.item.name
```

當 `TItem` 是物件型別時，`keyField` 必須是該型別的字串 key，且在 `itemSize` 為 `null` 時，`sizeField` 必須是數值欄位。

## 必要選項

`useRecycleScroller` 需要與 `RecycleScroller` 內部相同的核心選項：

- `items`、`keyField`、`direction`、`itemSize`、`minItemSize`、`sizeField`、`typeField`
- `buffer`、`pageMode`、`prerender`、`emitUpdate`、`updateInterval`

可選格線選項：`gridItems`、`itemSecondarySize`

捲動系統選項：`shift`、`cache`

## 最常用的回傳值

- `pool`：已準備好渲染的池化 view 集合。這是想要最流暢回收行為時的主要渲染來源。
- `visiblePool`：`pool` 過濾出啟用 view 並依可見索引排序的結果。適合讀取、除錯或簡單的衍生 UI。
- `totalSize`：整個清單的虛擬尺寸（包裝元素的 min-height/min-width）。
- `handleScroll`：在 scroll 事件中呼叫此方法。
- `scrollToItem(index, options?)`：帶 `align`、`smooth` 和 `offset` 的程式化導航。
- `scrollToPosition(px, options?)`：絕對捲動位置定位。
- `getScroll()`：當前視窗範圍（像素）。
- `findItemIndex(offset)`：將像素偏移量解析回 item index。
- `getItemOffset(index)`：讀取某個 item 的起始像素偏移量。
- `getItemSize(index)`：讀取某個 item 的已知尺寸。
- `cacheSnapshot`：當前可序列化的尺寸快照。
- `restoreCache(snapshot)`：在 item 序列相符時還原先前的快照。
- `updateVisibleItems(itemsChanged, checkPositionDiff?)`：強制重新計算。

## 渲染清單

- 給外部 scroller 元素設定固定尺寸和 overflow 行為。
- 加入一個帶 `position: relative` 且 `minHeight`/`minWidth` 來自 `totalSize` 的內部包裝元素。
- 渲染 `pool` 中的每個條目。
- 自行對每個渲染的 view 套用絕對定位。
- 隱藏未啟用的 view 而非過濾掉它們。

## 常見陷阱

- 必須自行提供可捲動尺寸樣式（`height` 或 `width` + overflow）。
- 對物件 item 使用穩定的 key 欄位（預設：`id`）。
- Composable 管理池化和索引對應，但不提供內建標記或 CSS。
- 若想保留 DOM 重用，從 `pool` 渲染並隱藏未啟用的 view，而非過濾掉它們。
- 若 item 尺寸必須在渲染後從 DOM 量測，改用 [`useDynamicScroller`](./use-dynamic-scroller)。
- 若瀏覽器視窗負責捲動，改用 [`useWindowScroller`](./use-window-scroller)。

## 完整範例

```vue
<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useRecycleScroller } from 'vue-virtual-scroller'

interface User {
  id: number
  name: string
}

const items = ref<User[]>(
  Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
  })),
)

const scrollerEl = useTemplateRef<HTMLElement>('scrollerEl')

const options = computed(() => ({
  items: items.value,
  keyField: 'id',
  direction: 'vertical' as const,
  itemSize: 40,
  gridItems: undefined,
  itemSecondarySize: undefined,
  minItemSize: null,
  sizeField: 'size',
  typeField: 'type',
  buffer: 200,
  pageMode: false,
  prerender: 0,
  emitUpdate: false,
  updateInterval: 0,
}))

const {
  pool,
  totalSize,
  handleScroll,
} = useRecycleScroller(options, scrollerEl)
</script>

<template>
  <div
    ref="scrollerEl"
    class="my-scroller"
    @scroll.passive="handleScroll"
  >
    <div
      class="my-scroller__inner"
      :style="{ minHeight: `${totalSize}px` }"
    >
      <div
        v-for="view in pool"
        :key="view.nr.id"
        class="my-scroller__item"
        :style="{
          transform: `translateY(${view.position}px)`,
          visibility: view.nr.used ? 'visible' : 'hidden',
          pointerEvents: view.nr.used ? undefined : 'none',
        }"
      >
        <strong>#{{ view.nr.index }}</strong> {{ (view.item as User).name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-scroller {
  height: 400px;
  overflow-y: auto;
  position: relative;
  border: 1px solid #ddd;
}

.my-scroller__inner {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.my-scroller__item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
}
</style>
```
