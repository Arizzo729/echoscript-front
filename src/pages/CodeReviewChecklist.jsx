import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Circle,
  AlertTriangle,
  Code,
  Shield,
  Zap,
  FileCode,
  Download,
  Upload,
  Printer,
  Filter,
  Search,
} from "lucide-react";

/** -------- Checklist Model (light edits to fit EchoScript) --------
 * - Performance.storage: clarified to "no secrets in localStorage + try/catch"
 * - Security/billing: generalized "Stripe webhook" → "Billing webhook signature verified"
 * - EchoScript: API_BASE guidance kept
 */
const categories = [
  {
    id: "react",
    title: "React/JSX Patterns",
    icon: Code,
    items: [
      { id: "prop-types", text: "PropTypes added for all components (or TypeScript types)", severity: "medium" },
      { id: "keys", text: "Unique, stable keys on all .map() items (not index)", severity: "high" },
      { id: "deps", text: "useEffect dependencies complete & correct", severity: "high" },
      { id: "cleanup", text: "Cleanup functions for timers, listeners, subscriptions", severity: "high" },
      { id: "state", text: "State updates use functional form when depending on previous state", severity: "medium" },
      { id: "memo", text: "useMemo/useCallback used appropriately (not over-optimized)", severity: "low" },
      { id: "conditional-hooks", text: "No hooks inside conditionals or loops", severity: "critical" },
    ],
  },
  {
    id: "api-backend",
    title: "API & Backend Integration",
    icon: Shield,
    items: [
      { id: "error-handling", text: "API errors caught with try/catch + user-friendly messages", severity: "high" },
      { id: "loading-states", text: "Loading states (setLoading, setBusy) shown during API calls", severity: "medium" },
      { id: "json-parsing", text: "JSON parsing wrapped in try/catch (response might be text)", severity: "high" },
      { id: "credentials", text: 'credentials:"include" used for authenticated endpoints', severity: "high" },
      { id: "fallback-endpoints", text: "Multiple endpoint attempts for missing routes (Contact.jsx pattern)", severity: "low" },
      { id: "abort-controller", text: "AbortController used for cancellable requests", severity: "medium" },
      { id: "api-base-consistent", text: "API_BASE variable consistent across files", severity: "high" },
    ],
  },
  {
    id: "security",
    title: "Security & Auth",
    icon: Shield,
    items: [
      { id: "env", text: "No hardcoded secrets - all in .env (excluded from git)", severity: "critical" },
      { id: "xss", text: "User input sanitized (esp. dangerouslySetInnerHTML)", severity: "critical" },
      { id: "auth-bypass", text: "DEV_BYPASS_FLAG removed or properly guarded for prod", severity: "critical" },
      { id: "honeypot", text: "Honeypot fields added to public forms (Contact pattern)", severity: "medium" },
      { id: "cors", text: "CORS/proxy config matches deployment (Netlify redirects)", severity: "high" },
      { id: "token-storage", text: "Auth tokens never logged or exposed in client code", severity: "critical" },
      { id: "billing-webhook", text: "Billing webhook signature is verified server-side", severity: "high" },
    ],
  },
  {
    id: "performance",
    title: "Performance",
    icon: Zap,
    items: [
      { id: "lazy", text: "Heavy components lazy-loaded (React.lazy + Suspense)", severity: "medium" },
      { id: "images", text: "Images optimized/compressed; use srcset when needed", severity: "low" },
      { id: "bundle", text: "No unnecessary dependencies bloating bundle", severity: "medium" },
      { id: "rerenders", text: "Checked for unnecessary re-renders (React DevTools)", severity: "low" },
      { id: "storage", text: "localStorage used safely (no secrets; wrap access in try/catch)", severity: "critical" },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility (a11y)",
    icon: FileCode,
    items: [
      { id: "aria", text: "aria-label/aria-labelledby on interactive elements", severity: "medium" },
      { id: "focus", text: "Keyboard navigation works (Tab, Enter, Escape)", severity: "high" },
      { id: "alt", text: "alt text on images; icons marked aria-hidden", severity: "medium" },
      { id: "contrast", text: "Color contrast passes WCAG AA (4.5:1 text, 3:1 UI)", severity: "medium" },
      { id: "semantic", text: "Semantic HTML used (nav, main, button vs div)", severity: "low" },
    ],
  },
  {
    id: "code-quality",
    title: "Code Quality",
    icon: Code,
    items: [
      { id: "naming", text: "Clear, consistent naming (camelCase vars, PascalCase components)", severity: "low" },
      { id: "comments", text: "Complex logic has brief comments explaining why", severity: "low" },
      { id: "duplication", text: "No major code duplication (DRY principle)", severity: "medium" },
      { id: "eslint", text: "No ESLint warnings/errors", severity: "medium" },
      { id: "console", text: "console.log removed (or wrapped in dev checks)", severity: "low" },
      { id: "todos", text: "No stale TODO/FIXME comments", severity: "low" },
    ],
  },
  {
    id: "context-hooks",
    title: "Context & Custom Hooks",
    icon: Code,
    items: [
      { id: "context-errors", text: "Context hooks throw if used outside provider", severity: "high" },
      { id: "usememo-context", text: "Context value wrapped in useMemo to prevent re-renders", severity: "high" },
      { id: "cleanup-hooks", text: "Custom hooks return cleanup functions (useEffect)", severity: "high" },
      { id: "cancelled-flag", text: 'Async hooks use "cancelled" flag to avoid setState after unmount', severity: "critical" },
      { id: "localstorage-sync", text: "localStorage reads/writes wrapped in try/catch", severity: "medium" },
      { id: "storage-events", text: "Storage listeners cleaned up properly (removeEventListener)", severity: "medium" },
      { id: "context-naming", text: "Context + hook named consistently (ThemeContext/useTheme)", severity: "low" },
      { id: "initial-value", text: "Context created with null/undefined, not {}", severity: "low" },
    ],
  },
  {
    id: "echoscript-specific",
    title: "EchoScript Patterns",
    icon: AlertTriangle,
    items: [ // This seems to be a new file, but the icon for this category is wrong.
      { id: "api-base", text: 'API_BASE uses import.meta.env.VITE_API_BASE ?? "/api"', severity: "high" },
      { id: "sound-context", text: "useSound() used correctly for audio feedback", severity: "low" },
      { id: "toast", text: "Toast notifications for user feedback (avoid alert())", severity: "medium" },
      { id: "mobile-layout", text: "Mobile/desktop layouts tested (useIsMobile hook)", severity: "medium" },
      { id: "error-boundary", text: "ErrorBoundary wraps risky components", severity: "high" },
      { id: "usage-tracking", text: "transcriptionUsage utils used for guest caps", severity: "medium" },
    ],
  },
];

const severityColors = {
  critical: "bg-red-500/20 border-red-500 text-red-200",
  high: "bg-orange-500/20 border-orange-500 text-orange-200",
  medium: "bg-yellow-500/20 border-yellow-500 text-yellow-200",
  low: "bg-blue-500/20 border-blue-500 text-blue-200",
};

const severityWeight = { critical: 4, high: 3, medium: 2, low: 1 };
const LS_KEY = "echoscript_code_review_v1";

export default function CodeReviewChecklist() {
  const [checked, setChecked] = useState({});
  const [activeCategory, setActiveCategory] = useState("react");
  const [filter, setFilter] = useState("all"); // all | remaining | critical
  const [query, setQuery] = useState("");

  // Load/save progress automatically
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(checked));
    } catch {}
  }, [checked]);

  const toggleItem = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleAll = (categoryId, value) => {
    const items = categories.find((c) => c.id === categoryId)?.items || [];
    const updates = {};
    items.forEach((item) => {
      if (passesFilters(item)) updates[item.id] = value;
    });
    setChecked((prev) => ({ ...prev, ...updates }));
  };

  const getStats = (categoryId) => {
    const items = categories.find((c) => c.id === categoryId)?.items || [];
    const visible = items.filter(passesFilters);
    const total = visible.length;
    const completed = visible.filter((item) => checked[item.id]).length;

    // Weighted score for nerds like us
    const totalWeight = visible.reduce((s, it) => s + (severityWeight[it.severity] || 1), 0);
    const doneWeight = visible.reduce(
      (s, it) => s + (checked[it.id] ? severityWeight[it.severity] || 1 : 0),
      0
    );
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const weighted = totalWeight ? Math.round((doneWeight / totalWeight) * 100) : 0;

    return { total, completed, percent, weighted };
  };

  const passesFilters = (item) => {
    if (filter === "critical" && item.severity !== "critical") return false;
    if (filter === "remaining" && checked[item.id]) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.text.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
  };

  const activeCategoryObj = useMemo(
    () => categories.find((c) => c.id === activeCategory) || categories[0],
    [activeCategory]
  );
  const activeItems = activeCategoryObj.items.filter(passesFilters);
  const stats = getStats(activeCategoryObj.id);

  const overall = useMemo(() => {
    const all = categories.flatMap((c) => c.items.filter(passesFilters));
    const total = all.length;
    const completed = all.filter((i) => checked[i.id]).length;
    const totalWeight = all.reduce((s, it) => s + (severityWeight[it.severity] || 1), 0);
    const doneWeight = all.reduce(
      (s, it) => s + (checked[it.id] ? severityWeight[it.severity] || 1 : 0),
      0
    );
    return {
      total,
      completed,
      percent: total ? Math.round((completed / total) * 100) : 0,
      weighted: totalWeight ? Math.round((doneWeight / totalWeight) * 100) : 0,
    };
  }, [checked, filter, query]);

  const exportJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      project: "EchoScript.AI",
      checked,
      overall,
      perCategory: Object.fromEntries(
        categories.map((c) => [c.id, getStats(c.id)])
      ),
    };
    downloadBlob(JSON.stringify(data, null, 2), `code-review-${dateStamp()}.json`, "application/json");
  };

  const exportMarkdown = () => {
    let md = `# EchoScript Code Review — ${new Date().toLocaleString()}\n\n`;
    md += `Overall: **${overall.completed}/${overall.total} (${overall.percent}%)**, weighted **${overall.weighted}%**\n\n`;
    for (const cat of categories) {
      const s = getStats(cat.id);
      md += `## ${cat.title} — ${s.completed}/${s.total} (${s.percent}%)\n`;
      for (const it of cat.items) {
        const mark = checked[it.id] ? "x" : " ";
        md += `- [${mark}] ${it.text} _(severity: ${it.severity})_\n`;
      }
      md += "\n";
    }
    downloadBlob(md, `code-review-${dateStamp()}.md`, "text/markdown");
  };

  const importJSON = async (file) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data && typeof data.checked === "object") {
        setChecked(data.checked);
      } else {
        alert("Invalid file format.");
      }
    } catch {
      alert("Failed to import file.");
    }
  };

  function downloadBlob(content, name, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: name });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  const dateStamp = () => new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Code Review Checklist
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <p className="text-zinc-400">EchoScript.AI · React + Vite + Tailwind</p>
            <div className="flex gap-2">
              <button
                onClick={exportJSON}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
              <button
                onClick={exportMarkdown}
                className="px-3 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export MD
              </button>
              <label className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept="application/json"
                  onChange={(e) => e.target.files?.[0] && importJSON(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-3 mb-6">
          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Categories">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const s = getStats(cat.id);
              const isComplete = s.completed === s.total && s.total > 0;
              const selected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    selected
                      ? "bg-teal-600 text-white shadow-lg"
                      : isComplete
                      ? "bg-green-900/40 text-green-300 hover:bg-green-900/60 border border-green-500/40"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.title}
                  <span className="text-xs opacity-70">
                    {s.completed}/{s.total}
                  </span>
                  {isComplete && <CheckCircle className="w-4 h-4 text-green-400" />}
                </button>
              );
            })}
          </div>

          {/* Filters / Search */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-zinc-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search items…"
                className="pl-8 pr-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-2 top-2.5 text-zinc-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                title="Filter"
              >
                <option value="all">All</option>
                <option value="remaining">Remaining</option>
                <option value="critical">Critical only</option>
              </select>
            </div>
            <button
              onClick={() => {
                const criticalIds = categories
                  .flatMap((c) => c.items)
                  .filter((i) => i.severity === "critical" && passesFilters(i))
                  .map((i) => i.id);
                setChecked((prev) => Object.fromEntries([
                  ...Object.entries(prev),
                  ...criticalIds.map((id) => [id, true]),
                ]));
              }}
              className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-sm font-medium transition flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3" />
              Check All Critical
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 bg-zinc-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-sm font-medium">
                {stats.completed} of {stats.total} in {activeCategoryObj.title}
              </span>
              <span className="text-xs text-zinc-500 ml-2">
                ({overall.completed}/{overall.total} overall · weighted {overall.weighted}%)
              </span>
            </div>
            <span className="text-sm text-teal-400 font-semibold">{stats.percent}%</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-blue-500 h-full transition-all duration-500"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => toggleAll(activeCategoryObj.id, true)}
            className="px-3 py-2 rounded-md bg-teal-600 hover:bg-teal-500 text-sm font-medium transition"
          >
            Check All (visible)
          </button>
          <button
            onClick={() => toggleAll(activeCategoryObj.id, false)}
            className="px-3 py-2 rounded-md bg-zinc-700 hover:bg-zinc-600 text-sm font-medium transition"
          >
            Clear All (visible)
          </button>
          <button
            onClick={() => setChecked({})}
            className="px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm font-medium transition"
            title="Reset all progress"
          >
            Reset Progress
          </button>
        </div>

        {/* Checklist Items */}
        <div className="space-y-3">
          {activeItems.map((item) => {
            const isChecked = !!checked[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isChecked
                    ? "bg-teal-900/30 border-teal-600"
                    : "bg-zinc-800 border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isChecked ? (
                      <CheckCircle className="w-5 h-5 text-teal-400" aria-hidden />
                    ) : (
                      <Circle className="w-5 h-5 text-zinc-500" aria-hidden />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${isChecked ? "line-through text-zinc-400" : "text-zinc-200"}`}>
                      {item.text}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold border ${severityColors[item.severity]}`}
                    aria-label={`Severity ${item.severity}`}
                  >
                    {item.severity}
                  </span>
                </div>
              </div>
            );
          })}
          {activeItems.length === 0 && (
            <div className="p-4 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300">
              No items match your filters.
            </div>
          )}
        </div>

        {/* Footer Tips */}
        <div className="mt-8 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            EchoScript.AI Quick Tips
          </h3>
          <ul className="text-xs text-zinc-400 space-y-1 list-disc list-inside">
            <li>
              Focus on <span className="text-red-400 font-semibold">critical</span> &{" "}
              <span className="text-orange-400 font-semibold">high</span> items first
            </li>
            <li>
              <strong>Frontend:</strong> <code className="bg-zinc-900 px-1 rounded">npm run lint</code> before
              committing
            </li>
            <li>
              <strong>Backend:</strong> <code className="bg-zinc-900 px-1 rounded">ruff check .</code> and{" "}
              <code className="bg-zinc-900 px-1 rounded">mypy app</code>
            </li>
            <li>Test mobile layout (MobileLayout.jsx handles safe-area-inset)</li>
            <li>Verify useAuth(), useTheme(), useSound() contexts work</li>
            <li>Check API_BASE proxies correctly: /api → api.echoscript.ai</li>
            <li>Remove DEV_BYPASS_FLAG before production deploy</li>
            <li>Audio unlock on first user interaction (Chrome policy)</li>
            <li>All fetch() calls use credentials:"include" for auth</li>
            <li>
              <strong>Backend:</strong> DATABASE_URL and JWT_SECRET_KEY required in production
            </li>
            <li>
              <strong>Security:</strong> CORS not wildcard (*) in production
            </li>
            <li>Billing webhook signature verified (your provider’s secret)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
