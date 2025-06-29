import React, { useEffect, useState } from "react";
import { AutomationService, PROVIDERS } from "../services/AutomationService";

export default function ApifyTest() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const taskId = "your-apify-task-id"; // Replace with your actual Apify task ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await AutomationService.runAutomation(PROVIDERS.APIFY, taskId);
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10 bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">🔍 Apify Task Output</h2>
      {error && <p className="text-red-500">Error: {error}</p>}
      {data ? (
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        <p className="text-zinc-500 italic">Loading...</p>
      )}
    </div>
  );
}
