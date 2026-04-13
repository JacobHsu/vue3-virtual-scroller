# vue-virtual-scroller 專案引導文件（中文版）

> 適合對象：剛 Clone 此專案的開發新手

---

## 目錄

1. [專案簡介](#1-專案簡介)
2. [專案結構](#2-專案結構)
3. [核心概念：什麼是虛擬捲動？](#3-核心概念什麼是虛擬捲動)
4. [環境準備與啟動](#4-環境準備與啟動)
5. [套件 API 一覽](#5-套件-api-一覽)
6. [元件詳解](#6-元件詳解)
7. [Headless Composables（無介面 API）](#7-headless-composablesapi)
8. [實作範例](#8-實作範例)
9. [測試](#9-測試)
10. [常見問題](#10-常見問題)

---

## 1. 專案簡介

**vue-virtual-scroller** 是一個 Vue 3 套件，讓你可以流暢地渲染「幾萬、幾十萬筆」資料清單，而不會讓瀏覽器卡頓。

- **GitHub**：[Akryum/vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)
- **版本**：v2.0.1（本倉庫目前版本）
- **支援**：Vue 3.3+，僅發布 ESM 格式（需搭配 Vite、Nuxt、Webpack 5 等工具鏈）
- **Vue 2 支援**：請切換至 [v1 分支](https://github.com/Akryum/vue-virtual-scroller/tree/v1/packages/vue-virtual-scroller)

---

## 2. 專案結構

```
vue-virtual-scroller/          ← 根目錄（Monorepo）
├── packages/
│   ├── vue-virtual-scroller/  ← 主套件原始碼（你主要閱讀這裡）
│   │   └── src/
│   │       ├── components/    ← Vue 元件（RecycleScroller、DynamicScroller…）
│   │       ├── composables/   ← Headless API（useRecycleScroller…）
│   │       ├── engine/        ← 虛擬捲動核心邏輯
│   │       ├── directives/    ← 自訂指令（observeVisibility）
│   │       ├── types.ts       ← 所有 TypeScript 型別定義
│   │       └── index.ts       ← 套件對外入口
│   └── demo/                  ← 展示用 Demo 應用
├── docs/                      ← 文件網站（VitePress）
│   └── guide/                 ← 各元件說明文件
├── tests/                     ← E2E 測試（Playwright）
├── package.json               ← 根套件設定（pnpm workspace）
└── pnpm-workspace.yaml        ← Monorepo 工作區設定
```

### 重點目錄說明

| 目錄 | 說明 |
|------|------|
| `packages/vue-virtual-scroller/src/` | 套件主程式碼，閱讀與開發的核心 |
| `packages/demo/` | 互動展示範例，快速看到效果 |
| `docs/guide/` | 每個元件的詳細文件（Markdown） |
| `tests/` | 端對端測試（Playwright） |

---

## 3. 核心概念：什麼是虛擬捲動？

### 問題背景

假設你有 **100,000 筆** 聊天訊息要顯示。若全部渲染到 DOM，瀏覽器需要建立 10 萬個 DOM 節點，頁面會嚴重卡頓。

### 解決方式：只渲染看得見的部分

虛擬捲動的核心思想是：

```
畫面只顯示約 20 個 item（viewport 內的）
↓
使用者往下捲動
↓
把移出畫面的 DOM 節點「回收再利用」，填入新資料
↓
DOM 節點總數永遠維持在少量（約 30~50 個）
```

這就是 **DOM 回收（DOM Recycling）** 技術，也是 `RecycleScroller` 名稱的由來。

---

## 4. 環境準備與啟動

### 系統需求

- **Node.js**：`>= 24`（見根目錄 `package.json` 的 `engines` 欄位）
- **套件管理器**：`pnpm`（版本 10.6.5+）

### 安裝 pnpm（若尚未安裝）

```bash
npm install -g pnpm
```

### 安裝相依套件

```bash
# 在專案根目錄執行
pnpm install
```

### 啟動文件網站（推薦新手先看）

```bash
pnpm docs:dev
# 開啟瀏覽器訪問 http://localhost:5173
```

### 啟動 Demo 應用（看實際效果）

```bash
# 先建置套件本體（必要：Demo 依賴 dist/ 產出，而非 src/）
pnpm build

# 再啟動 Demo
cd packages/demo
pnpm dev
```

> **為什麼要先 build？**
> Demo 的 `package.json` 以 `"vue-virtual-scroller": "workspace:*"` 引用本地套件，
> 實際讀取的是 `packages/vue-virtual-scroller/dist/`。
> 剛 clone 時 `dist/` 不存在，所以必須先執行 `pnpm build` 產出它。
> 之後開發套件原始碼時，可改執行 `pnpm --filter vue-virtual-scroller dev`（watch 模式）讓 dist 保持同步。

### 建置套件

```bash
pnpm build
# 產出至 packages/vue-virtual-scroller/dist/
```

---

## 5. 套件 API 一覽

在你的 Vue 專案中安裝此套件後，可以這樣引入：

```bash
npm install vue-virtual-scroller
```

**全域註冊（一次安裝所有元件）**

```js
// main.js
import VueVirtualScroller from 'vue-virtual-scroller'
import 'vue-virtual-scroller/index.css'  // ⚠️ 必須引入 CSS

app.use(VueVirtualScroller)
```

**按需引入（推薦）**

```js
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/index.css'

app.component('RecycleScroller', RecycleScroller)
```

---

## 6. 元件詳解

本套件提供四個主要元件，依使用情境選擇：

### 6.1 RecycleScroller — 固定高度清單

**適合情境**：每個 item 高度相同（或已知），追求最佳效能。

```vue
<template>
  <RecycleScroller
    class="scroller"
    :items="list"
    :item-size="48"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="user-item">{{ item.name }}</div>
  </RecycleScroller>
</template>

<style scoped>
.scroller {
  height: 400px;  /* ⚠️ 必須設定容器高度 */
}
.user-item {
  height: 48px;   /* ⚠️ 必須和 item-size 一致 */
}
</style>
```

**重要 Props**

| Prop | 預設值 | 說明 |
|------|--------|------|
| `items` | 必填 | 資料陣列 |
| `item-size` | `null` | 每個 item 的固定高度（px） |
| `key-field` | `'id'` | 資料中作為唯一識別的欄位名稱 |
| `buffer` | `200` | 視窗外預先渲染的像素範圍 |
| `direction` | `'vertical'` | 捲動方向，`'horizontal'` 為橫向 |
| `shift` | `false` | 在清單開頭插入資料時保持捲動位置（適合聊天室） |

---

### 6.2 DynamicScroller — 動態高度清單

**適合情境**：item 高度不固定（如聊天訊息、新聞卡片），需要在渲染後自動量測高度。

需要搭配 `DynamicScrollerItem` 使用：

```vue
<template>
  <DynamicScroller
    class="scroller"
    :items="messages"
    :min-item-size="54"
    key-field="id"
  >
    <template #default="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :size-dependencies="[item.content]"
        :data-index="index"
      >
        <div class="message">{{ item.content }}</div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
```

> **注意**：`DynamicScroller` 效能比 `RecycleScroller` 略低，因為需要即時量測 item 尺寸。能用固定高度就用 `RecycleScroller`。

---

### 6.3 WindowScroller — 跟隨頁面捲動

**適合情境**：清單不在固定高度的容器內，而是跟隨整個頁面捲動（類似無限捲動的文章頁）。

```vue
<template>
  <WindowScroller
    :items="posts"
    :item-size="200"
    key-field="id"
    v-slot="{ item }"
  >
    <PostCard :post="item" />
  </WindowScroller>
</template>
```

---

### 6.4 元件 Exposed 方法

透過 `useTemplateRef` 取得元件實例後，可以呼叫這些方法：

```vue
<script setup>
const scrollerRef = useTemplateRef('scroller')

// 捲動到指定 index 的 item
scrollerRef.value.scrollToItem(100)

// 捲動到指定像素位置
scrollerRef.value.scrollToPosition(500)

// 取得目前可見範圍
const { start, end } = scrollerRef.value.getScroll()
</script>

<template>
  <RecycleScroller ref="scroller" ... />
</template>
```

---

## 7. Headless Composables（無介面 API）

當你需要 **自訂 HTML 結構**（例如 `<table>` 虛擬捲動），可以使用 Composable API，只獲取虛擬化邏輯，不綁定元件模板。

```ts
// 固定高度
import { useRecycleScroller } from 'vue-virtual-scroller'

// 動態高度
import { useDynamicScroller } from 'vue-virtual-scroller'

// 頁面捲動
import { useWindowScroller } from 'vue-virtual-scroller'
```

**TypeScript 泛型支援**

```ts
interface User {
  id: string
  name: string
}

// 型別推導：visibleItems 的 item 型別為 User
const { visibleItems } = useRecycleScroller<User>(options, scrollerEl)
```

---

## 8. 實作範例

### 範例一：渲染 10 萬筆用戶清單

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/index.css'

interface User {
  id: number
  name: string
  email: string
}

// 產生 100,000 筆測試資料
const users = ref<User[]>(
  Array.from({ length: 100_000 }, (_, i) => ({
    id: i + 1,
    name: `用戶 ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }))
)
</script>

<template>
  <RecycleScroller
    class="user-list"
    :items="users"
    :item-size="64"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="user-row">
      <strong>{{ item.name }}</strong>
      <span>{{ item.email }}</span>
    </div>
  </RecycleScroller>
</template>

<style scoped>
.user-list {
  height: 600px;
  border: 1px solid #eee;
}
.user-row {
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #f0f0f0;
}
</style>
```

### 範例二：聊天室（動態高度 + 固定在底部）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

interface Message {
  id: number
  text: string
  sender: string
}

const messages = ref<Message[]>([])
const scrollerRef = useTemplateRef('scroller')

function addMessage(text: string) {
  messages.value.push({ id: Date.now(), text, sender: 'me' })
  // 捲動到最新訊息
  nextTick(() => scrollerRef.value?.scrollToBottom())
}
</script>

<template>
  <DynamicScroller
    ref="scroller"
    class="chat"
    :items="messages"
    :min-item-size="40"
    key-field="id"
  >
    <template #default="{ item, active }">
      <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[item.text]">
        <div class="bubble">
          <b>{{ item.sender }}</b>：{{ item.text }}
        </div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>

<style scoped>
.chat { height: 500px; }
.bubble { padding: 8px 12px; }
</style>
```

---

## 9. 測試

### 執行所有測試

```bash
pnpm test
```

這會依序執行：
1. ESLint 語法檢查（`pnpm lint`）
2. TypeScript 型別檢查（`pnpm typecheck`）
3. 單元測試 — Vitest（`pnpm test:unit`）
4. E2E 測試 — Playwright（`pnpm test:e2e`）

### 只跑單元測試

```bash
pnpm test:unit
```

### 只跑 E2E 測試

```bash
# 需先建置套件和文件
pnpm build
pnpm test:e2e
```

### 測試檔案位置

| 測試類型 | 位置 |
|----------|------|
| 元件單元測試 | `packages/vue-virtual-scroller/src/components/*.spec.ts` |
| Composable 測試 | `packages/vue-virtual-scroller/src/composables/*.spec.ts` |
| E2E 測試 | `tests/` |

---

## 10. 常見問題

### Q1：清單沒有顯示任何內容？

**最常見原因**：沒有設定容器高度。

```css
/* ✅ 必須設定明確高度，否則捲動容器高度為 0 */
.scroller {
  height: 400px;
}
```

### Q2：item 顯示位置錯亂？

確認 **item 實際 CSS 高度** 與 **`item-size` prop 值** 完全一致：

```css
/* item-size="48" ↔ CSS height: 48px，必須相符 */
.my-item {
  height: 48px;
}
```

### Q3：切換到其他 item 時資料顯示錯誤？

原因：`key-field` 沒有正確指向資料的唯一識別欄位。

```html
<!-- ❌ 若資料沒有 id 欄位 -->
<RecycleScroller :items="list" :item-size="32" />

<!-- ✅ 指定正確的唯一識別欄位 -->
<RecycleScroller :items="list" :item-size="32" key-field="userId" />
```

### Q4：動態高度模式效能很差？

`DynamicScroller` 需要每個 item 渲染後才能量測高度，item 數量龐大時確實較慢。建議：
1. 優先嘗試把 item 設計成固定高度，改用 `RecycleScroller`
2. 搭配 `:size-dependencies` 只在真正影響高度的資料變動時才重新量測
3. 使用 `cache` / `cacheSnapshot` 儲存已量測的尺寸，避免重複計算

### Q5：如何在水平方向捲動？

```html
<RecycleScroller
  :items="list"
  :item-size="200"
  direction="horizontal"
>
```

---

## 延伸閱讀

- [官方文件網站](https://vue-virtual-scroller.netlify.app/)
- [Live Demo](https://vue-virtual-scroller-demo.netlify.app/)
- [CHANGELOG](./CHANGELOG.md) — 版本更新紀錄
- `docs/guide/` — 各元件完整 API 文件（英文原版）
