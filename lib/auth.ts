import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { getSession } from "@/lib/session";

export interface CurrentUser {
  id: string;
  email: string;
}

/** 取得目前登入的使用者（依 session cookie），未登入回傳 null。
 * 用 React cache() 包起來，同一次 render / request 內重複呼叫不會重複查 DB。 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    await connectDB();
    const user = await User.findById(session.userId).select("email").lean();
    if (!user) return null;
    return { id: String(user._id), email: user.email };
  } catch {
    return null;
  }
});
