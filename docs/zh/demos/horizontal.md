<script setup>
import HorizontalDocDemo from '../../.vitepress/components/demos/HorizontalDocDemo.vue'
</script>

# 水平捲動展示

此展示呈現卡片寬度從渲染內容量測的水平清單。當項目寬度不固定但清單仍需虛擬化時，這是很好的選擇。

## 動手試試

- 使用觸控板或按住 `Shift` 再使用滑鼠滾輪進行水平捲動。
- 篩選卡片，確認清單能順暢重排。
- 比較短卡片與長卡片，觀察可變寬度的處理方式。

<HorizontalDocDemo />


## 範例程式碼

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { createMessages } from '../.vitepress/components/demos/demo-data'

const search = ref('')
const rows = ref(createMessages(500, 909))

const filteredRows = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term)
    return rows.value
  return rows.value.filter(row => row.message.toLowerCase().includes(term) || row.user.toLowerCase().includes(term))
})

function cardWidth(message: string) {
  return Math.max(180, Math.min(440, Math.round(message.length * 0.95)))
}
</script>

<template>
  <DynamicScroller
    :items="filteredRows"
    :min-item-size="180"
    direction="horizontal"
  >
    <template #default="{ item, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.message]"
        :style="{ width: `${cardWidth(item.message)}px` }"
      >
        {{ item.message }}
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
```
