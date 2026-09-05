import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (pdfjs-dist) 使用 Node 專用的 worker 檔案路徑，
  // 交給 Turbopack/webpack 打包會找不到 pdf.worker.mjs，所以排除不打包，改用原生 require。
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],

  // 上面排除打包之後，Vercel 改用 Output File Tracing 決定要把 node_modules
  // 裡哪些檔案一起丟進部署的 function。pdfjs-dist 的 worker 檔（pdf.worker.mjs）
  // 是用執行期字串路徑動態載入，追蹤器偵測不到，導致部署後找不到這個檔案
  // （fake worker 也需要載入它的內容才能在主執行緒模擬 worker）。
  // 這裡強制把 legacy build 整包一起帶進 /api/review 這條路由的部署產物。
  outputFileTracingIncludes: {
    "/api/review": ["./node_modules/pdfjs-dist/legacy/build/**/*"],
  },
};

export default nextConfig;
