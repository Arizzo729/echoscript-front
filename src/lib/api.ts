// src/lib/api.js
const ORIGIN_API = ''; // use Netlify proxy: /api -> backend
const API = ORIGIN_API.replace(/\/+$/, ''); // safety

async function request(path, { method = 'GET', headers = {}, body, authToken, isJSON = true } = {}) {
  const url = `${API}/api${path}`;
  const h = { ...headers };
  if (isJSON) h['Content-Type'] = 'application/json';
  if (authToken) h['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(url, { method, headers: h, body });
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    const msg = (data && (data.detail || data.message)) || res.statusText || 'Request failed';
    throw new Error(`${res.status}: ${msg}`);
  }
  return data;
}

// ---- Auth ----
export function signup({ email, password }) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ---- Transcription ----
export function transcribe(file, authToken) {
  const form = new FormData();
  form.append('file', file);
  return fetch(`${API}/api/transcribe`, {
    method: 'POST',
    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    body: form,
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error((data && (data.detail || data.message)) || res.statusText);
    return data;
  });
}

export default { signup, login, transcribe };
