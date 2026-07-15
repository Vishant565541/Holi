/**
 * Server-side liteAPI client. Used only inside API routes — the API key
 * never reaches the browser.
 *
 * Set LITEAPI_KEY in .env.local (sandbox key) / Vercel env vars (prod key).
 */

const BASE = "https://api.liteapi.travel/v3.0";

export interface LiteApiOptions {
  method?: string;
  body?: any;
}

export async function liteapi(path: string, { method = "GET", body }: LiteApiOptions = {}): Promise<any> {
  const key = process.env.LITEAPI_KEY;
  if (!key) throw new Error("LITEAPI_KEY env var is not set");

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "X-API-Key": key,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    // rates change constantly — never cache on the server
    cache: "no-store",
  });

  const text = await res.text();
  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`liteAPI ${path} -> HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const msg = json?.error?.description || json?.error?.message || JSON.stringify(json).slice(0, 200);
    throw new Error(`liteAPI ${path} -> HTTP ${res.status}: ${msg}`);
  }
  return json;
}

/** Basic input guards shared by routes */
export function isIsoDate(s: any): boolean {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);
}
