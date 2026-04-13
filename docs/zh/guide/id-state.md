# IdState

`IdState` 是一個小型的 mixin，方便在 [RecycleScroller](./recycle-scroller) 內部渲染的元件使用。

## 為什麼需要它？

`RecycleScroller` 會重複使用元件實例，這對效能很好，但這意味著普通 Vue `data` 在 view 被回收時可能會被不同的 item 共用。

`IdState` 提供一個 `idState` 物件，行為類似本地元件狀態，但其作用域綁定到特定的 item 識別碼。你可以透過 `idProp` 參數自訂使用哪個識別碼。

## 範例

在此範例中，狀態的作用域綁定到 `item.id`：

```vue
<script>
import { IdState } from 'vue-virtual-scroller'

export default {
  mixins: [
    IdState({
      // 可以自訂此設定
      idProp: vm => vm.item.id,
    }),
  ],

  props: {
    // 清單中的 item
    item: Object,
  },

  // 這取代了 data () { ... }
  idState() {
    return {
      replyOpen: false,
      replyText: '',
    }
  },
}
</script>

<template>
  <div class="question">
    <p>{{ item.question }}</p>
    <button @click="idState.replyOpen = !idState.replyOpen">
      回覆
    </button>
    <textarea
      v-if="idState.replyOpen"
      v-model="idState.replyText"
      placeholder="輸入你的回覆"
    />
  </div>
</template>
```

## 參數

| 參數 | 預設值 | 說明 |
|------|--------|------|
| `idProp` | `vm => vm.item.id` | 元件上的欄位名稱（例如：`'id'`）或回傳 id 的函式。 |
