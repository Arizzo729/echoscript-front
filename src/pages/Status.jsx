import React, { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE ?? "/api").replace(/\/+$/, "");

export default function Status() {
  const [health, setHealth] = useState(null);
  const [billingEnv, setBillingEnv] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // Correct health endpoint (no underscore)
        const hRes = await fetch(`${API_BASE}/healthz`);
        const hJson = hRes.ok
          ? // allow text or json, depending on backend
            (await hRes
              .json()
              .catch(async () => ({ status: await hRes.text() || "ok" })))
          : { status: `error_${hRes.status}` };

        // Try Stripe debug; if not found, try generic billing debug; otherwise show a compact error
        async function tryDebug(path) {
          try {
            const r = await fetch(`${API_BASE}${path}`);
            return r.ok ? await r.json() : { error: `debug_${r.status}` };
          } catch {
            return { error: "debug_failed" };
          }
        }
        let debug = await tryDebug(`/stripe/_debug-env`);
        if (debug?.error && debug.error !== "debug_failed") {
          // fall back to /billing/_debug-env if Stripe debug isn’t present
          debug = await tryDebug(`/billing/_debug-env`);
        }

        setHealth(hJson);
        setBillingEnv(debug);
      } catch (e) {
        setError(String(e?.message || e));
      }
    })();
  }, []);

  const Item = ({ k, v }) => (
    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 py-2">
      <span className="font-mono text-sm">{k}</span>
      <span
        className={`text-sm ${
          String(v).toLowerCase().includes("error") ? "text-red-500" : "text-emerald-500"
        }`}
      >
        {typeof v === "boolean" ? (v ? "true" : "false") : String(v)}
      </span>
    </div>
  );

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">System Status</h1>

      {error && <p className="text-red-500 mt-2 whitespace-pre-wrap">{error}</p>}

      <section className="mt-6 max-w-2xl">
        <h2 className="text-lg font-semibold">Backend Health</h2>
        {!health ? (
          <p className="opacity-70">Loading…</p>
        ) : (
          <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <Item k="status" v={health.status ?? "ok"} />
            {Object.entries(health.checks || {}).map(([k, v]) => (
              <Item key={k} k={k} v={v} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 max-w-2xl">
        <h2 className="text-lg font-semibold">Billing/Stripe Debug</h2>
        {!billingEnv ? (
          <p className="opacity-70">Loading…</p>
        ) : (
          <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            {Object.entries(billingEnv).map(([k, v]) => (
              <Item key={k} k={k} v={v} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
