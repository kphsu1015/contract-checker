const rows = [
  {
    clause: "終止條款",
    issue: "甲方得隨時終止合約，且不須支付資遣費用",
    severity: "high" as const,
  },
  {
    clause: "工時規定",
    issue: "每日工時上限未明確約定，存在超時工作風險",
    severity: "medium" as const,
  },
  {
    clause: "保密義務",
    issue: "保密範圍與期間定義清楚，權利義務對等",
    severity: "low" as const,
  },
];

const severityStyle = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  high: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

const severityLabel = { low: "低風險", medium: "中風險", high: "高風險" };

export function PreviewCard() {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40">
      {/* 假瀏覽器頂列 */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate text-xs text-zinc-400">員工聘僱合約.pdf</span>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">合約類型</p>
            <p className="text-sm font-semibold">勞動合約</p>
          </div>
          <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-400">
            整體風險：高
          </span>
        </div>

        <ul className="space-y-2.5">
          {rows.map((row) => (
            <li
              key={row.clause}
              className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-950/50"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {row.clause}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${severityStyle[row.severity]}`}
                >
                  {severityLabel[row.severity]}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{row.issue}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
