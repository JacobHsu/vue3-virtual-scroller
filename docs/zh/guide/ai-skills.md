# AI 與 Skills

如果你使用 AI 程式碼助理，`vue-virtual-scroller` 隨套件附帶了一個可供發現工具取用的 skill。

## 單次使用：`npx skills-npm`

在你的專案中安裝 `vue-virtual-scroller` 後：

```bash
pnpm add vue-virtual-scroller
npx skills-npm
```

這是將內建 skill 提供給支援的助理最快的方式。

## 持久設定

若希望 skill 連結在安裝後持續保持最新，可將 `skills-npm` 加入你的專案：

```bash
npm i -D skills-npm
```

在 `package.json` 中加入 `prepare` 腳本：

```json
{
  "scripts": {
    "prepare": "skills-npm"
  }
}
```

## 常用選項

- `--source <source>`：在 `package.json` 和 `node_modules` 之間選擇
- `--cwd <cwd>`：將指令指向特定的工作區根目錄
- `--recursive`：掃描 monorepo
- `--dry-run`：預覽產生的連結
- `--yes`：跳過確認提示

如需更多控制，可在你的 consumer 專案中建立 `skills-npm.config.ts`。

更多關於 `skills-npm` 的資訊，請參閱[其文件](https://github.com/antfu/skills-npm#skills-npm)。

## 注意事項

- 請從 consumer 專案根目錄執行 `skills-npm`，而非本套件倉庫。
- 產生的連結通常是本地設定產物。若不想提交至版本控制，可將 `skills/npm-*` 加入 `.gitignore`。
- 發布的 `vue-virtual-scroller` 套件包含其 `skills/` 目錄，讓發現工具可以找到內建 skill。
