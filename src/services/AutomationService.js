// ✅ EchoScript.AI — Unified Automation Service Engine
const PROVIDERS = {
  BROWSE_AI: "browseAI",
  BARDEEN_AI: "bardeenAI",
  APIFY: "apify",
  BRIGHTDATA: "brightData",
};

const config = {
  browseAI: {
    apiBase: "https://api.browse.ai/v1",
    apiKey: import.meta.env.VITE_BROWSE_AI_API_KEY,
  },
  apify: {
    apiBase: "https://api.apify.com/v2",
    token: import.meta.env.VITE_APIFY_API_TOKEN,
  },
  brightData: {
    username: import.meta.env.VITE_BRIGHTDATA_USERNAME,
    password: import.meta.env.VITE_BRIGHTDATA_PASSWORD,
    proxyEndpoint: "zproxy.lum-superproxy.io:22225",
  },
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

class AutomationService {
  /**
   * Resilient fetch with retries
   */
  static async fetchWithRetries(url, options, retries = MAX_RETRIES) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      return await res.json();
    } catch (error) {
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        return this.fetchWithRetries(url, options, retries - 1);
      }
      throw new Error(`Failed after ${MAX_RETRIES} attempts → ${error.message}`);
    }
  }

  /**
   * Dispatches the selected provider and automation logic
   */
  static async runAutomation(provider, automationId, inputData = {}, options = {}) {
    switch (provider) {
      case PROVIDERS.BROWSE_AI:
        return await this._runBrowseAI(automationId, inputData, options);
      case PROVIDERS.APIFY:
        return await this._runApify(automationId, options.apifyToken);
      case PROVIDERS.BRIGHTDATA:
        return await this._runBrightData(inputData);
      case PROVIDERS.BARDEEN_AI:
        throw new Error("Bardeen.AI requires manual extension execution.");
      default:
        throw new Error(`❌ Unsupported provider: ${provider}`);
    }
  }

  /**
   * Browse.AI task runner
   */
  static async _runBrowseAI(automationId, inputData, { webhookUrl, batchId } = {}) {
    const { apiBase, apiKey } = config.browseAI;
    const url = `${apiBase}/automations/${automationId}/run`;
    const body = { inputData, webhookUrl, batchId };

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    return await this.fetchWithRetries(url, options);
  }

  /**
   * Apify task runner (sync, returns dataset items)
   */
  static async _runApify(taskId, token = config.apify.token) {
    const url = `${config.apify.apiBase}/actor-tasks/${taskId}/run-sync-get-dataset-items?token=${token}`;
    const options = { method: "GET" };
    return await this.fetchWithRetries(url, options);
  }

  /**
   * BrightData proxy-based task (only use server-side)
   */
  static async _runBrightData(inputData) {
    const { username, password, proxyEndpoint } = config.brightData;
    const proxyUrl = `http://${username}-session-rand:${password}@${proxyEndpoint}`;

    const url = "https://target-site.com/api/search"; // Replace with real scraping target

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // NOTE: Proxies must be handled via server-side HTTP agent
      },
      body: JSON.stringify({ query: inputData }),
    };

    return await this.fetchWithRetries(url, options);
  }

  /**
   * Runs a batch of automations for a provider
   */
  static async runBatch(provider, automations = []) {
    const results = [];

    for (const { automationId, inputData } of automations) {
      try {
        const result = await this.runAutomation(provider, automationId, inputData);
        results.push({ automationId, status: "success", data: result });
      } catch (err) {
        console.error(`Automation failed [${provider} → ${automationId}]`, err);
        results.push({ automationId, status: "error", error: err.message });
      }
    }

    return results;
  }
}

export { AutomationService, PROVIDERS };
