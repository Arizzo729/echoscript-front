// src/lib/api.ts
// Centralized API client with BOTH default and named exports.
// Works with:  import api from "../lib/api";
//          and: import { api } from "../lib/api";

export type ApiResponse<T = any> = {
  ok: boolean;
  status: number;
  body: T;
  res: Response;
};

const API_BASE = String(
  (import.meta.env.VITE_API_BASE ?? import.meta.env.VITE_API_URL ?? "")
);

async function core(path: string, init: RequestInit = {}): Promise<ApiResponse> {
  if (!API_BASE) {
    throw new Error("VITE_API_BASE or VITE_API_URL is not set");
  }
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
  });
  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);
  return { ok: res.ok, status: res.status, body, res };
}

type ApiFn = {
  (path: string, init?: RequestInit): Promise<ApiResponse>;
  get(path: string, init?: RequestInit): Promise<ApiResponse>;
  post(path: string, body?: any, init?: RequestInit): Promise<ApiResponse>;
  put(path: string, body?: any, init?: RequestInit): Promise<ApiResponse>;
  patch(path: string, body?: any, init?: RequestInit): Promise<ApiResponse>;
  delete(path: string, init?: RequestInit): Promise<ApiResponse>;
  base: string;
};

const api = (async function api(path: string, init: RequestInit = {}) {
  return core(path, init);
}) as ApiFn;

api.get = (path, init) => core(path, { method: "GET", ...(init || {}) });

function jsonInit(method: string, body?: any, init?: RequestInit): RequestInit {
  return {
    method,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...(init || {}),
  };
}

api.post = (path, body, init) => core(path, jsonInit("POST", body, init));
api.put = (path, body, init) => core(path, jsonInit("PUT", body, init));
api.patch = (path, body, init) => core(path, jsonInit("PATCH", body, init));
api.delete = (path, init) => core(path, { method: "DELETE", ...(init || {}) });
api.base = API_BASE;

export { api, API_BASE };
export default api;

