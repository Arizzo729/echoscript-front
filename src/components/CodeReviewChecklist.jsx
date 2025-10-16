import React from "react";

export default function CodeReviewChecklist() {
  return (
    <div className="p-4 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold mb-2">Code Review Checklist</h2>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        <li>Build passes locally (npm run build)</li>
        <li>No console errors/warnings in production</li>
        <li>Routes load; deep links work</li>
        <li>Large bundles are code-split</li>
        <li>No secrets in frontend</li>
      </ul>
    </div>
  );
}