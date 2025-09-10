import React, { useState, useEffect } from "react";
import {
  Settings,
  Key,
  Webhook,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { APIKey, WebhookConfig } from "../types";
import {
  generateApiKey,
  saveApiKeys,
  getApiKeys,
  saveWebhooks,
  getWebhooks,
} from "../utils/apiManager";

const IntegrationSupport: React.FC = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [showNewApiKeyForm, setShowNewApiKeyForm] = useState(false);
  const [showNewWebhookForm, setShowNewWebhookForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newApiKeyName, setNewApiKeyName] = useState("");
  const [newApiKeyPermissions, setNewApiKeyPermissions] = useState<string[]>(
    []
  );
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setApiKeys(getApiKeys());
    setWebhooks(getWebhooks());
  };

  const handleCreateApiKey = () => {
    if (!newApiKeyName.trim()) return;

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newApiKeyName,
      key: generateApiKey(),
      permissions: newApiKeyPermissions,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    const updatedKeys = [...apiKeys, newKey];
    setApiKeys(updatedKeys);
    saveApiKeys(updatedKeys);

    setNewApiKeyName("");
    setNewApiKeyPermissions([]);
    setShowNewApiKeyForm(false);
  };

  const handleDeleteApiKey = (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this API key? This action cannot be undone."
      )
    )
      return;

    const updatedKeys = apiKeys.filter((key) => key.id !== id);
    setApiKeys(updatedKeys);
    saveApiKeys(updatedKeys);
  };

  const handleToggleApiKeyStatus = (id: string) => {
    const updatedKeys = apiKeys.map((key) =>
      key.id === id ? { ...key, isActive: !key.isActive } : key
    );
    setApiKeys(updatedKeys);
    saveApiKeys(updatedKeys);
  };

  const handleCreateWebhook = () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim()) return;

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      secret: generateApiKey().substring(0, 32),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const updatedWebhooks = [...webhooks, webhook];
    setWebhooks(updatedWebhooks);
    saveWebhooks(updatedWebhooks);

    setNewWebhook({ name: "", url: "", events: [] });
    setShowNewWebhookForm(false);
  };

  const handleDeleteWebhook = (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this webhook? This action cannot be undone."
      )
    )
      return;

    const updatedWebhooks = webhooks.filter((webhook) => webhook.id !== id);
    setWebhooks(updatedWebhooks);
    saveWebhooks(updatedWebhooks);
  };

  const handleToggleWebhookStatus = (id: string) => {
    const updatedWebhooks = webhooks.map((webhook) =>
      webhook.id === id ? { ...webhook, isActive: !webhook.isActive } : webhook
    );
    setWebhooks(updatedWebhooks);
    saveWebhooks(updatedWebhooks);
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const availablePermissions = [
    { id: "read_activities", label: "Read Activities" },
    { id: "write_activities", label: "Write Activities" },
    { id: "read_students", label: "Read Students" },
    { id: "write_students", label: "Write Students" },
    { id: "read_reports", label: "Read Reports" },
    { id: "manage_approvals", label: "Manage Approvals" },
  ];

  const availableEvents = [
    { id: "activity.created", label: "Activity Created" },
    { id: "activity.updated", label: "Activity Updated" },
    { id: "activity.approved", label: "Activity Approved" },
    { id: "activity.rejected", label: "Activity Rejected" },
    { id: "student.registered", label: "Student Registered" },
    { id: "student.updated", label: "Student Updated" },
  ];

  if (user?.role !== "faculty") {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-600">
          Integration Support is available for faculty members only.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="h-6 w-6 mr-3" />
          Integration Support
        </h2>
        <p className="text-gray-600 mt-1">
          Manage API keys and webhooks for external system integration
        </p>
      </div>

      {/* API Documentation Section */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          API Documentation
        </h3>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">Base URL</h4>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            https://your-domain.com/api/v1
          </code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Available Endpoints
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  GET
                </span>
                <code>/activities</code>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  POST
                </span>
                <code>/activities</code>
              </div>
              <div className="flex items-center">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  PUT
                </span>
                <code>/activities/:id</code>
              </div>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  GET
                </span>
                <code>/students</code>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  POST
                </span>
                <code>/students</code>
              </div>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  GET
                </span>
                <code>/reports</code>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Authentication</h4>
            <p className="text-sm text-gray-600 mb-2">
              Include your API key in the Authorization header:
            </p>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Key className="h-5 w-5 mr-2" />
            API Keys
          </h3>
          <button
            onClick={() => setShowNewApiKeyForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New API Key
          </button>
        </div>

        {/* New API Key Form */}
        {showNewApiKeyForm && (
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4">
              Create New API Key
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newApiKeyName}
                  onChange={(e) => setNewApiKeyName(e.target.value)}
                  placeholder="e.g., LMS Integration, Mobile App"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newApiKeyPermissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewApiKeyPermissions([
                              ...newApiKeyPermissions,
                              permission.id,
                            ]);
                          } else {
                            setNewApiKeyPermissions(
                              newApiKeyPermissions.filter(
                                (p) => p !== permission.id
                              )
                            );
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleCreateApiKey}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create Key
                </button>
                <button
                  onClick={() => setShowNewApiKeyForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Keys List */}
        <div className="space-y-4">
          {apiKeys.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No API keys created yet
            </p>
          ) : (
            apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        apiKey.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {apiKey.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleApiKeyStatus(apiKey.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteApiKey(apiKey.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                    {visibleKeys.has(apiKey.id) ? apiKey.key : "•".repeat(32)}
                  </code>
                  <button
                    onClick={() => toggleKeyVisibility(apiKey.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {visibleKeys.has(apiKey.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => copyToClipboard(apiKey.key)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-sm text-gray-600">
                  <p>
                    Created: {new Date(apiKey.createdAt).toLocaleDateString()}
                  </p>
                  <p>Permissions: {apiKey.permissions.join(", ") || "None"}</p>
                  {apiKey.lastUsed && (
                    <p>
                      Last used:{" "}
                      {new Date(apiKey.lastUsed).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Webhook className="h-5 w-5 mr-2" />
            Webhooks
          </h3>
          <button
            onClick={() => setShowNewWebhookForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Webhook
          </button>
        </div>

        {/* New Webhook Form */}
        {showNewWebhookForm && (
          <div className="border rounded-lg p-4 mb-6 bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-4">
              Create New Webhook
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook Name
                </label>
                <input
                  type="text"
                  value={newWebhook.name}
                  onChange={(e) =>
                    setNewWebhook({ ...newWebhook, name: e.target.value })
                  }
                  placeholder="e.g., LMS Notifications, Slack Integration"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={newWebhook.url}
                  onChange={(e) =>
                    setNewWebhook({ ...newWebhook, url: e.target.value })
                  }
                  placeholder="https://your-system.com/webhook/endpoint"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Events to Subscribe
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableEvents.map((event) => (
                    <label key={event.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newWebhook.events.includes(event.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewWebhook({
                              ...newWebhook,
                              events: [...newWebhook.events, event.id],
                            });
                          } else {
                            setNewWebhook({
                              ...newWebhook,
                              events: newWebhook.events.filter(
                                (e) => e !== event.id
                              ),
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{event.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleCreateWebhook}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create Webhook
                </button>
                <button
                  onClick={() => setShowNewWebhookForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Webhooks List */}
        <div className="space-y-4">
          {webhooks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No webhooks configured yet
            </p>
          ) : (
            webhooks.map((webhook) => (
              <div key={webhook.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">
                      {webhook.name}
                    </h4>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        webhook.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {webhook.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleWebhookStatus(webhook.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteWebhook(webhook.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>URL:</strong> {webhook.url}
                  </p>
                  <p>
                    <strong>Events:</strong> {webhook.events.join(", ")}
                  </p>
                  <p>
                    <strong>Secret:</strong>
                    <code className="ml-1 bg-gray-100 px-1 rounded">
                      {visibleKeys.has(webhook.id)
                        ? webhook.secret
                        : "•".repeat(16)}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(webhook.id)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      {visibleKeys.has(webhook.id) ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </button>
                  </p>
                  <p>
                    <strong>Created:</strong>{" "}
                    {new Date(webhook.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationSupport;
