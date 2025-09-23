// src/pages/Status.jsx
import React, { useEffect, useState } from "react";

export default function Status() {
  const [health, setHealth] = useState(null);
  const [stripeEnv, setStripeEnv] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [h, s] = await Promise.all([
          fetch(`/api/_healthz`).then((r) => r.json()),
          fetch(`/api/stripe/_debug-env`).then((r) => r.json()).catch(() => null),
        ]);
        setHealth(h);
        setStripeEnv(s);
      } catch (e) {
        setError(String(e));
      }
    })();
  }, []);

  const Item = ({ k, v }) => (
    <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 py-2">
      <span className="font-mono text-sm">{k}</span>
      <span className={`text-sm ${String(v).includes("error") ? "text-red-500" : "text-emerald-500"}`}>
        {typeof v === "boolean" ? (v ? "true" : "false") : String(v)}
      </span>
    </div>
  );

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">System Status</h1>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <section className="mt-6 max-w-2xl">
        <h2 className="text-lg font-semibold">Backend Health</h2>
        {!health ? <p className="opacity-70">Loading…</p> : (
          <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <Item k="status" v={health.status} />
            {Object.entries(health.checks || {}).map(([k, v]) => <Item key={k} k={k} v={v} />)}
          </div>
        )}
      </section>
      <section className="mt-8 max-w-2xl">
        <h2 className="text-lg font-semibold">Stripe Debug</h2>
        {!stripeEnv ? <p className="opacity-70">Loading…</p> : (
          <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            {Object.entries(stripeEnv).map(([k, v]) => <Item key={k} k={k} v={v} />)}
          </div>
        )}
      </section>
    </main>
  );
}
