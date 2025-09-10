import React from "react";
import { Code, Key, Zap } from "lucide-react";

const ApiDocumentation: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          API Documentation
        </h1>
        <p className="text-gray-600">
          Student Activity Platform RESTful API for external system integration
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2" />
          Quick Start
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              1. Generate API Key
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Create an API key from the Integration Support section in your
              dashboard.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              2. Make API Requests
            </h3>
            <div className="bg-gray-50 rounded p-3">
              <code className="text-sm">
                {`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://your-domain.com/api/v1/activities`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Key className="h-5 w-5 mr-2" />
          Authentication
        </h2>
        <p className="text-gray-600 mb-4">
          All API requests require authentication using Bearer tokens (API
          Keys).
        </p>
        <div className="bg-gray-50 rounded p-3 mb-4">
          <code className="text-sm">Authorization: Bearer YOUR_API_KEY</code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">
              Available Permissions
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <code>read_activities</code> - View activities
              </li>
              <li>
                • <code>write_activities</code> - Create/update activities
              </li>
              <li>
                • <code>read_students</code> - View student data
              </li>
              <li>
                • <code>write_students</code> - Create/update students
              </li>
              <li>
                • <code>read_reports</code> - Generate reports
              </li>
              <li>
                • <code>manage_approvals</code> - Approve/reject activities
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Error Responses</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                • <code>401</code> - Invalid or missing API key
              </li>
              <li>
                • <code>403</code> - Insufficient permissions
              </li>
              <li>
                • <code>429</code> - Rate limit exceeded
              </li>
              <li>
                • <code>500</code> - Internal server error
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Code className="h-5 w-5 mr-2" />
          API Endpoints
        </h2>

        {/* Activities Endpoints */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Activities</h3>

          <div className="space-y-4">
            <div className="border-l-4 border-green-400 pl-4">
              <div className="flex items-center mb-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  GET
                </span>
                <code className="text-sm">/api/v1/activities</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Retrieve activities with optional filtering
              </p>
              <div className="text-xs text-gray-500">
                <p>
                  <strong>Permission:</strong> read_activities
                </p>
                <p>
                  <strong>Query Params:</strong> page, limit, type, status,
                  student_id, date_from, date_to
                </p>
              </div>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <div className="flex items-center mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  POST
                </span>
                <code className="text-sm">/api/v1/activities</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">Create new activity</p>
              <div className="text-xs text-gray-500">
                <p>
                  <strong>Permission:</strong> write_activities
                </p>
                <p>
                  <strong>Body:</strong> Activity object (JSON)
                </p>
              </div>
            </div>

            <div className="border-l-4 border-yellow-400 pl-4">
              <div className="flex items-center mb-2">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  PUT
                </span>
                <code className="text-sm">/api/v1/activities/:id</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Update existing activity
              </p>
              <div className="text-xs text-gray-500">
                <p>
                  <strong>Permission:</strong> write_activities
                </p>
                <p>
                  <strong>Body:</strong> Activity object (JSON)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Endpoints */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Students</h3>

          <div className="space-y-4">
            <div className="border-l-4 border-green-400 pl-4">
              <div className="flex items-center mb-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  GET
                </span>
                <code className="text-sm">/api/v1/students</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Retrieve student information
              </p>
              <div className="text-xs text-gray-500">
                <p>
                  <strong>Permission:</strong> read_students
                </p>
                <p>
                  <strong>Query Params:</strong> page, limit, course, year,
                  department
                </p>
              </div>
            </div>

            <div className="border-l-4 border-blue-400 pl-4">
              <div className="flex items-center mb-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  POST
                </span>
                <code className="text-sm">/api/v1/students</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Create new student record
              </p>
              <div className="text-xs text-gray-500">
                <p>
                  <strong>Permission:</strong> write_students
                </p>
                <p>
                  <strong>Body:</strong> Student object (JSON)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Endpoints */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Reports</h3>

          <div className="space-y-4">
            <div className="border-l-4 border-green-400 pl-4">
              <div className="flex items-center mb-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono mr-2">
                  GET
                </span>
                <code className="text-sm">/api/v1/reports</code>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Generate activity reports
              </p>
              <div className="text-xs text-gray-500">
                <p>
                  <strong>Permission:</strong> read_reports
                </p>
                <p>
                  <strong>Query Params:</strong> format, template, year,
                  department, type
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Webhooks */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Webhooks</h2>
        <p className="text-gray-600 mb-4">
          Subscribe to real-time events from the Student Activity Platform.
        </p>

        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Available Events</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • <code>activity.created</code> - New activity submitted
            </li>
            <li>
              • <code>activity.updated</code> - Activity modified
            </li>
            <li>
              • <code>activity.approved</code> - Activity approved by faculty
            </li>
            <li>
              • <code>activity.rejected</code> - Activity rejected by faculty
            </li>
            <li>
              • <code>student.registered</code> - New student registered
            </li>
            <li>
              • <code>student.updated</code> - Student profile updated
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="font-medium text-gray-900 mb-2">
            Webhook Payload Example
          </h3>
          <div className="bg-gray-50 rounded p-3">
            <pre className="text-xs overflow-x-auto">
              {`{
  "event": "activity.approved",
  "data": {
    "id": "123",
    "title": "Research Paper Published",
    "student_id": "456",
    "student_name": "John Doe",
    "type": "academic",
    "status": "approved"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "webhook_id": "webhook_789"
}`}
            </pre>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h4 className="font-medium text-yellow-800 mb-2">Security</h4>
          <p className="text-sm text-yellow-700">
            Webhook payloads include an <code>X-Webhook-Secret</code> header for
            verification. Always validate this secret to ensure the request
            originates from our platform.
          </p>
        </div>
      </div>

      {/* Response Format */}
      <div className="bg-white rounded-lg shadow mb-8 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Response Format
        </h2>
        <p className="text-gray-600 mb-4">
          All API responses follow a consistent JSON format:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Success Response</h3>
            <div className="bg-gray-50 rounded p-3">
              <pre className="text-xs">
                {`{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-15T10:30:00Z",
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100
  }
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Error Response</h3>
            <div className="bg-gray-50 rounded p-3">
              <pre className="text-xs">
                {`{
  "success": false,
  "error": "Invalid API key",
  "timestamp": "2024-01-15T10:30:00Z"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limiting */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Rate Limiting
        </h2>
        <p className="text-gray-600 mb-4">
          API requests are rate limited to ensure fair usage and system
          stability.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1000</div>
            <div className="text-sm text-gray-600">Requests per hour</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">100</div>
            <div className="text-sm text-gray-600">Requests per minute</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">10</div>
            <div className="text-sm text-gray-600">MB max payload</div>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-blue-700">
            <strong>Rate limit headers:</strong> Check{" "}
            <code>X-RateLimit-Remaining</code> and
            <code>X-RateLimit-Reset</code> headers in API responses to monitor
            your usage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentation;
