<script setup>
import DynamicScrollerDocDemo from '../../.vitepress/components/demos/DynamicScrollerDocDemo.vue'
</script>

# DynamicScroller 展示

此展示專注於列高在渲染前未知的情境，是選擇 `DynamicScroller` 的典型使用案例。

## 動手試試

- 篩選清單以確認虛擬化仍能正確追蹤對應的列。
- 點擊訊息以變更其內容並觸發重新量測。
- 調整最小列高以觀察初始估算對首次渲染的影響。
- 觀察可見範圍，了解捲動時視窗如何同步更新。

<DynamicScrollerDocDemo />


## 範例程式碼

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { createMessages, mutateMessage } from '../.vitepress/components/demos/demo-data'

const search = ref('')
const messages = ref(createMessages(600, 101))
const minItemSize = ref(68)

const filteredMessages = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term)
    return messages.value
  return messages.value.filter(item => item.message.toLowerCase().includes(term) || item.user.toLowerCase().includes(term))
})

function randomizeMessage(index: number) {
  const row = filteredMessages.value[index]
  if (!row)
    return
  mutateMessage(row, Date.now() % 997)
}
</script>

<template>
  <DynamicScroller
    :items="filteredMessages"
    :min-item-size="minItemSize"
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.message]"
        @click="randomizeMessage(index)"
      >
        <strong>{{ item.user }}</strong>
        <p>{{ item.message }}</p>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
```
