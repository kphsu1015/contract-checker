import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          <ShieldCheck className="h-4 w-4 text-zinc-400" />
          合約衛士
        </Link>
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} 合約衛士．AI 分析結果僅供參考，不構成正式法律意見
        </p>
      </div>
    </footer>
  );
}
