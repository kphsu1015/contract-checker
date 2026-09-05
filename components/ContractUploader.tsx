"use client";

import { useCallback, useEffect, useState } from "react";
import { parseJsonSafely } from "@/lib/fetchJson";

type Severity = "low" | "medium" | "high";

interface RiskItem {
  clause: string;
  issue: string;
  severity: Severity;
  suggestion: string;
}

interface ContractReview {
  summary: string;
  contractType: string;
  overallRisk: Severity;
  riskItems: RiskItem[];
  missingClauses: string[];
  recommendations: string[];
}

interface ReviewResponse {
  id: string;
  blobUrl: string;
  review: ContractReview;
}

interface HistoryItem extends ContractReview {
  _id: string;
  fileName: string;
  blobUrl: string;
  createdAt: string;
}

const severityLabel: Record<Severity, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const severityStyle: Record<Severity, string> = {
  low: "bg-emerald-100 text-emerald-800 border-emerald-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  high: "bg-rose-100 text-rose-800 border-rose-200",
};

export function ContractUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ReviewResponse | null>(null);

  const [history, setHistory] = useState<HistoryItem[] | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews");
      const json = await parseJsonSafely<{ reviews: HistoryItem[] }>(res);
      if (res.ok) setHistory(json.reviews);
    } catch {
      // 歷史紀錄載入失敗不影響主要功能，靜默忽略
    }
  }, []);

  useEffect(() => {
    // 掛載時載入一次個人歷史紀錄；loadHistory 內部才是實際 setState 的地方
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 掛載時抓資料的標準寫法
    loadHistory();
  }, [loadHistory]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/review", { method: "POST", body });
      const json = await parseJsonSafely<ReviewResponse & { error?: string }>(res);

      if (!res.ok) {
        throw new Error(json.error || "審查失敗");
      }
      setData(json);
      setFile(null);
      loadHistory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  }

  const review = data?.review;

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">我的合約審查</h1>
      <p className="mt-2 text-sm text-zinc-500">
        上傳合約檔案（PDF / Word / 純文字），AI 會分析潛在風險並給出修改建議。你上傳的紀錄只有你自己看得到。
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="block text-sm font-medium">合約檔案</label>
        <input
          key={file ? "has-file" : "empty"}
          type="file"
          accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-sm text-zinc-600 file:mr-4 file:rounded-full file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700 dark:text-zinc-300"
        />

        <button
          type="submit"
          disabled={!file || loading}
          className="brand-gradient-bg mt-4 inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? "審查中…" : "開始審查"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          {error}
        </div>
      )}

      {review && (
        <section className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-zinc-500">合約類型：</span>
            <span className="font-medium">{review.contractType || "未分類"}</span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${severityStyle[review.overallRisk]}`}
            >
              整體風險：{severityLabel[review.overallRisk]}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-semibold">摘要</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              {review.summary}
            </p>
          </div>

          {review.riskItems.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold">風險條款（{review.riskItems.length}）</h2>
              <ul className="mt-3 space-y-3">
                {review.riskItems.map((item, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{item.clause || `風險 ${i + 1}`}</p>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${severityStyle[item.severity]}`}
                      >
                        {severityLabel[item.severity]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {item.issue}
                    </p>
                    {item.suggestion && (
                      <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        建議：{item.suggestion}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {review.missingClauses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold">建議補充的條款</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                {review.missingClauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {review.recommendations.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold">整體建議</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                {review.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {data?.blobUrl && (
            <a
              href={data.blobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-violet-600 underline dark:text-violet-400"
            >
              下載原始合約檔案
            </a>
          )}
        </section>
      )}

      {history && history.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold">我的審查紀錄</h2>
          <ul className="mt-3 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {history.map((item) => (
              <li key={item._id} className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.fileName}</p>
                  <p className="text-xs text-zinc-500">
                    {new Date(item.createdAt).toLocaleString("zh-TW")}
                    {item.contractType ? ` · ${item.contractType}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs font-medium ${severityStyle[item.overallRisk]}`}
                  >
                    {severityLabel[item.overallRisk]}
                  </span>
                  <a
                    href={item.blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    檔案
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
