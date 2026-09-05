import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export interface ExtractResult {
  text: string;
  kind: "pdf" | "docx" | "txt";
}

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** 從上傳的合約檔案抽取純文字，支援 PDF / Word(.docx) / 純文字 */
export async function extractText(
  buffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<ExtractResult> {
  const lower = fileName.toLowerCase();

  if (mimeType === "application/pdf" || lower.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return { text: result.text ?? "", kind: "pdf" };
    } finally {
      await parser.destroy();
    }
  }

  if (mimeType === DOCX_MIME || lower.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return { text: value ?? "", kind: "docx" };
  }

  if (mimeType.startsWith("text/") || lower.endsWith(".txt")) {
    return { text: buffer.toString("utf-8"), kind: "txt" };
  }

  if (lower.endsWith(".doc")) {
    throw new Error("舊版 .doc 不支援，請另存為 .docx 或 PDF 後再上傳");
  }

  throw new Error("不支援的檔案格式，請上傳 PDF、Word(.docx) 或純文字檔");
}
