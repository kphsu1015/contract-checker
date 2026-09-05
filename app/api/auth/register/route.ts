import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "請提供 email 與密碼" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_RE.test(normalizedEmail)) {
      return NextResponse.json({ error: "email 格式不正確" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "密碼至少需要 8 個字元" }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return NextResponse.json({ error: "此 email 已經註冊過了" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email: normalizedEmail, passwordHash });

    await createSession(String(user._id), user.email);

    return NextResponse.json({ user: { id: String(user._id), email: user.email } });
  } catch (err) {
    console.error("[/api/auth/register] error:", err);
    return NextResponse.json({ error: "註冊失敗，請稍後再試" }, { status: 500 });
  }
}
