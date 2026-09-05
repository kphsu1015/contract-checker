import { FileSearch, FileStack, Lock, History } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "智慧風險偵測",
    description:
      "由 AI 逐條檢視合約內容，找出對你不利的條款、模糊用語與潛在法律風險，並標示嚴重程度。",
  },
  {
    icon: FileStack,
    title: "多格式支援",
    description: "支援 PDF、Word（.docx）與純文字檔案，不需自行轉檔，上傳後直接分析。",
  },
  {
    icon: Lock,
    title: "隱私優先",
    description: "每一份合約與分析結果都綁定你的帳號，密碼經加密儲存，只有你自己看得到。",
  },
  {
    icon: History,
    title: "歷史紀錄雲端保存",
    description: "所有審查過的合約都會保留紀錄，隨時回頭查閱之前的風險分析與原始檔案。",
  },
];

export function Features() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          不只是掃描，是真正看懂合約
        </h2>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
          合約衛士專注在四件事：找出風險、支援常用格式、保護你的隱私，以及讓紀錄可以隨時回顧。
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="group relative rounded-2xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg hover:shadow-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:shadow-black/20"
          >
            <div className="brand-gradient-bg inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <h3 className="mt-4 text-base font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
