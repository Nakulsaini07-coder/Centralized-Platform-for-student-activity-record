import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { APIResponse } from "../types";
import {
  validateApiKey,
  updateApiKeyLastUsed,
  mockApiResponses,
} from "../utils/apiManager";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Key authentication middleware
const authenticateApiKey = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Missing or invalid authorization header",
      timestamp: new Date().toISOString(),
    } as APIResponse);
  }

  const apiKey = authHeader.substring(7);
  const validKey = validateApiKey(apiKey);

  if (!validKey) {
    return res.status(401).json({
      success: false,
      error: "Invalid API key",
      timestamp: new Date().toISOString(),
    } as APIResponse);
  }

  // Update last used timestamp
  updateApiKeyLastUsed(apiKey);

  // Add API key info to request
  (req as any).apiKey = validKey;
  next();
};

// Check permissions middleware
const requirePermission = (permission: string) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const apiKey = (req as any).apiKey;

    if (!apiKey.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        error: `Insufficient permissions. Required: ${permission}`,
        timestamp: new Date().toISOString(),
      } as APIResponse);
    }

    next();
  };
};

// API Routes

// Activities endpoints
app.get(
  "/api/v1/activities",
  authenticateApiKey,
  requirePermission("read_activities"),
  (req, res) => {
    try {
      const response = mockApiResponses.activities.get(req.query);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      } as APIResponse);
    }
  }
);

app.post(
  "/api/v1/activities",
  authenticateApiKey,
  requirePermission("write_activities"),
  (req, res) => {
    try {
      const response = mockApiResponses.activities.post(req.body);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      } as APIResponse);
    }
  }
);

app.put(
  "/api/v1/activities/:id",
  authenticateApiKey,
  requirePermission("write_activities"),
  (req, res) => {
    try {
      const response = mockApiResponses.activities.put(req.params.id, req.body);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      } as APIResponse);
    }
  }
);

// Students endpoints
app.get(
  "/api/v1/students",
  authenticateApiKey,
  requirePermission("read_students"),
  (req, res) => {
    try {
      const response = mockApiResponses.students.get(req.query);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      } as APIResponse);
    }
  }
);

app.post(
  "/api/v1/students",
  authenticateApiKey,
  requirePermission("write_students"),
  (req, res) => {
    try {
      const response = mockApiResponses.students.post(req.body);
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      } as APIResponse);
    }
  }
);

// Reports endpoint
app.get(
  "/api/v1/reports",
  authenticateApiKey,
  requirePermission("read_reports"),
  (req, res) => {
    try {
      const response = mockApiResponses.reports.get(req.query);
      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      } as APIResponse);
    }
  }
);

// Health check endpoint
app.get("/api/v1/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "healthy",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  } as APIResponse);
});

// API documentation endpoint
app.get("/api/v1/docs", (_req, res) => {
  res.json({
    success: true,
    data: {
      title: "Student Activity Platform API",
      version: "1.0.0",
      baseUrl: `http://localhost:${PORT}/api/v1`,
      authentication: "Bearer token (API Key)",
      endpoints: {
        activities: {
          "GET /activities": {
            description: "Retrieve activities",
            permission: "read_activities",
            params: ["page", "limit", "type", "status", "student_id"],
          },
          "POST /activities": {
            description: "Create new activity",
            permission: "write_activities",
            body: "Activity object",
          },
          "PUT /activities/:id": {
            description: "Update activity",
            permission: "write_activities",
            body: "Activity object",
          },
        },
        students: {
          "GET /students": {
            description: "Retrieve students",
            permission: "read_students",
            params: ["page", "limit", "course", "year", "department"],
          },
          "POST /students": {
            description: "Create new student",
            permission: "write_students",
            body: "Student object",
          },
        },
        reports: {
          "GET /reports": {
            description: "Generate reports",
            permission: "read_reports",
            params: ["format", "template", "filters"],
          },
        },
      },
    },
    timestamp: new Date().toISOString(),
  } as APIResponse);
});

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: "Something went wrong!",
      timestamp: new Date().toISOString(),
    } as APIResponse);
  }
);

// 404 handler
app.use("*", (_req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    timestamp: new Date().toISOString(),
  } as APIResponse);
});

// Start server
app.listen(PORT, () => {
  console.log(`Student Activity Platform API server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api/v1/docs`);
  console.log(`Health Check: http://localhost:${PORT}/api/v1/health`);
});

export default app;
