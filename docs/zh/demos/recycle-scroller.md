<script setup>
import RecycleScrollerDocDemo from '../../.vitepress/components/demos/RecycleScrollerDocDemo.vue'
</script>

# RecycleScroller 展示

此展示呈現 `RecycleScroller` 處理大型固定高度清單的主要使用流程。

## 動手試試

- 修改項目數量來模擬更大的資料集。
- 調整緩衝區大小以了解預先渲染的行為。
- 跳轉到指定項目來測試 `scrollToItem`。

<RecycleScrollerDocDemo />


## 範例程式碼

```vue
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { createPeopleRows } from '../.vitepress/components/demos/demo-data'

const ITEM_SIZE = 74

const count = ref(8000)
const buffer = ref(240)
const rows = ref([])

function regenerate() {
  rows.value = createPeopleRows(Math.max(50, count.value), false, 17)
}

watch(count, regenerate)
onMounted(regenerate)
</script>

<template>
  <RecycleScroller
    :items="rows"
    :item-size="ITEM_SIZE"
    :buffer="buffer"
    key-field="id"
  >
    <template #default="{ item, index }">
      <div
        :style="{ height: `${ITEM_SIZE}px` }"
      >
        {{ item.value.name }} ({{ index }})
      </div>
    </template>
  </RecycleScroller>
</template>
```
