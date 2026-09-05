import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Review } from "@/models/Review";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  try {
    await connectDB();
    // 只回傳目前登入會員自己上傳的合約，確保其他人看不到
    const reviews = await Review.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("[/api/reviews] error:", err);
    return NextResponse.json({ error: "讀取失敗" }, { status: 500 });
  }
}
