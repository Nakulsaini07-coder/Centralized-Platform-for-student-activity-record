import { APIKey, WebhookConfig } from "../types";

const API_KEYS_STORAGE_KEY = "sap_api_keys";
const WEBHOOKS_STORAGE_KEY = "sap_webhooks";

export const generateApiKey = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "sap_";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const getApiKeys = (): APIKey[] => {
  const stored = localStorage.getItem(API_KEYS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveApiKeys = (apiKeys: APIKey[]): void => {
  localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(apiKeys));
};

export const getWebhooks = (): WebhookConfig[] => {
  const stored = localStorage.getItem(WEBHOOKS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveWebhooks = (webhooks: WebhookConfig[]): void => {
  localStorage.setItem(WEBHOOKS_STORAGE_KEY, JSON.stringify(webhooks));
};

// API endpoint handlers (these would typically be on a backend server)
export const validateApiKey = (apiKey: string): APIKey | null => {
  const apiKeys = getApiKeys();
  return apiKeys.find((key) => key.key === apiKey && key.isActive) || null;
};

export const updateApiKeyLastUsed = (apiKey: string): void => {
  const apiKeys = getApiKeys();
  const updatedKeys = apiKeys.map((key) =>
    key.key === apiKey ? { ...key, lastUsed: new Date().toISOString() } : key
  );
  saveApiKeys(updatedKeys);
};

// Webhook utilities
export const triggerWebhook = async (
  event: string,
  data: any
): Promise<void> => {
  const webhooks = getWebhooks();
  const activeWebhooks = webhooks.filter(
    (webhook) => webhook.isActive && webhook.events.includes(event)
  );

  for (const webhook of activeWebhooks) {
    try {
      const payload = {
        event,
        data,
        timestamp: new Date().toISOString(),
        webhook_id: webhook.id,
      };

      await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": webhook.secret,
          "User-Agent": "StudentActivityPlatform/1.0",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(`Failed to trigger webhook ${webhook.name}:`, error);
    }
  }
};

// Mock API responses for demonstration
export const mockApiResponses = {
  activities: {
    get: (params: any) => ({
      success: true,
      data: [], // Would contain actual activities from storage
      timestamp: new Date().toISOString(),
      pagination: {
        page: params.page || 1,
        limit: params.limit || 50,
        total: 0,
      },
    }),

    post: (data: any) => ({
      success: true,
      data: { id: Date.now().toString(), ...data },
      timestamp: new Date().toISOString(),
    }),

    put: (id: string, data: any) => ({
      success: true,
      data: { id, ...data },
      timestamp: new Date().toISOString(),
    }),
  },

  students: {
    get: (params: any) => ({
      success: true,
      data: [], // Would contain actual students from storage
      timestamp: new Date().toISOString(),
      pagination: {
        page: params.page || 1,
        limit: params.limit || 50,
        total: 0,
      },
    }),

    post: (data: any) => ({
      success: true,
      data: { id: Date.now().toString(), ...data },
      timestamp: new Date().toISOString(),
    }),
  },

  reports: {
    get: (params: any) => ({
      success: true,
      data: {
        summary: {
          totalActivities: 0,
          totalStudents: 0,
          approvalRate: 0,
        },
        filters: params,
      },
      timestamp: new Date().toISOString(),
    }),
  },
};
