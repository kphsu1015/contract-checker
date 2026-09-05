import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { CurrentUser } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export function Header({ user }: { user: CurrentUser | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/70 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <span className="brand-gradient-bg flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span>合約衛士</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden text-sm font-medium text-zinc-600 hover:text-zinc-900 sm:inline dark:text-zinc-400 dark:hover:text-white"
            >
              我的審查
            </Link>
            <span className="hidden text-sm text-zinc-500 md:inline">{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-900/5 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              登入
            </Link>
            <Link
              href="/register"
              className="brand-gradient-bg rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              免費開始
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
