import { Upload, BrainCircuit, ClipboardCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "上傳合約",
    description: "拖曳或選擇 PDF、Word、純文字檔案，10MB 以內即可上傳。",
  },
  {
    icon: BrainCircuit,
    step: "02",
    title: "AI 逐條分析",
    description: "AI 讀取合約全文，比對常見風險模式，找出對你不利或缺漏的條款。",
  },
  {
    icon: ClipboardCheck,
    step: "03",
    title: "取得風險報告",
    description: "幾分鐘內取得結構化報告：摘要、風險條款、缺漏事項與修改建議。",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/30">
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">三個步驟，完成合約審查</h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            不需要法律背景，也能快速掌握合約中的關鍵風險。
          </p>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="relative">
              <div className="flex items-center gap-3">
                <span className="brand-gradient-text text-3xl font-bold">{step}</span>
                <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="mt-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" strokeWidth={2} />
              </div>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
