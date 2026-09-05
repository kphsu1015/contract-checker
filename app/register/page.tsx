"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { parseJsonSafely } from "@/lib/fetchJson";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致");
      return;
    }
    if (password.length < 8) {
      setError("密碼至少需要 8 個字元");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await parseJsonSafely<{ error?: string }>(res);

      if (!res.ok) {
        throw new Error(json.error || "註冊失敗");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-400/20 via-violet-400/15 to-fuchsia-400/15 blur-3xl" />
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
        <span className="brand-gradient-bg inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm">
          <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">建立帳號</h1>
        <p className="mt-1 text-sm text-zinc-500">開始使用 AI 審查你的第一份合約</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">密碼</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1 text-xs text-zinc-500">至少 8 個字元</p>
          </div>

          <div>
            <label className="block text-sm font-medium">確認密碼</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="brand-gradient-bg w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "註冊中…" : "註冊"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-zinc-500">
        已經有帳號了？{" "}
        <Link href="/login" className="font-medium text-violet-600 hover:underline dark:text-violet-400">
          登入
        </Link>
      </p>
    </main>
  );
}
