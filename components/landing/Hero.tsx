import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PreviewCard } from "@/components/landing/PreviewCard";

export function Hero({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* 背景漸層光暈 */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-400/30 via-violet-400/20 to-fuchsia-400/20 blur-3xl dark:from-indigo-500/20 dark:via-violet-500/15 dark:to-fuchsia-500/15" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pb-28 lg:pt-24">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white/60 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            由 AI 驅動的合約風險分析
          </div>

          <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl">
            簽約前，先讓
            <br />
            <span className="brand-gradient-text">AI 幫你看穿風險</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            上傳 PDF、Word 或純文字合約，合約衛士會在幾分鐘內揪出不利條款、缺漏事項，
            並給出具體修改建議——分析結果只儲存在你的帳號裡，只有你自己看得到。
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={ctaHref}
              className="brand-gradient-bg group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-900/5 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-white/10"
            >
              了解運作方式
            </a>
          </div>

          <p className="mt-6 text-xs text-zinc-400">
            免費開始使用．不需要信用卡．支援 PDF / Word / 純文字
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <PreviewCard />
        </div>
      </div>
    </section>
  );
}
