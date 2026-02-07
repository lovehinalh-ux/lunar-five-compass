# Lunar Five Compass（React + TypeScript + Tailwind + shadcn）

## 專案簡介
以 React + TypeScript 建立的後天五行工具。  
改為「一頁式輸入 + 折頁結果」流程，使用者輸入國曆生日與性別後，可得到：
- 農曆生日（含閏月資訊）
- 農曆足歲與虛歲
- 依民國出生年與性別推算之後天卦數、五行、人格類型與健康提醒
- 五行相生相剋與圖文說明

## 主要功能
1. 國曆轉農曆：使用 `Intl` Chinese Calendar，支援閏月顯示。
2. 農曆年齡推算：輸出足歲與虛歲，並處理閏月/缺日備援。
3. 命卦計算：依你提供的男女對照表，命卦 5 轉男 2 / 女 8。
4. 說明系統：內建五行關聯、卦數文字版、健康提醒與規則區。
5. 安全基線：ESLint security 規則、`npm audit`、CI build/lint。
6. UI 元件化：採用 Tailwind + shadcn 風格元件（Button/Card/Input/Select）。
7. 生日輸入：改為年/月/日分欄，年份支援西元與民國切換。
8. 主折頁：產生結果後以單開 Accordion 顯示「結果頁」與「說明頁」。

## 一頁式流程
- 首屏：輸入卡（年格式、年、月、日、性別）
- CTA：`產生結果`
- 成功後：同頁折頁顯示
  - `結果頁`：計算結果
  - `說明頁`：五行說明、逐字版、規則
- URL：保留 query 參數（可重整與分享結果）

## 安裝與啟動
```bash
npm install
npm run dev
```

## 開發指令
```bash
npm run dev      # 啟動開發伺服器
npm run build    # 打包
npm run lint     # ESLint + security 規則檢查
npm run preview  # 預覽打包結果
```

## 技術堆疊
- React 19
- TypeScript 5
- Vite 6
- Tailwind CSS v4
- shadcn-style components（自建於 `src/components/ui`）
- React Router

## 部署方式
### 1. GitHub Actions（已配置）
`main` 分支 push 時自動執行：
- `npm ci`
- `npm run lint`
- `npm run build`

Workflow 檔案：
- `.github/workflows/deploy.yml`

### 2. 可選 Vercel 自動部署
若在 GitHub Repo 設定：
- `VERCEL_ORG_ID`（Repository Variable）
- `VERCEL_PROJECT_ID`（Repository Variable）
- `VERCEL_TOKEN`（Repository Secret）

workflow 會在 `main` push 後自動部署到 Vercel。

### 3. 可選 GitHub Pages 部署
設定 Repository Variable：
- `DEPLOY_TARGET=github-pages`

workflow 會把 `dist` 發布到 GitHub Pages。

## 環境變數範本
請參考 `.env.example`。  
注意：`VITE_*` 會被打進前端 bundle，不可放私密金鑰。

## 線上預覽（2026-02-07）
- Preview URL: https://skill-deploy-u6bs0f5vvl-codex-agent-deploys.vercel.app
- Claim URL: https://vercel.com/claim-deployment?code=1dbb1672-8945-4a89-adac-1b3638f4cacb
