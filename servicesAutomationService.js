// services/AutomationService.js

const PROVIDERS = {
  BROWSE_AI: "browseAI",
  BARDEEN_AI: "bardeenAI",
  SIMPLE_SCRAPER: "simpleScraper",
  OCTOPARSE: "octoparse",
};

const config = {
  browseAI: {
    apiBase: "https://api.browse.ai/v1",
    apiKey: import.meta.env.VITE_BROWSE_AI_API_KEY,
  },
  bardeenAI: {},
  simpleScraper: {
    apiBase: "https://api.simplescraper.io/api",
    apiKey: import.meta.env.VITE_SIMPLE_SCRAPER_API_KEY,
  },
  octoparse: {
    apiBase: "https://dataapi.octoparse.com/api",
    apiKey: import.meta.env.VITE_OCTOPARSE_API_KEY,
  },
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

class AutomationService {
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
      throw error;
    }
  }

  static async runAutomation(provider, automationId, inputData, options = {}) {
    switch (provider) {
      case PROVIDERS.BROWSE_AI:
        return await this._runBrowseAI(automationId, inputData, options);
      case PROVIDERS.SIMPLE_SCRAPER:
        return await this._runSimpleScraper(automationId, inputData, options);
      case PROVIDERS.OCTOPARSE:
        return await this._runOctoparse(automationId, inputData, options);
      case PROVIDERS.BARDEEN_AI:
        throw new Error("Bardeen.AI requires extension or manual interaction.");
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  static async _runBrowseAI(automationId, inputData, { webhookUrl, batchId } = {}) {
    const { apiBase, apiKey } = config.browseAI;
    const body = { inputData, webhookUrl, batchId };

    const url = `${apiBase}/automations/${automationId}/run`;
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

  static async _runSimpleScraper(automationId, inputData, { webhookUrl } = {}) {
    const { apiBase, apiKey } = config.simpleScraper;
    const body = {
      scraperId: automationId,
      input: inputData,
      webhook: webhookUrl || undefined,
    };

    const url = `${apiBase}/runs`;
    const options = {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    return await this.fetchWithRetries(url, options);
  }

  static async _runOctoparse(automationId, inputData, { webhookUrl } = {}) {
    const { apiBase, apiKey } = config.octoparse;
    const body = {
      taskId: automationId,
      params: inputData,
      webhookUrl,
    };

    const url = `${apiBase}/run-task`;
    const options = {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    return await this.fetchWithRetries(url, options);
  }

  static async runBatch(provider, automations) {
    const results = [];
    for (const { automationId, inputData } of automations) {
      try {
        const res = await this.runAutomation(provider, automationId, inputData);
        results.push({ automationId, status: "success", data: res });
      } catch (err) {
        results.push({ automationId, status: "error", error: err.message });
      }
    }
    return results;
  }
}

export { AutomationService, PROVIDERS };
