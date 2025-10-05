// src/lib/api.ts
// EchoScript.AI — minimal API client with sane defaults.

const BASE =
  (import.meta.env.VITE_API_BASE as string | undefined)?.trim() || "/api";

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

function url(path: string) {
  if (!path.startsWith("/")) path = `/${path}`;
  // Avoid double slashes when BASE already ends with /
  return `${BASE.replace(/\/$/, "")}${path}`;
}

async function handle(res: Response) {
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json().catch(() => ({})) : await res.text();
  if (!res.ok) {
    const message = (data && (data.message || data.error || data.detail)) || res.statusText;
    throw Object.assign(new Error(message), { status: res.status, data });
  }
  return data;
}

export async function apiGet<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const res = await fetch(url(path), {
    method: "GET",
    credentials: "include",
    ...opts,
    headers: {
      Accept: "application/json",
      ...(opts.headers || {}),
    },
  });
  return handle(res);
}

export async function apiPost<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const res = await fetch(url(path), {
    method: "POST",
    credentials: "include",
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(opts.headers || {}),
    },
    body: opts.json !== undefined ? JSON.stringify(opts.json) : (opts as any).body,
  });
  return handle(res);
}

export async function apiDelete<T = any>(path: string, opts: FetchOpts = {}): Promise<T> {
  const res = await fetch(url(path), {
    method: "DELETE",
    credentials: "include",
    ...opts,
    headers: {
      Accept: "application/json",
      ...(opts.headers || {}),
    },
  });
  return handle(res);
}

