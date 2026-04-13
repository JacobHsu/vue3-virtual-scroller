<script setup>
import HeadlessTableDocDemo from '../../.vitepress/components/demos/HeadlessTableDocDemo.vue'
</script>

# Headless 表格展示

此展示呈現在語意化表格中使用 headless 動態路徑。它保留了標準的 `<table>`、`<tbody>` 和 `<tr>` 標記，同時透過 `useDynamicScroller` 從 DOM 量測列高。

若要順暢渲染 headless 內容，請將 `pool` 作為渲染來源，`visiblePool` 僅作為資訊參考。範例中保持池化列的掛載狀態，將池化的 `view` 直接傳入量測，並讓指令自動套用回收列的定位與可見性樣式。

另請參閱：

- [`useDynamicScroller`](../guide/use-dynamic-scroller) — 完整的 headless 動態 API。
- [`useRecycleScroller`](../guide/use-recycle-scroller) — 固定大小或預設大小的 headless 路徑。

## 動手試試

- 篩選資料集，確認表格結構保持完整。
- 調整緩衝區大小，觀察預先渲染如何影響量測列。
- 跳轉到指定列，確認程式化導覽仍然有效。
- 調整頁面大小，確保在較小螢幕上水平捲動仍然可用。

<HeadlessTableDocDemo />


## 範例程式碼

```vue
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useDynamicScroller } from 'vue-virtual-scroller'

const MIN_ROW_HEIGHT = 62
const scrollerEl = useTemplateRef<HTMLElement>('scrollerEl')
const dynamicScroller = useDynamicScroller(computed(() => ({
  items: rows.value,
  keyField: 'id',
  direction: 'vertical' as const,
  minItemSize: MIN_ROW_HEIGHT,
  el: scrollerEl.value,
  buffer: buffer.value,
  emitUpdate: true,
})))

const { pool, totalSize, handleScroll, vDynamicScrollerItem } = dynamicScroller
</script>

<template>
  <div
    ref="scrollerEl"
    class="table-viewport"
    @scroll.passive="handleScroll"
  >
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>名稱</th>
          <th>電子郵件</th>
          <th>地區</th>
          <th>狀態</th>
        </tr>
      </thead>

      <tbody :style="{ height: `${totalSize}px` }">
        <tr
          v-for="view in pool"
          :key="view.nr.id"
          v-dynamic-scroller-item="{
            view,
            sizeDependencies: [view.item.item.summary, view.item.item.email],
          }"
        >
          <td>{{ view.item.item.id }}</td>
          <td>{{ view.item.item.name }}</td>
          <td>{{ view.item.item.email }}</td>
          <td>{{ view.item.item.region }}</td>
          <td>{{ view.item.item.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
```
