#!/usr/bin/env node
import process from "node:process";

// Simple pre-flight health check script.
// Usage: node scripts/healthz.mjs https://api.echoscript.ai

const target = process.argv[2] || "http://localhost:5173";
const healthzUrl = new URL("/api/healthz", target).toString();

console.log(`[Health Check] Pinging: ${healthzUrl}`);

try {
  const res = await fetch(healthzUrl);
  const body = await res.text();

  if (!res.ok) throw new Error(`Status ${res.status}: ${body}`);

  console.log(`[Health Check] SUCCESS: Status ${res.status}, Body: ${body.slice(0, 100)}`);
  process.exit(0);
} catch (e) {
  console.error(`[Health Check] FAILED: ${e.message}`);
  process.exit(1);
}