// Safe fetch helpers for the UI

export async function safeFetchJSON(url, init = {}) {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Expected JSON response");
    }
    return await res.json();
  } catch (err) {
    console.error("safeFetchJSON error:", err);
    throw err;
  }
}

export async function safeFetchText(url, init = {}) {
  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return await res.text();
  } catch (err) {
    console.error("safeFetchText error:", err);
    throw err;
  }
}
