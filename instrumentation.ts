/**
 * 在 Next.js server 實例啟動、開始處理任何請求「之前」保證會跑一次。
 *
 * 原本只在 lib/extractText.ts 裡於 `import "pdf-parse"` 前面 import
 * lib/pdfPolyfills，指望靠 ES module 依賴圖的求值順序讓 polyfill 先跑。
 * 但在 Vercel 上，Turbopack 對 `serverExternalPackages` 的模組是用它自己
 * 一套 lazy 的 `externalImport` 機制載入（stack trace 裡的
 * `Context.externalImport`），不保證照我們檔案內的 import 順序執行，
 * 導致 pdf-parse 底層的 pdfjs-dist 在拿到 DOMMatrix polyfill 之前
 * 就先被載入，一樣 ReferenceError。
 *
 * 用 instrumentation.ts 的 register() 才是官方保證「server 準備好接請求前
 * 一定跑完」的時機點，在這裡先把 polyfill 設好最保險。
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/pdfPolyfills");
  }
}
