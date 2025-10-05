// src/lib/api.ts
// EchoScript.AI – API client (works with Vite + Netlify proxy or api subdomain)

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [k: string]: JSONValue };

type FetchOpts = Omit<RequestInit, "headers" | "body" | "method"> & {
  json?: JSONValue;
  headers?: Record<string, string>;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
};

const BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.trim() || "/api";

function buildUrl(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${BASE.replace(/\/$/, "")}${path}`;
}

async function parse(res: Response) {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return {};
    }
  }
  return await res.text();
}

async function request<T = any>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  opts: FetchOpts = {}
): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method,
    credentials: "include",
    ...opts,
    headers: {
      Accept: "application/json",
      ...(opts.json !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(opts.headers || {}),
    },
    body: opts.json !== undefined ? JSON.stringify(opts.json) : (opts as any).body,
  });

  const data = await parse(res);
  if (!res.ok) {
    const message =
      (data && (data.message || data.error || data.detail)) || res.statusText;
    throw Object.assign(new Error(String(message)), { status: res.status, data });
  }
  return data as T;
}

/** Generic helpers */
export const apiGet = <T = any>(path: string, opts?: FetchOpts) =>
  request<T>("GET", path, opts);
export const apiPost = <T = any>(path: string, opts?: FetchOpts) =>
  request<T>("POST", path, opts);
export const apiDelete = <T = any>(path: string, opts?: FetchOpts) =>
  request<T>("DELETE", path, opts);

/** Health */
export const health = () => apiGet<{ ok: boolean }>("/healthz");

/** Auth — adjust paths if your backend differs */
type Creds = { email: string; password: string; remember?: boolean };

export const signup = (payload: Creds) =>
  apiPost("/auth/signup", { json: payload });

export const login = (payload: Creds) =>
  apiPost("/auth/login", { json: payload });

export const logout = () =>
  // if your backend uses GET /auth/logout, change this accordingly
  apiPost("/auth/logout", { json: {} });

/** Stripe (example) */
export const createCheckoutSession = (plan: string) =>
  apiPost<{ url: string }>("/stripe/create-checkout-session", {
    json: { plan },
  });

/** Default object (what AuthContext imports) */
const api = {
  get: apiGet,
  post: apiPost,
  delete: apiDelete,
  health,
  signup,
  login,
  logout,
  createCheckoutSession,
};

export default api;
