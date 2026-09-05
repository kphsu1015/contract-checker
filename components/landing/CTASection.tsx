import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection({ ctaHref, ctaLabel }: { ctaHref: string; ctaLabel: string }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="brand-gradient-bg relative overflow-hidden rounded-3xl px-8 py-14 text-center shadow-xl shadow-indigo-600/20 sm:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
        <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
          下一份合約，讓 AI 先幫你把關
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-sm text-indigo-50/90 sm:text-base">
          註冊只需要 email，馬上就能上傳第一份合約，取得完整的風險分析報告。
        </p>
        <div className="relative mt-8">
          <Link
            href={ctaHref}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            {ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
