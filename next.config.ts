import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (pdfjs-dist) 使用 Node 專用的 worker 檔案路徑，
  // 交給 Turbopack/webpack 打包會找不到 pdf.worker.mjs，所以排除不打包，改用原生 require。
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
