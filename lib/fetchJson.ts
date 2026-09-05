/**
 * 安全解析 fetch 回應的 JSON body。
 *
 * 直接呼叫 `res.json()` 在回應是空字串或不是合法 JSON 時（例如伺服器逾時、
 * 反向代理砍斷連線、平台回傳的錯誤頁面）會丟出很難懂的
 * "Unexpected end of JSON input" 之類錯誤，這裡先讀成文字再自行 parse，
 * 這樣才能包成使用者看得懂的訊息。
 */
export async function parseJsonSafely<T = unknown>(res: Response): Promise<T> {
  const text = await res.text();

  if (!text) {
    throw new Error(
      res.ok
        ? "伺服器沒有回傳任何內容，請稍後再試"
        : `伺服器發生錯誤（${res.status}），請稍後再試`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`伺服器回應格式異常（${res.status}），請稍後再試`);
  }
}
