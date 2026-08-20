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

## Android

Android 版使用 Capacitor 重用相同的網頁介面，支援 Android 7（API 24）以上版本，package ID 為 `app.diceroller.mobile`。

準備好 JDK 21 與 Android SDK 36 後執行：

```bash
npm run android:sync
cd android
./gradlew assembleDebug
```

APK 會產生在 `android/app/build/outputs/apk/debug/app-debug.apk`。

## 技術

- 原生 JavaScript、HTML、CSS
- Vite
- Capacitor（Android）
- [@3d-dice/dice-box](https://github.com/3d-dice/dice-box) 提供 3D 骰型、物理模擬與亂數
