// ✅ EchoScript.AI — Browse.AI Automation Trigger Service

const API_BASE = "https://api.browse.ai/v1";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const BROWSE_AI_KEY = import.meta.env.VITE_BROWSE_AI_API_KEY;

export async function runAutomation(automationId, inputData = {}, options = {}) {
  const { webhookUrl, batchId } = options;
  const body = { inputData, webhookUrl, batchId };

  const url = `${API_BASE}/automations/${automationId}/run`;

  const headers = {
    Authorization: `Bearer ${BROWSE_AI_KEY}`,
    "Content-Type": "application/json",
  };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      return await res.json();
    } catch (err) {
      console.warn(`Browse.AI attempt ${attempt} failed: ${err.message}`);
      if (attempt === MAX_RETRIES) throw new Error(`Browse.AI failed after ${MAX_RETRIES} attempts → ${err.message}`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
    }
  }
}
