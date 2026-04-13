<script setup>
import ShiftDocDemo from '../../.vitepress/components/demos/ShiftDocDemo.vue'
</script>

# Shift（預置錨定）展示

此展示聚焦於前置錨定功能。它展示當舊列插入視窗上方時的行為，這是聊天歷史和反向時間軸中常見的模式。

## 動手試試

- 啟用 shift 並新增舊列，確認可見內容保持不動。
- 關閉 shift 後重複相同操作，觀察視窗跳動的差異。
- 在前置資料前先移動到清單中間，讓差異更容易看出來。

<ShiftDocDemo />

## 範例程式碼

```vue
<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import { createMessages } from '../.vitepress/components/demos/demo-data'

const scroller = useTemplateRef<InstanceType<typeof DynamicScroller>>('scroller')
const basePool = createMessages(320, 911)
const shiftEnabled = ref(true)
const rows = ref(basePool.slice(120, 156))

async function prepend(count = 10) {
  rows.value = [
    ...basePool.slice(120 - count, 120),
    ...rows.value,
  ]
}

async function jumpToMiddle() {
  await nextTick()
  scroller.value?.scrollToItem(18, { align: 'center' })
}
</script>

<template>
  <DynamicScroller
    ref="scroller"
    :items="rows"
    :min-item-size="62"
    :shift="shiftEnabled"
  >
    <template #default="{ item, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.message]"
      >
        {{ item.message }}
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
```
