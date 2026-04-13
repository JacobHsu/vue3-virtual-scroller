# 快速開始

<div class="badges">

[![npm](https://img.shields.io/npm/v/vue-virtual-scroller.svg)](https://npmx.dev/package/vue-virtual-scroller)
[![npm](https://img.shields.io/npm/dm/vue-virtual-scroller.svg)](https://npmx.dev/package/vue-virtual-scroller)
[![vue3](https://img.shields.io/badge/vue-3.x-brightgreen.svg)](https://vuejs.org/)

</div>

`vue-virtual-scroller` 讓你在 Vue 中渲染大型清單，而不必一次掛載所有 item。

如果你是初次使用，請從這裡開始，再前往[展示範例](/demos/)或[影片展示](https://www.youtube.com/watch?v=Uzq1KQV8f4k)觀看實際效果。

如果你需要支援 Vue 2，請使用 [v1 分支](https://github.com/Akryum/vue-virtual-scroller/tree/v1/packages/vue-virtual-scroller)。

## 安裝

```sh
npm install vue-virtual-scroller
```

```sh
yarn add vue-virtual-scroller
```

```sh
pnpm add vue-virtual-scroller
```

## 設定

`vue-virtual-scroller` 僅發布 ESM 格式，需要 Vue 3.3+ 才能使用泛型元件型別。請搭配支援 ESM 的工具鏈使用，例如 Vite、Nuxt、Rollup 或 webpack 5。

## TypeScript 泛型

在 Vue 3.3+ 中，元件 API 會從 `items` prop 推導 item 型別，因此 scoped slot props（如 `item`）無需額外型別標注即可保持型別安全。

Headless composables 也提供明確的泛型，讓你在需要更嚴格的型別檢查時使用：

```ts
const recycleScroller = useRecycleScroller<User>(options, scrollerEl)
const dynamicScroller = useDynamicScroller<Message>(options)
const windowScroller = useWindowScroller<Row>(options, rootEl)
```

對於物件類型的 item，composables 也會驗證 `keyField` 和動態尺寸 `sizeField` 是否符合宣告的 item 型別。

### Plugin 方式引入

安裝全部元件：

```js
import VueVirtualScroller from 'vue-virtual-scroller'

app.use(VueVirtualScroller)
```

或只註冊需要的元件：

```js
import { RecycleScroller } from 'vue-virtual-scroller'

app.component('RecycleScroller', RecycleScroller)
```

::: warning
請務必引入套件的 CSS：

```js
import 'vue-virtual-scroller/index.css'
```
:::

## 元件

`vue-virtual-scroller` 包含以下元件：

- [**RecycleScroller**](./recycle-scroller) — 適合 item 尺寸已知或已存於資料中的清單，是核心元件。

- [**DynamicScroller**](./dynamic-scroller) — 基於 `RecycleScroller`，在無法事先得知 item 尺寸時，渲染後自動量測。

- [**DynamicScrollerItem**](./dynamic-scroller-item) — 在 `DynamicScroller` 內部使用的量測包裝元件。

- [**WindowScroller**](./window-scroller) — 以瀏覽器視窗為捲動容器的版本，適合跟隨頁面捲動的清單。

## Headless API

當你想使用虛擬化引擎但不受限於內建的元件結構時（例如 `<table>` 元素或高度自訂的版面），請使用 Headless API。

- 若 item 尺寸固定或已知，從 [**useRecycleScroller**](./use-recycle-scroller) 開始。
- 若需要在渲染後由 DOM 量測尺寸，改用 [**useDynamicScroller**](./use-dynamic-scroller)。
- 若需要頁面捲動驅動，但仍要自訂包裝結構，使用 [**useWindowScroller**](./use-window-scroller)。

<style scoped>
.badges p {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
