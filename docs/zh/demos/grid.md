<script setup>
import GridDocDemo from '../../.vitepress/components/demos/GridDocDemo.vue'
</script>

# 格線展示

此展示呈現當每張卡片使用固定大小時，`RecycleScroller` 如何驅動格線版面。適合用於相簿、目錄和卡片式儀表板。

## 動手試試

- 更改每列卡片數量，觀察版面如何自適應。
- 跳轉到較深的項目索引，測試程式化導覽。
- 捲動清單，確認數千張卡片仍然流暢。

<GridDocDemo />


## 範例程式碼

```vue
<script setup lang="ts">
import type { Person } from '../.vitepress/components/demos/demo-data'
import { computed, ref, useTemplateRef } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { createPeopleRows } from '../.vitepress/components/demos/demo-data'

interface GridCard extends Person {
  id: number
}

type RecycleScrollerExposed = InstanceType<typeof RecycleScroller> & {
  visiblePool?: Array<{ nr: { index: number } }>
}

const scroller = useTemplateRef<RecycleScrollerExposed>('scroller')
const gridItems = ref(5)
const scrollTo = ref(300)

const rawRows = createPeopleRows(2500, false, 111)

const cards = computed<GridCard[]>(() =>
  rawRows
    .filter(row => row.type === 'person')
    .map((row) => {
      const person = row.value as Person
      return {
        id: row.id,
        ...person,
      }
    }),
)

const renderedCardIndexes = computed(() =>
  (scroller.value?.visiblePool ?? [])
    .map(view => view.nr.index)
    .sort((a, b) => a - b),
)

function jump() {
  const target = Math.min(Math.max(0, scrollTo.value), cards.value.length - 1)
  scroller.value?.scrollToItem(target)
}
</script>

<template>
  <RecycleScroller
    ref="scroller"
    :items="cards"
    :item-size="166"
    :grid-items="gridItems"
    :item-secondary-size="176"
  >
    <template #default="{ item }">
      <article>
        <strong>{{ item.initials }}</strong>
        <span>{{ item.name }}</span>
      </article>
    </template>
  </RecycleScroller>

  <p>已渲染卡片：{{ renderedCardIndexes.map(index => `#${index}`).join(', ') }}</p>
</template>
```
