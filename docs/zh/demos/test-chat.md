<script setup>
import TestChatDocDemo from '../../.vitepress/components/demos/TestChatDocDemo.vue'
</script>

# 測試聊天展示

此展示是頻繁追加更新時間軸的精簡壓力測試。當您需要確認清單在頻繁批次更新時的行為，可使用此展示。

## 動手試試

- 加入少量和大量批次訊息。
- 確認清單在新內容到達時保持固定在底部。
- 在測試聊天式渲染時作為快速基準使用。

<TestChatDocDemo />


## 範例程式碼

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { createSimpleStrings } from '../.vitepress/components/demos/demo-data'

const pool = createSimpleStrings(1200, 1303)
const scroller = useTemplateRef<InstanceType<typeof DynamicScroller>>('scroller')
const rows = ref<{ id: number, text: string }[]>([])

let nextId = 1

function addItems(count = 1) {
  for (let i = 0; i < count; i++) {
    rows.value.push({
      id: nextId,
      text: pool[nextId % pool.length],
    })
    nextId++
  }
  requestAnimationFrame(() => scroller.value?.scrollToBottom())
}
</script>

<template>
  <DynamicScroller
    ref="scroller"
    :items="rows"
    :min-item-size="48"
    @resize="scroller?.scrollToBottom()"
  >
    <template #default="{ item, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.text]"
      >
        {{ item.text }}
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
```
