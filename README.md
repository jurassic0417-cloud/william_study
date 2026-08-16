# 楊博勛的學習歷程網站

> 📌 **下次接著做**：目前線上後台改的東西別人還看不到（還沒接 Firebase）。
> 待辦步驟整理在 [NEXT_STEPS.md](./NEXT_STEPS.md)。

一個可以直接發布的個人學習歷程網站。

- 公開網站：`/`（訪客看到的乾淨版本，完全沒有任何管理功能）
- 管理後台：`/admin`（用 Google 帳號登入後才能修改內容）

技術很單純：**React + Vite + Firebase（Authentication + Firestore）**。
沒有 Express、沒有自訂伺服器、沒有 Redux，也沒有 Firebase Storage（不用付費方案）。

---

## 一、先在電腦上跑起來

```bash
npm install     # 安裝套件（只要做一次）
npm run dev     # 開發模式，網址 http://localhost:3000
npm run build   # 正式版打包，輸出到 dist/
npm run preview # 用正式版檔案跑一次，確認沒問題
```

還沒設定 Firebase 也沒關係：網站會自動進入「本機示範模式」，
畫面完整、後台也能操作，只是資料暫時存在你自己的瀏覽器裡。

---

## 二、設定 Firebase（讓資料永久保存）

Firebase 的 Spark 免費方案就夠用，**不需要信用卡、不需要開啟 Blaze**。

### 1. 建立專案

1. 打開 <https://console.firebase.google.com/>
2. 「新增專案」→ 取一個名字（例如 `my-portfolio`）→ 建立
   （Google Analytics 可以直接關掉）

### 2. 開啟 Google 登入

Firebase Console → **Authentication** → 開始使用 → **Sign-in method**
→ 選 **Google** → 啟用 → 儲存。

### 3. 建立 Firestore

Firebase Console → **Firestore Database** → 建立資料庫
→ 位置選 `asia-east1`（台灣附近）→ 先選「以正式版模式啟動」。
規則等一下會貼上。

### 4. 取得網站設定

Firebase Console → 專案設定（左上齒輪）→ 下方「你的應用程式」
→ 選 **網頁 `</>`** → 註冊應用程式 → 會看到一段 `firebaseConfig`。

把這些值填到專案根目錄的 `.env.local`（可以複製 `.env.example` 改名）：

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> 或者直接把值貼進 `src/firebase.ts` 最上面的 `manualConfig`，兩種都可以。
> 這些值出現在網頁原始碼是正常的，真正的保護是下一步的安全規則。

### 5. 貼上安全規則（這步很重要）

Firebase Console → Firestore Database → **規則**，
把專案裡 `firestore.rules` 的內容整份貼上去 → 發布。

規則的意思是：

- 任何人都可以「讀」網站內容（因為這是公開網站）
- 只有 `jurassic0417@gmail.com` 這個 Google 帳號可以「寫」

換帳號時，要同時改兩個地方：

1. `src/config.ts` 的 `ADMIN_EMAIL`
2. `firestore.rules` 裡面的 email

### 6. 加入授權網域

發布之後，Firebase Console → Authentication → Settings → 授權網域，
把你的網站網域（例如 `xxx.ai.studio`）加進去，Google 登入才不會被擋。

---

## 三、GitHub Pages（已經幫你設定好）

網站已經上線：

- 公開網站：<https://jurassic0417-cloud.github.io/william_study/>
- 管理後台：<https://jurassic0417-cloud.github.io/william_study/admin>

以後只要把改動 push 上去，網站就會自動重新部署：

```bash
git add -A
git commit -m "說明你改了什麼"
git push
```

推上去之後大約等 1～2 分鐘，重新整理網頁就會看到新版本。

### 讓線上版連到 Firebase

GitHub Actions 打包時看不到你電腦裡的 `.env.local`，所以要把 Firebase 設定存成 GitHub Secrets：

GitHub repo → Settings → Secrets and variables → Actions → New repository secret，
把這六個分別加進去（名字要一模一樣）：

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

加完之後再 push 一次（或到 Actions 頁面按 Re-run），線上版就會連到 Firestore。

別忘了到 Firebase Console → Authentication → Settings → 授權網域，
把 `jurassic0417-cloud.github.io` 加進去，Google 登入才不會被擋。

> 小提醒：GitHub Pages 沒有 SPA 轉址功能，所以直接開 `/admin` 時會先經過 `public/404.html`，
> 再自動跳到 `/#/admin`。網址列會多一個 `#`，功能完全一樣。

---

## 四、在 Google AI Studio 發布

1. 把整個專案匯入 Google AI Studio（或直接在 AI Studio 裡建立）
2. 如果 AI Studio 問你要不要「Enable Firebase」，可以按下去，
   它會自動幫你設定環境變數，就不用手動填 `.env.local`
3. 按 **Publish**

發布後兩個網址都能用：

- `https://你的網站.ai.studio/`
- `https://你的網站.ai.studio/admin`

> 萬一某個平台沒有幫 `/admin` 做 SPA 轉址，
> 用 `https://你的網站/#/admin` 一樣可以進後台（程式已經內建這個備援）。

---

## 五、資料存在哪裡

Firestore 的結構刻意做得很簡單：

| 位置 | 內容 |
| --- | --- |
| `siteProfile/main` | 姓名、學校、年級、自我介紹等基本資料 |
| `settings/site` | 網站主色 |
| `projects/{id}` | 每一個作品的文字資料 |
| `projectImages/{id}` | 圖片，一張圖一份文件（避免文件太大） |
| `timeline/{id}` | 學習歷程時間軸 |
| `skills/{id}` | 技能標籤 |

圖片會在瀏覽器裡先縮小成寬度 1200px、轉成 WebP、壓到 400KB 以內才存進去，
所以不需要 Firebase Storage。每個作品最多 3 張照片，個人照片 1 張。

影片不會上傳，改成貼 Google Drive 的分享連結，程式會自動轉成可播放的畫面。

---

## 六、常用檔案在哪裡

| 想改什麼 | 打開哪個檔案 |
| --- | --- |
| 管理員 Email、圖片大小限制 | `src/config.ts` |
| 網站顏色、字體、間距 | `src/styles.css` |
| 第一次顯示的示範內容 | `src/data/sampleData.ts` |
| 首頁各區塊 | `src/site/` |
| 後台各頁 | `src/admin/` |
| 資料庫讀寫 | `src/lib/store.ts` |

---

## 七、常見問題

**Q：後台顯示「此帳號沒有網站管理權限。」**
用的不是 `src/config.ts` 裡設定的那個 Google 帳號，登出換帳號再登入。

**Q：登入時出現 unauthorized-domain**
到 Firebase Console → Authentication → Settings → 授權網域，把網址加進去。

**Q：上傳圖片說「圖片檔案太大」**
先用手機或電腦把照片縮小一點再上傳（例如寬度 2000px 以內）。

**Q：影片顯示「無法辨識 Google Drive 影片網址」**
Drive 連結要長得像 `https://drive.google.com/file/d/檔案ID/view`，
而且檔案要設定成「知道連結的人都可以查看」。
