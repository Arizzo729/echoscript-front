// components/AdaptiveAI.jsx
import React, { useState, useEffect, useCallback } from "react";
import { AutomationService, PROVIDERS } from "../services/AutomationService";

export default function AdaptiveAI({
  initialProvider = PROVIDERS.BROWSE_AI,
  automationId,
  inputData,
  adaptiveContext = {}, // extra metadata for smarter AI routing
}) {
  const [provider, setProvider] = useState(initialProvider);
  const [status, setStatus] = useState("idle"); // idle | running | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [log, setLog] = useState([]);

  // Append log with timestamp
  const appendLog = (msg) =>
    setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  // Adaptive decision logic (stub for advanced logic)
  const chooseProviderAdaptive = useCallback(() => {
    if (inputData && inputData.length > 1000) return PROVIDERS.OCTOPARSE;
    return initialProvider;
  }, [inputData, initialProvider]);

  const runAutomation = useCallback(async () => {
    setStatus("running");
    setError(null);
    setResult(null);
    appendLog(`🔁 Starting automation with provider: ${provider}`);

    try {
      const res = await AutomationService.runAutomation(provider, automationId, inputData);
      appendLog(`✅ Automation completed.`);
      setResult(res);
      setStatus("success");
    } catch (err) {
      appendLog(`❌ Automation failed: ${err.message}`);
      setError(err.message);
      setStatus("error");
    }
  }, [provider, automationId, inputData]);

  // Change provider if AI suggests it
  useEffect(() => {
    const newProvider = chooseProviderAdaptive();
    if (newProvider !== provider) {
      appendLog(`🤖 Adaptive AI switched provider from ${provider} to ${newProvider}`);
      setProvider(newProvider);
    }
  }, [chooseProviderAdaptive, provider]);

  // Auto-run when both inputs are present
  useEffect(() => {
    if (automationId && inputData) {
      runAutomation();
    }
  }, [automationId, inputData, runAutomation]);

  return (
    <div className="adaptive-ai-widget p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-3xl mx-auto font-sans">
      <h2 className="text-2xl font-bold mb-4 text-primary-dark dark:text-primary-light">
        Adaptive AI Automation
      </h2>

      {/* Provider Dropdown */}
      <div className="mb-4">
        <label htmlFor="provider-select" className="block mb-1 font-semibold">
          Select Provider:
        </label>
        <select
          id="provider-select"
          className="p-2 border rounded w-full max-w-xs dark:bg-gray-800 dark:border-gray-700"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          disabled={status === "running"}
        >
          {Object.entries(PROVIDERS).map(([key, val]) => (
            <option key={val} value={val}>
              {key}
            </option>
          ))}
        </select>
      </div>

      {/* Status and Results */}
      <div className="mb-4 min-h-[60px]">
        {status === "idle" && <p className="text-gray-500">Waiting to start automation...</p>}
        {status === "running" && (
          <p className="text-blue-600 animate-pulse font-semibold flex items-center">
            Running automation... <LoadingSpinner />
          </p>
        )}
        {status === "success" && result && (
          <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto max-h-60 text-sm whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
        {status === "error" && <p className="text-red-600 font-semibold">Error: {error}</p>}
      </div>

      {/* Manual Trigger */}
      <div className="mb-4">
        <button
          onClick={runAutomation}
          className="px-5 py-2 bg-primary text-white rounded hover:bg-primary-dark transition disabled:opacity-50"
          disabled={status === "running"}
          aria-label="Run automation manually"
        >
          Run Automation
        </button>
      </div>

      {/* Logs Panel */}
      <details className="bg-gray-50 dark:bg-gray-700 rounded p-3 text-sm">
        <summary className="cursor-pointer font-semibold">Logs ({log.length})</summary>
        <div className="mt-2 max-h-48 overflow-y-auto font-mono whitespace-pre-wrap">
          {log.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </details>
    </div>
  );
}

const LoadingSpinner = () => (
  <svg
    className="inline animate-spin h-5 w-5 text-blue-600 ml-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);
