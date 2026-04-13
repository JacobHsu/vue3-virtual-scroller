# WindowScroller

`WindowScroller` 是 [`RecycleScroller`](./recycle-scroller) 的視窗捲動版本。

當瀏覽器視窗是捲動容器，且清單應保持在正常頁面流中（前後可有其他內容）時，請使用此元件。

## 適用情境

- 頁面本身捲動，而非固定高度的內部容器。
- 你想要一個有明確公開 API 的視窗捲動方案，而非依賴 `pageMode`。
- 你仍然需要與 `RecycleScroller` 相同的池化渲染、`shift`、快取還原及程式化捲動輔助方法。

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { WindowScroller } from 'vue-virtual-scroller'

const rows = ref(
  Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    label: `Row ${index + 1}`,
  })),
)
</script>

<template>
  <section class="page-content-before">
    清單前的內容
  </section>

  <WindowScroller
    v-slot="{ item }"
    :items="rows"
    :item-size="40"
    key-field="id"
  >
    <div class="row">
      {{ item.label }}
    </div>
  </WindowScroller>
</template>
```

## TypeScript 泛型

`WindowScroller` 使用與 `RecycleScroller` 相同的泛型元件型別。在 Vue 3.3+ 中，`item` slot prop 會自動從 `items` 推導型別：

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface Row {
  id: number
  label: string
}

const rows = ref<Row[]>([])
</script>

<template>
  <WindowScroller :items="rows" :item-size="40">
    <template #default="{ item }">
      {{ item.label }}
    </template>
  </WindowScroller>
</template>
```

若想讓 item 型別流通至 headless 視窗捲動輔助方法，請改用 [`useWindowScroller`](./use-window-scroller) 並明確指定泛型。

## 行為說明

- 清單保持在正常頁面流中，而非擁有自己的固定高度捲動容器。
- 可見性從瀏覽器 viewport 計算，因此清單前後的頁面內容可以自然排列。
- 元件仍然使用池化渲染、回收 view、`shift` 和快取還原，與 `RecycleScroller` 完全相同。

## Props

`WindowScroller` 接受與 [`RecycleScroller`](./recycle-scroller#props) 相同的核心 props，但始終使用視窗捲動。

最常用的 props：

- `items`
- `keyField`
- `direction`
- `itemSize`
- `gridItems`
- `itemSecondarySize`
- `minItemSize`
- `sizeField`
- `typeField`
- `buffer`
- `shift`
- `cache`
- `prerender`
- `emitUpdate`
- `updateInterval`
- `listTag`
- `itemTag`
- `listClass`
- `itemClass`

當每個 item 已透過 `sizeField` 知道自己的尺寸時，使用 `itemSize: null`。若 DOM 在渲染後才能量測未知的 item 尺寸，請改用 [`DynamicScroller`](./dynamic-scroller)。

## Slots

`WindowScroller` 保持與 `RecycleScroller` 相同的 slot 結構：

- Default slot props：`item`、`index`、`active`
- `before`：渲染在池化清單前的內容
- `after`：渲染在池化清單後的內容
- `empty`：`items` 為空時顯示

## 事件

`WindowScroller` 發出與 `RecycleScroller` 相同的事件：

- `resize`
- `visible`
- `hidden`
- `update(startIndex, endIndex, visibleStartIndex, visibleEndIndex)`（需啟用 `emitUpdate`）

## Exposed 方法

透過 `useTemplateRef` 建立 template ref 後，`WindowScroller` 提供與核心 scroller 相同的導航輔助方法：

- `scrollToItem(index, options?)`
- `scrollToPosition(position, options?)`
- `getScroll()`
- `findItemIndex(offset)`
- `getItemOffset(index)`
- `getItemSize(index)`
- `cacheSnapshot`
- `restoreCache(snapshot)`
- `updateVisibleItems(itemsChanged, checkPositionDiff?)`

## `WindowScroller` 與 `pageMode` 的比較

- 新程式碼中若要使用視窗捲動，優先選用 `WindowScroller`。
- 若只需要舊版相容行為且不想切換元件，保留使用 `RecycleScroller` 上的 `pageMode`。
