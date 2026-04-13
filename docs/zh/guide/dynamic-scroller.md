# DynamicScroller

`DynamicScroller` 適合 item 尺寸無法事先得知的情況。它在 item 渲染後即時量測並自動更新捲動版面。

## 基本用法

```vue
<script>
export default {
  props: {
    items: Array,
  },
}
</script>

<template>
  <DynamicScroller
    :items="items"
    :min-item-size="54"
    class="scroller"
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[
          item.message,
        ]"
        :data-index="index"
      >
        <div class="avatar">
          <img
            :key="item.avatar"
            :src="item.avatar"
            alt="avatar"
            class="image"
          >
        </div>
        <div class="text">
          {{ item.message }}
        </div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<style scoped>
.scroller {
  height: 100%;
}
</style>
```

## TypeScript 泛型

在 Vue 3.3+ 中，`DynamicScroller` 會從 `items` 推導 item 型別，讓 default slot 中的 `item` 與 `itemWithSize.item` 保持型別安全：

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: string
  text: string
}

const messages = ref<Message[]>([])
</script>

<template>
  <DynamicScroller :items="messages" :min-item-size="48">
    <template #default="{ item, itemWithSize }">
      {{ item.text }}
      {{ itemWithSize.item.text }}
    </template>
  </DynamicScroller>
</template>
```

如需型別化的 `getItemSize(item)` 呼叫與其他 headless 輔助方法，請改用 [`useDynamicScroller`](./use-dynamic-scroller) 並明確指定泛型。

## 重要注意事項

- 必須設定 `minItemSize`，讓首次渲染有合理的初始估算值。
- `DynamicScroller` 不會自動判斷哪些資料變動會影響版面。請將這些值傳給 [DynamicScrollerItem](./dynamic-scroller-item)，讓它知道何時需要重新量測。
- 不需要在每個 item 上設定 `size` 欄位。
- `shift` 和 `cache` 在此也可用，因為 `DynamicScroller` 擴展自 `RecycleScroller`。

## Props

`DynamicScroller` 支援所有 [RecycleScroller 的 props](./recycle-scroller#props)。

::: tip
不建議修改 `sizeField` prop，因為所有尺寸管理都在內部完成。
:::

在動態路徑上最重要的額外功能是：

- `shift`：在預置插入時保持 viewport 錨定
- `cache`：還原先前已知的量測尺寸

## 事件

`DynamicScroller` 發出與 [RecycleScroller](./recycle-scroller#events) 相同的所有事件。

## Default scoped slot props

Default slot 接收與 [RecycleScroller](./recycle-scroller#default-scoped-slot-props) 相同的 scoped props。

## 其他 slots

`before`、`after` 和 `empty` slots 的行為與 [RecycleScroller](./recycle-scroller#其他-slots) 相同。

## Exposed 方法

透過 `useTemplateRef` 建立 template ref 後，`DynamicScroller` 提供與 `RecycleScroller` 相同的捲動輔助方法：

- `scrollToItem(index, options?)`
- `scrollToPosition(position, options?)`
- `findItemIndex(offset)`
- `getItemOffset(index)`
- `cacheSnapshot`
- `restoreCache(snapshot)`

以及動態模式專屬的輔助方法：

- `getItemSize(item, index?)`
- `scrollToBottom()`
- `forceUpdate(clear?)`
