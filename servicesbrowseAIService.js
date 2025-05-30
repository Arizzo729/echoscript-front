// services/browseAIService.js

const API_BASE = "https://api.browse.ai/v1";

export async function runAutomation(automationId, inputData) {
  const response = await fetch(`${API_BASE}/automations/${automationId}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_BROWSE_AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputData }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Browse.AI failed: ${response.status} – ${errorText}`);
  }

  return await response.json();
}
