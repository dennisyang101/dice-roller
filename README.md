# 骰子投擲器

可在瀏覽器中自由組合並投擲標準 RPG 骰子的 3D 小工具。

## 功能

- 支援 d4、d6、d8、d10、d12、d20
- 可混合不同骰型與數量，例如 `1d20 + 2d6`
- 顯示 3D 滾動與碰撞過程
- 顯示每組結果、小計與總點數
- 一次最多投擲 20 顆骰子
- 響應式介面，可在桌面與手機瀏覽器使用

## 開始使用

需要 Node.js 20.19 以上版本。

```bash
npm install
npm run dev
```

開啟終端顯示的本機網址。

## 驗證

```bash
npm test
npm run build
```

## 技術

- 原生 JavaScript、HTML、CSS
- Vite
- [@3d-dice/dice-box](https://github.com/3d-dice/dice-box) 提供 3D 骰型、物理模擬與亂數
