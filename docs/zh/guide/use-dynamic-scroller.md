# useDynamicScroller（Headless 動態 Item）

`useDynamicScroller` 是 item 尺寸必須在渲染後量測的虛擬清單 headless composable。

當你需要自訂標記，但 item 尺寸仍需在渲染後從 DOM 量測時，請使用此 API。

## 適用情境

- 你需要語義化標記，例如 table row、list item 或設計系統包裝元素。
- Item 高度或寬度無法事先得知。
- 你仍然需要池化渲染和 DOM 重用，而非每次都從頭渲染所有可見 item。
- 你需要動態量測但不依賴內建的包裝元件標記。

## 心智模型

- `useDynamicScroller` 結合了兩個關注點：
  - `useRecycleScroller`：用於池化渲染、捲動計算和虛擬化狀態
  - `vDynamicScrollerItem`：用於每個 item 的尺寸量測
- 從 `pool` 渲染。
- `pool` 中的每個 `view` 包裝了一個內部的 `ItemWithSize`，因此原始 item 位於 `view.item.item`。
- `totalSize` 仍屬於你的內部包裝元素。
- 當你綁定 `v-dynamic-scroller-item="{ view, ... }"` 時，該指令會：
  - 從池化 view 推導 `item`、`active` 和 `index`
  - 量測 DOM 元素以更新未知尺寸
  - 自動套用回收 view 的定位和可見性樣式
  - 對 table row 使用 `top` 定位，對一般元素使用 transform

## TypeScript 泛型

傳入 item 型別作為泛型參數，以獲得型別化的 headless 輔助方法和嚴格的 `item` 輸入：

```ts
const dynamicScroller = useDynamicScroller<Message>({
  items: messages.value,
  keyField: 'id',
  direction: 'vertical',
  minItemSize: 48,
  el: scrollerEl,
})

dynamicScroller.pool.value[0]?.item.item.text
dynamicScroller.getItemSize(messages.value[0])
```

相同的宣告型別也會流通至 `useDynamicScrollerItem<TItem>()`，當你直接使用底層量測輔助方法時。
