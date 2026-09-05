import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { extractText } from "@/lib/extractText";
import { reviewContract, REVIEW_MODEL } from "@/lib/reviewContract";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 });
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "請以 multipart/form-data 上傳檔案" },
        { status: 400 }
      );
    }
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "請選擇要上傳的合約檔案" }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "檔案是空的" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "檔案大小不可超過 10MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. 抽取合約文字
    const { text } = await extractText(buffer, file.name, file.type);

    // 2. 上傳原始檔案到 Vercel Blob
    const blob = await put(`contracts/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: true,
    });

    // 3. 呼叫 OpenAI 進行合約審查
    const result = await reviewContract(text);

    // 4. 將結果與 Blob 連結存到 MongoDB
    await connectDB();
    const doc = await Review.create({
      userId: user.id,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      blobUrl: blob.url,
      model: REVIEW_MODEL,
      ...result,
    });

    return NextResponse.json({
      id: doc._id,
      blobUrl: blob.url,
      review: result,
    });
  } catch (err) {
    console.error("[/api/review] error:", err);
    const message = err instanceof Error ? err.message : "審查失敗，請稍後再試";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
