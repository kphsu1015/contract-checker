/**
 * pdf-parse（底層是 pdfjs-dist）某些模組在載入時就會直接參照瀏覽器才有的
 * DOMMatrix / Path2D / ImageData，在 Node.js（本機 dev 用的 Node 版本、
 * Vercel serverless function 用的 Node 版本可能不同）下就會直接
 * ReferenceError，甚至在真的解析 PDF 之前、模組載入階段就整個炸掉。
 *
 * 我們只用 getText() 抽純文字，不需要真的畫布渲染，所以這裡用最小可行的
 * stub 補上這些全域變數，讓模組載入不會出錯即可。
 *
 * 這個檔案必須在 `import ... from "pdf-parse"` **之前**被 import，
 * 靠的是 ES module 依賴圖的求值順序：同一檔案裡先寫的 import 會先完整
 * 執行完畢，所以它的副作用（設定 globalThis）會先發生。
 */

class DOMMatrixPolyfill {
  a = 1;
  b = 0;
  c = 0;
  d = 1;
  e = 0;
  f = 0;

  constructor(init?: number[]) {
    if (Array.isArray(init) && init.length >= 6) {
      [this.a, this.b, this.c, this.d, this.e, this.f] = init;
    }
  }

  multiply() {
    return new DOMMatrixPolyfill();
  }
  translate() {
    return new DOMMatrixPolyfill();
  }
  scale() {
    return new DOMMatrixPolyfill();
  }
  inverse() {
    return new DOMMatrixPolyfill();
  }
}

class Path2DPolyfill {
  // 不需要真的畫路徑，方法都是 no-op
  moveTo() {}
  lineTo() {}
  closePath() {}
  rect() {}
  addPath() {}
}

class ImageDataPolyfill {
  data: Uint8ClampedArray;
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
}

const g = globalThis as Record<string, unknown>;

if (typeof g.DOMMatrix === "undefined") g.DOMMatrix = DOMMatrixPolyfill;
if (typeof g.Path2D === "undefined") g.Path2D = Path2DPolyfill;
if (typeof g.ImageData === "undefined") g.ImageData = ImageDataPolyfill;

export {}; // 純副作用檔案，這行只是讓 TS 把它當成 module（可被 dynamic import()）
