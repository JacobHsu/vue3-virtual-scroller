<script setup>
import SimpleListDocDemo from '../../.vitepress/components/demos/SimpleListDocDemo.vue'
</script>

# 簡單清單展示

此展示在同一資料集上比較兩種最常用的策略：使用 `RecycleScroller` 的固定大小虛擬化，以及使用 `DynamicScroller` 的量測虛擬化。

## 動手試試

- 切換動態大小開關，直接比較兩種渲染模式。
- 篩選清單並比較兩種模式的回應方式。
- 在決定使用 `DynamicScroller` 或 `RecycleScroller` 時，可用此作為快速參考。

<SimpleListDocDemo />


## 範例程式碼

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DynamicScroller, DynamicScrollerItem, RecycleScroller } from 'vue-virtual-scroller'
import { createSimpleStrings } from '../.vitepress/components/demos/demo-data'

const useDynamic = ref(true)
const search = ref('')
const rows = ref(createSimpleStrings(4000, 505))

const filteredRows = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term)
    return rows.value
  return rows.value.filter(item => item.toLowerCase().includes(term))
})
</script>

<template>
  <DynamicScroller
    v-if="useDynamic"
    :items="filteredRows"
    :min-item-size="58"
  >
    <template #default="{ item, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item]"
      >
        {{ item }}
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>

  <RecycleScroller
    v-else
    :items="filteredRows"
    :item-size="58"
  >
    <template #default="{ item }">
      {{ item }}
    </template>
  </RecycleScroller>
</template>
```
