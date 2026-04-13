<script setup>
import WindowScrollerDocDemo from '../../.vitepress/components/demos/WindowScrollerDocDemo.vue'
</script>

# WindowScroller 展示

此展示以瀏覽器視窗作為捲動容器。清單保持在正常頁面流中，跟隨頁面捲動，而非渲染在內部的捲動面板內。

## 動手試試

- 捲動頁面，而非尋找內部捲動區域。
- 跳轉到指定列以測試 window 捲動路徑下的 `scrollToItem`。
- 切換可變高度以在固定大小列和資料驅動列之間切換。
- 展開說明區塊後再次跳轉到同一列，確認前置偏移保持同步。

<WindowScrollerDocDemo />

## 範例程式碼

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { WindowScroller } from 'vue-virtual-scroller'

const scroller = useTemplateRef<InstanceType<typeof WindowScroller>>('scroller')
const rows = ref([
  { id: 1, user: 'Avery Anderson', message: 'Window-driven row', timestamp: '08:00', height: 88 },
  { id: 2, user: 'Jordan Diaz', message: 'Another variable-size row', timestamp: '08:01', height: 116 },
])

function jumpToSecondRow() {
  scroller.value?.scrollToItem(1, { align: 'start' })
}
</script>

<template>
  <WindowScroller
    ref="scroller"
    :items="rows"
    :item-size="null"
    key-field="id"
    size-field="height"
  >
    <template #before>
      <section>保持在虛擬清單上方的內容。</section>
    </template>

    <template #default="{ item }">
      <article :style="{ height: `${item.height}px` }">
        <strong>{{ item.user }}</strong>
        <div>{{ item.message }}</div>
      </article>
    </template>

    <template #after>
      <footer>虛擬清單後方的內容。</footer>
    </template>
  </WindowScroller>
</template>
```
