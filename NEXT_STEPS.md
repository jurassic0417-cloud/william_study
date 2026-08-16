# 進度紀錄與下次要做的事

最後更新：2026-08-16

---

## ⚠️ 最重要的一件事（下次一定要完成）

**現在線上後台改的東西，別人看不到。**

原因：網站還沒接上 Firebase，所以你在 `/admin` 改的內容只存在你自己的瀏覽器裡
（畫面上會看到「本機示範模式（尚未連接 Firebase）」的提示）。

要讓別人看得到你的更新，必須完成下面「下次要做的事」。

---

## 目前的狀態

| 項目 | 狀態 |
| --- | --- |
| 網站程式 | ✅ 完成，`npm run build` 沒有錯誤 |
| 公開首頁 `/` | ✅ 正常 |
| 管理後台 `/admin` | ✅ 正常（目前是本機示範模式） |
| GitHub 上傳 | ✅ 完成 |
| GitHub Pages 上線 | ✅ 完成，push 後會自動更新 |
| Firebase（雲端資料庫） | ❌ **還沒設定** ← 下次要做這個 |

### 網址

- 公開網站：<https://jurassic0417-cloud.github.io/william_study/>
- 管理後台：<https://jurassic0417-cloud.github.io/william_study/admin>
- 程式碼：<https://github.com/jurassic0417-cloud/william_study>

### 用到的帳號

- GitHub：`jurassic0417-cloud`
- Firebase／網站管理員：`jurassic0417@gmail.com`
  （這個 email 寫在 `src/config.ts` 和 `firestore.rules`，只有它能修改網站內容）

### 電腦上已經裝好的工具

Node.js、Git、GitHub CLI、Firebase CLI 都已經安裝完成。
Firebase CLI 也已經登入 `jurassic0417@gmail.com`，不需要重新登入。

---

## 下次要做的事

### 第一部分：只有你本人能做（在網頁上點，約 10 分鐘）

上次卡在這裡：Google 回覆 `Callers must accept Terms of Service`，
意思是這個 Google 帳號還沒同意過 Google Cloud 的服務條款，
這個「同意」一定要本人在網頁上點，程式沒辦法代勞。

**第 1 步 — 建立 Firebase 專案**

1. 打開 <https://console.firebase.google.com/>（用 `jurassic0417@gmail.com` 登入）
2. 點「建立專案」，名稱輸入 `william-study-2026`
3. 出現同意條款的勾選框時，**全部勾選同意**（這就是上次卡住的地方）
4. Google Analytics 選「不啟用」
5. 等它跑完，按「繼續」

**第 2 步 — 開啟 Google 登入**

1. 左邊選單 → **Authentication** → 「開始使用」
2. **Sign-in method** 分頁 → 點 **Google**
3. 開關打開 → 公開名稱隨便填 → 支援電子郵件選自己的 gmail → **儲存**

**第 3 步 — 允許網站網域**

1. Authentication → **Settings** 分頁 → **授權網域**
2. 「新增網域」→ 輸入 `jurassic0417-cloud.github.io` → 儲存

做完後，把**專案 ID**（在 Firebase 專案設定裡，例如 `william-study-2026`）記下來。

### 第二部分：可以請 AI 幫你做完

把上面三步做完後，開新對話跟 AI 說：

> Firebase 專案建好了，ID 是 `你的專案ID`，幫我接上網站，
> 讓線上後台改的東西別人也看得到。

AI 會接手處理：

1. 建立 Firestore 資料庫
2. 把 `firestore.rules` 上傳到 Firebase（這是真正的安全防線）
3. 建立網頁應用程式，取得 Firebase 設定
4. 寫入本機的 `.env.local`
5. 把六個 `VITE_FIREBASE_*` 設定成 GitHub Secrets
   （因為 GitHub 的伺服器讀不到你電腦裡的 `.env.local`）
6. 重新部署並實際測試：登入、修改、重新整理後資料還在

---

## 完成後怎麼確認成功

打開 <https://jurassic0417-cloud.github.io/william_study/admin>：

- 上方**不再**顯示「本機示範模式」
- 可以用 Google 登入
- 改一段文字 → 儲存 → 用手機或請同學打開首頁 → 看得到你的修改

---

## 平常怎麼改網站

### 改內容（文字、照片、作品）

直接去 <https://jurassic0417-cloud.github.io/william_study/admin>，
登入後修改、儲存即可，不用碰程式碼。

### 改程式（外觀、版面）

```bash
npm run dev      # 本機預覽 http://localhost:3000
npm run build    # 確認打包沒問題
```

改完之後上傳，網站會在 1～2 分鐘後自動更新：

```bash
git add -A
git commit -m "說明你改了什麼"
git push
```

> 注意：如果 `git push` 跳出登入視窗卻失敗，改用這行：
> `git -c credential.helper="!gh auth git-credential" push`

### 常用檔案

| 想改什麼 | 打開哪個檔案 |
| --- | --- |
| 管理員 Email、圖片大小限制 | `src/config.ts` |
| 網站顏色、字體、間距 | `src/styles.css` |
| 第一次顯示的示範內容 | `src/data/sampleData.ts` |
| 首頁各區塊 | `src/site/` |
| 後台各頁 | `src/admin/` |
| 資料庫讀寫 | `src/lib/store.ts` |

更完整的說明在 `README.md`。
