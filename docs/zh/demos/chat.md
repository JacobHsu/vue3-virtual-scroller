<script setup>
import ChatStreamDocDemo from '../../.vitepress/components/demos/ChatStreamDocDemo.vue'
</script>

# 聊天串流展示

此展示呈現典型的只追加串流，例如聊天、日誌或即時動態訊息流。新列不斷加入，同時視圖保持聚焦在最新內容。

## 動手試試

- 啟動或停止串流，觀察清單在持續更新時的行為。
- 一次加入大批訊息，確認視圖能快速跟上。
- 在資料持續增長時套用篩選條件。
- 確認清單保持在最新訊息附近，而非向上漂移。

<ChatStreamDocDemo />


## 範例程式碼

```vue
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { createMessages } from '../.vitepress/components/demos/demo-data'

const scroller = useTemplateRef<InstanceType<typeof DynamicScroller>>('scroller')
const basePool = createMessages(1500, 303)

let nextId = 1
const stream = ref(createMessages(20, 707).map(item => ({ ...item, id: nextId++ })))
const search = ref('')
const streaming = ref(false)

let streamTimer: ReturnType<typeof setInterval> | undefined

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term)
    return stream.value
  return stream.value.filter(item => item.message.toLowerCase().includes(term) || item.user.toLowerCase().includes(term))
})

function appendBatch(amount = 8) {
  for (let i = 0; i < amount; i++) {
    const template = basePool[(nextId + i) % basePool.length]
    stream.value.push({
      ...template,
      id: nextId++,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
  }
  requestAnimationFrame(() => scroller.value?.scrollToBottom())
}

function startStream() {
  if (streaming.value)
    return
  streaming.value = true
  appendBatch(12)
  streamTimer = setInterval(() => {
    appendBatch(6)
  }, 320)
}

function stopStream() {
  streaming.value = false
  if (streamTimer) {
    clearInterval(streamTimer)
    streamTimer = undefined
  }
}

onBeforeUnmount(stopStream)
</script>

<template>
  <DynamicScroller
    ref="scroller"
    :items="filteredItems"
    :min-item-size="62"
  >
    <template #default="{ item, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.message]"
      >
        <strong>{{ item.user }}</strong>
        <p>{{ item.message }}</p>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
```
