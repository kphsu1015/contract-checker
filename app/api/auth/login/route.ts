import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "請提供 email 與密碼" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectDB();
    const user = await User.findOne({ email: normalizedEmail });

    // 不論帳號存不存在都回同一種錯誤訊息，避免洩漏帳號是否存在
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "email 或密碼錯誤" }, { status: 401 });
    }

    await createSession(String(user._id), user.email);

    return NextResponse.json({ user: { id: String(user._id), email: user.email } });
  } catch (err) {
    console.error("[/api/auth/login] error:", err);
    return NextResponse.json({ error: "登入失敗，請稍後再試" }, { status: 500 });
  }
}
