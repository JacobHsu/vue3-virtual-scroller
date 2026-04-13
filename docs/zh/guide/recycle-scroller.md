# RecycleScroller

`RecycleScroller` 是 Vue 虛擬清單的核心元件。它只渲染可見的 item，並在捲動時重複使用元件實例與 DOM 節點。

## 基本用法

使用預設的 scoped slot 渲染清單中的每個 item：

```vue
<script>
export default {
  props: {
    list: Array,
  },
}
</script>

<template>
  <RecycleScroller
    v-slot="{ item }"
    class="scroller"
    :items="list"
    :item-size="32"
    key-field="id"
  >
    <div class="user">
      {{ item.name }}
    </div>
  </RecycleScroller>
</template>

<style scoped>
.scroller {
  height: 100%;
}

.user {
  height: 32px;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
</style>
```

## TypeScript 泛型

在 Vue 3.3+ 中，`RecycleScroller` 會從 `items` 推導 item 型別，讓 default slot 在 TypeScript 中保持型別感知：

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface Message {
  id: string
  text: string
  size: number
}

const messages = ref<Message[]>([])
</script>

<template>
  <RecycleScroller :items="messages" :item-size="32">
    <template #default="{ item }">
      {{ item.text.toUpperCase() }}
    </template>
  </RecycleScroller>
</template>
```

若想對 `keyField` 或 `sizeField` 進行編譯期驗證，請改用 Headless API [`useRecycleScroller`](./use-recycle-scroller) 並明確指定泛型參數。

## 重要注意事項

::: warning
請自行透過 CSS 設定 scroller 元素和 item 元素的尺寸。除非使用[可變尺寸模式](#可變尺寸模式)，否則每個 item 的高度（水平模式則為寬度）必須一致。
:::

::: warning
如果 item 是物件，scroller 需要每個 item 的穩定唯一識別欄位。預設使用 `id` 欄位。若資料使用不同的屬性名稱，請透過 `keyField` 指定。
:::

- 避免在 `RecycleScroller` 內使用 functional components，因為 view 會被重複使用，通常反而比較慢。
- Item 元件在 `item` prop 改變時必須能正確更新，而無需重建元件。computed 屬性與 watchers 通常是正確的工具。
- 不需要在清單內容本身設定 `key`，但巢狀的 `<img>` 元素仍應使用 key 避免載入異常。
- 瀏覽器對超大 DOM 元素有尺寸限制，實際上限約為幾十萬筆 item，視瀏覽器而定。
- 由於 DOM 元素會被重複使用，懸停樣式通常應依賴提供的 `hover` class，而非 `:hover` 選擇器。

## 運作原理

- `RecycleScroller` 為清單的可見部分建立可重複使用的 view 池。
- 每個 view 持有一個已渲染的 item，之後可被重新指派給其他 item。
- 如果你渲染多種 item 類型，每種類型會有自己的回收池，讓 Vue 可以重複使用相容的元件樹。
- 移出畫面的 view 會被停用，並在新 item 進入 viewport 時重新使用。

垂直模式的內部結構如下：

```html
<RecycleScroller>
  <!-- 帶有預先計算總高度的包裝元素 -->
  <wrapper
    :style="{ height: computedTotalHeight + 'px' }"
  >
    <!-- 每個 view 被移位到計算出的位置 -->
    <view
      v-for="view of pool"
      :style="{ transform: 'translateY(' + view.computedTop + 'px)' }"
    >
      <!-- 你的元素將在這裡渲染 -->
      <slot
        :item="view.item"
        :index="view.nr.index"
        :active="view.nr.used"
      />
    </view>
  </wrapper>
</RecycleScroller>
```

捲動時，大多數 view 只是被移到新位置並接收更新的 slot props，這使元件建立和 DOM 變動維持在最低限度，也是大部分效能提升的來源。

## Props

| Prop | 預設值 | 說明 |
|------|--------|------|
| `items` | — | 要在 scroller 中顯示的 item 陣列。 |
| `direction` | `'vertical'` | 捲動方向，`'vertical'` 或 `'horizontal'`。 |
| `itemSize` | `null` | item 的顯示高度（水平模式為寬度），單位 px，用於計算捲動大小和位置。設為 `null` 時使用[可變尺寸模式](#可變尺寸模式)。 |
| `gridItems` | — | 在同一行顯示多少個 item 以建立格線。必須設定 `itemSize` 才能使用此 prop（不支援動態尺寸）。 |
| `itemSecondarySize` | — | 格線模式下 item 的次要尺寸（垂直模式為寬度，水平模式為高度）。未設定時預設為 `itemSize`。 |
| `minItemSize` | — | item 高度（或水平模式下的寬度）未知時使用的最小尺寸。 |
| `sizeField` | `'size'` | 可變尺寸模式中用於取得 item 尺寸的欄位。 |
| `typeField` | `'type'` | 用於區分清單中不同元件類型的欄位。每種不同的 type 會建立一個回收 item 的池。 |
| `keyField` | `'id'` | 用於識別 item 並最佳化已渲染 view 管理的欄位。 |
| `shift` | `false` | 在清單開頭插入 item 時保持 viewport 錨定。適合聊天類 feed 和反向時間軸。 |
| `cache` | — | 由 `cacheSnapshot` 回傳的快取快照，用於重新掛載後還原已知的 item 尺寸。 |
| `prerender` | `0` | 為伺服器端渲染（SSR）渲染固定數量的 item。 |
| `buffer` | `200` | 在捲動可見區域邊緣增加的像素，讓更遠的 item 提前開始渲染。 |
| `emitUpdate` | `false` | 每次虛擬 scroller 內容更新時發出 `'update'` 事件（可能影響效能）。 |
| `updateInterval` | `0` | 捲動後檢查 view 更新的間隔（ms）。設為 `0` 時在下一個動畫影格檢查。 |
| `listClass` | `''` | 加到 item 清單包裝元素的自訂 class。 |
| `itemClass` | `''` | 加到每個 item 的自訂 class。 |
| `listTag` | `'div'` | 渲染清單包裝元素時使用的 HTML 標籤。 |
| `itemTag` | `'div'` | 渲染清單 item 時使用的 HTML 標籤（default slot 內容的直接父元素）。 |

## 事件

| 事件 | 說明 |
|------|------|
| `resize` | scroller 尺寸改變時發出。 |
| `visible` | scroller 在頁面中被視為可見時發出。 |
| `hidden` | scroller 在頁面中被隱藏時發出。 |
| `update(startIndex, endIndex, visibleStartIndex, visibleEndIndex)` | 每次 view 更新時發出，僅在 `emitUpdate` prop 為 `true` 時有效。 |
| `scroll-start` | 第一個 item 被渲染時發出。 |
| `scroll-end` | 最後一個 item 被渲染時發出。 |

## Default scoped slot props

| Prop | 說明 |
|------|------|
| `item` | 在 view 中渲染的 item。 |
| `index` | 反映每個 item 在 `items` 陣列中的位置。 |
| `active` | view 是否為啟用狀態。啟用的 view 被視為可見並由 RecycleScroller 進行位置計算；未啟用的 view 對使用者不可見。若 view 為未啟用狀態，應跳過所有與渲染相關的計算。 |

## 其他 slots

`empty` slot 只在 `items` 為空時渲染。

```html
<main>
  <slot name="before"></slot>
  <wrapper>
    <!-- 回收 view 池在此 -->
    <slot name="empty"></slot>
  </wrapper>
  <slot name="after"></slot>
</main>
```

範例：

```vue
<RecycleScroller
  class="scroller"
  :items="list"
  :item-size="32"
>
  <template #before>
    這是顯示在 item 前面的訊息！
  </template>

  <template v-slot="{ item }">
    <div class="user">
      {{ item.name }}
    </div>
  </template>
</RecycleScroller>
```

## Exposed 方法

透過 `useTemplateRef` 取得 `RecycleScroller` 的 template ref 後，元件提供以下輔助方法：

- `scrollToItem(index, options?)`
- `scrollToPosition(position, options?)`
- `findItemIndex(offset)`
- `getItemOffset(index)`
- `getItemSize(index)`
- `cacheSnapshot`
- `restoreCache(snapshot)`
- `updateVisibleItems(itemsChanged, checkPositionDiff?)`

捲動方法的可選 `options` 物件支援：

- `align`：`'start' | 'center' | 'end' | 'nearest'`
- `smooth`：使用原生平滑捲動（若瀏覽器支援）
- `offset`：在計算目標位置上加減固定像素偏移

`align: 'nearest'` 只在目標 item 不在當前 viewport 內時才捲動。

## 頁面模式

若清單應跟隨視窗捲動，請改用 [`WindowScroller`](./window-scroller)。

## 預置錨定與快取還原

在清單開頭插入 item 且希望當前內容保持視覺錨定時，請使用 `shift`。

在同一個清單重新掛載時，若想重複使用先前已知的 item 尺寸而不重新量測，請搭配 `cache` prop 或 `restoreCache(snapshot)` 使用 `cacheSnapshot`。

詳見 [Shift 展示範例](/demos/shift)。

## 可變尺寸模式

::: warning
此模式在 item 數量龐大時可能效能較差，請謹慎使用。
:::

省略 `itemSize` 或設為 `null` 時，scroller 切換為可變尺寸模式。此時每個 item 必須以數值欄位提供自身尺寸。

::: warning
仍需透過 CSS 正確設定 item 的尺寸（例如使用 class）。
:::

使用 `sizeField` prop（預設為 `'size'`）指定儲存尺寸值的欄位。

範例：

```js
const items = [
  {
    id: 1,
    label: '標題',
    size: 64,
  },
  {
    id: 2,
    label: 'Foo',
    size: 32,
  },
  {
    id: 3,
    label: 'Bar',
    size: 32,
  },
]
```

## Buffer

使用 `buffer` prop（單位 px）在可見 viewport 之外額外渲染一些範圍。例如 `buffer: 1000` 表示 scroller 會從當前 viewport 下方 1000 px 開始渲染 item，並保持上方 1000 px 的 item 已掛載。

預設值為 `200`。

```html
<RecycleScroller :buffer="200" />
```

## 伺服器端渲染（SSR）

可透過 `prerender` prop 設定在伺服器端虛擬 scroller 內要渲染的 item 數量：

```html
<RecycleScroller
  :items="items"
  :item-size="42"
  :prerender="10"
>
```
