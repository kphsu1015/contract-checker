import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("請在 .env.local 設定 OPENAI_API_KEY");
}

export const REVIEW_MODEL = process.env.OPENAI_MODEL || "gpt-5.5";

const openai = new OpenAI({ apiKey });

export type Severity = "low" | "medium" | "high";

export interface RiskItem {
  clause: string;
  issue: string;
  severity: Severity;
  suggestion: string;
}

export interface ContractReview {
  summary: string;
  contractType: string;
  overallRisk: Severity;
  riskItems: RiskItem[];
  missingClauses: string[];
  recommendations: string[];
}

const jsonSchema = {
  name: "contract_review",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      summary: { type: "string", description: "合約的整體摘要（繁體中文）" },
      contractType: { type: "string", description: "合約類型，例如 租賃、勞動、保密、買賣" },
      overallRisk: { type: "string", enum: ["low", "medium", "high"] },
      riskItems: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            clause: { type: "string", description: "相關條款或段落標題" },
            issue: { type: "string", description: "風險或疑慮說明" },
            severity: { type: "string", enum: ["low", "medium", "high"] },
            suggestion: { type: "string", description: "修改建議" },
          },
          required: ["clause", "issue", "severity", "suggestion"],
        },
      },
      missingClauses: {
        type: "array",
        items: { type: "string" },
        description: "建議補充但目前缺少的條款",
      },
      recommendations: {
        type: "array",
        items: { type: "string" },
        description: "給簽約方的整體建議",
      },
    },
    required: [
      "summary",
      "contractType",
      "overallRisk",
      "riskItems",
      "missingClauses",
      "recommendations",
    ],
  },
} as const;

const MAX_CHARS = 60_000;

export async function reviewContract(contractText: string): Promise<ContractReview> {
  const trimmed = contractText.trim();
  if (!trimmed) {
    throw new Error("無法從檔案讀取到文字內容");
  }

  const content =
    trimmed.length > MAX_CHARS
      ? trimmed.slice(0, MAX_CHARS) + "\n\n[內容過長，已截斷]"
      : trimmed;

  const completion = await openai.chat.completions.create({
    model: REVIEW_MODEL,
    // gpt-5.5 系列只接受預設 temperature(=1)，帶其他值會被 API 拒絕，所以這裡不指定
    response_format: { type: "json_schema", json_schema: jsonSchema },
    messages: [
      {
        role: "system",
        content:
          "你是一位資深的合約審查律師。請仔細分析使用者提供的合約全文，找出對簽約方不利的條款、模糊用語、權利義務失衡、以及潛在法律風險。所有輸出內容一律使用繁體中文，並依照指定的 JSON 結構回覆。",
      },
      {
        role: "user",
        content: `請審查以下合約內容：\n\n${content}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    throw new Error("OpenAI 沒有回傳內容");
  }

  return JSON.parse(raw) as ContractReview;
}
