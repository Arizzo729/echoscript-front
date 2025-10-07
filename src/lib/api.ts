// src/lib/api.ts

// Prefer relative '/api' so Netlify proxy forwards to your backend.
// Falls back to any provided envs if you override.
export const API_BASE = (
  import.meta.env.VITE_API_BASE ??
  import.meta.env.VITE_API_URL ??
  '/api'
).replace(/\/$/, '');

type FetchOptions = RequestInit & { json?: unknown };

// Core request helper
async function request<T>(path: string, opts: FetchOptions = {}): Promise<T> {
  const headers: Record<string, string> = { ...(opts.headers as any) };

  if (opts.json !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(
    `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`,
    {
      credentials: 'include',
      ...opts,
      headers,
      body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
    }
  );

  const ct = res.headers.get('content-type') || '';
  const parser = ct.includes('application/json') ? res.json() : res.text();
  const data: any = await parser.catch(() => ({}));

  if (!res.ok) {
    const message =
      (data && (data.detail || data.message)) ||
      res.statusText ||
      'Request failed';
    throw new Error(`${res.status} ${message}`);
  }

  return data as T;
}

// Convenience verbs
export const get = <T>(path: string, opts: FetchOptions = {}) =>
  request<T>(path, { ...opts, method: 'GET' });

export const post = <T>(path: string, json?: unknown, opts: FetchOptions = {}) =>
  request<T>(path, { ...opts, method: 'POST', json });

export const del = <T>(path: string, opts: FetchOptions = {}) =>
  request<T>(path, { ...opts, method: 'DELETE' });

// ---- API surface used across the app ----
export type CheckoutResponse = { url: string };

export function createCheckoutSession(
  plan: 'pro' | 'premium' | 'edu'
): Promise<CheckoutResponse> {
  return post<CheckoutResponse>('/stripe/create-checkout-session', { plan });
}

// PayPal helpers (optional)
export type PaypalCreateOrderReq = { amount: string; currency?: string; plan?: string };
export type PaypalCreateOrderResp = { id: string };

export function paypalCreateOrder(
  body: PaypalCreateOrderReq
): Promise<PaypalCreateOrderResp> {
  return post<PaypalCreateOrderResp>('/paypal/create-order', body);
}

export function paypalCaptureOrder(orderId: string): Promise<{ status: string }> {
  return post<{ status: string }>(`/paypal/capture-order/${orderId}`);
}

// Auth helper (if your backend supports it)
export type Me = { id: string; email: string } | null;
export function me(): Promise<Me> {
  return get<Me>('/auth/me');
}

// ---- Default export (required by AuthContext.jsx) ----
const api = {
  API_BASE,
  request,
  get,
  post,
  del,
  createCheckoutSession,
  paypalCreateOrder,
  paypalCaptureOrder,
  me,
};

export default api;
