# Student Activity Platform - New Features Setup Guide

## Overview

This guide explains how to set up and use the new features added to the Student Activity Platform:

1. **Analytics & Reporting** - Generate comprehensive reports for NAAC, AICTE, NIRF, and internal use
2. **Integration Support** - API endpoints and webhooks for external system integration

## New Features Added

### 1. Analytics & Reporting Module

**Location:** `/analytics` (Faculty only)

**Features:**

- Real-time analytics dashboard with filtering options
- Report generation in PDF and Excel formats
- Templates for NAAC, AICTE, NIRF, and Internal reporting
- Monthly activity trends and department-wise breakdowns
- Advanced filtering by year, department, activity type, and date range

**How to Use:**

1. Login as faculty member
2. Navigate to "Analytics" from the sidebar
3. Use filters to customize your report data
4. Click on report format buttons to download reports
5. Generated reports are automatically saved to your downloads folder

### 2. Integration Support Module

**Location:** `/integrations` (Faculty only)

**Features:**

- API key management with granular permissions
- Webhook configuration for real-time notifications
- Comprehensive API documentation
- Token-based authentication
- Support for LMS, ERP, and digital university platform integrations

**How to Use:**

1. Login as faculty member
2. Navigate to "Integrations" from the sidebar
3. Create API keys with specific permissions
4. Configure webhooks for real-time event notifications
5. Use generated API keys in external applications

## Installation Requirements

### Additional Dependencies Installed

```bash
# PDF and Excel generation
npm install jspdf jspdf-autotable xlsx file-saver

# API server dependencies
npm install express cors jsonwebtoken bcryptjs dotenv

# Development dependencies
npm install -D @types/express @types/cors @types/jsonwebtoken @types/bcryptjs @types/file-saver tsx concurrently
```

### New Files Added

```
src/
  components/
    Analytics.tsx                 # Analytics & Reporting dashboard
    IntegrationSupport.tsx       # API key and webhook management
    ApiDocumentation.tsx         # API documentation component
  utils/
    reportGenerator.ts           # PDF/Excel report generation
    apiManager.ts               # API key management utilities
  server/
    api.ts                      # Express API server
  types/
    index.ts                    # Extended with new type definitions
.env                            # Environment configuration
```

### Updated Files

```
src/
  App.tsx                       # Added new page routing
  components/Layout.tsx         # Added new navigation items for faculty
package.json                   # Added new scripts and dependencies
```

## Running the Application

### Development Mode (Frontend Only)

```bash
npm run dev
```

### Full Development Mode (Frontend + API Server)

```bash
npm run dev:full
```

### API Server Only

```bash
npm run api-server
```

## API Integration Guide

### Base URL

```
http://localhost:3001/api/v1
```

### Authentication

All API requests require a Bearer token (API Key):

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     http://localhost:3001/api/v1/activities
```

### Available Endpoints

#### Activities

- `GET /api/v1/activities` - Retrieve activities
- `POST /api/v1/activities` - Create new activity
- `PUT /api/v1/activities/:id` - Update activity

#### Students

- `GET /api/v1/students` - Retrieve students
- `POST /api/v1/students` - Create student record

#### Reports

- `GET /api/v1/reports` - Generate reports

#### System

- `GET /api/v1/health` - Health check
- `GET /api/v1/docs` - API documentation

### API Permissions

When creating API keys, you can assign these permissions:

- `read_activities` - View activities
- `write_activities` - Create/update activities
- `read_students` - View student data
- `write_students` - Create/update students
- `read_reports` - Generate reports
- `manage_approvals` - Approve/reject activities

### Webhook Events

Available webhook events:

- `activity.created` - New activity submitted
- `activity.updated` - Activity modified
- `activity.approved` - Activity approved
- `activity.rejected` - Activity rejected
- `student.registered` - New student registered
- `student.updated` - Student profile updated

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
API_BASE_URL=http://localhost:3001/api/v1
CORS_ORIGIN=http://localhost:5173
```

### Report Templates

The system supports multiple report formats:

1. **NAAC Format** - National Assessment and Accreditation Council
2. **AICTE Format** - All India Council for Technical Education
3. **NIRF Format** - National Institutional Ranking Framework
4. **Internal Format** - Detailed internal reporting

## Testing the New Features

### 1. Analytics & Reporting

1. Login as faculty (use `dr.rajesh@college.edu` / `password123`)
2. Navigate to Analytics
3. Apply different filters and observe real-time updates
4. Generate sample reports in PDF and Excel formats

### 2. Integration Support

1. Navigate to Integrations
2. Create a new API key with specific permissions
3. Test the API key using curl or Postman:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        http://localhost:3001/api/v1/health
   ```
4. Create a webhook pointing to a test endpoint

### 3. API Testing

1. Start the API server: `npm run api-server`
2. Test endpoints using curl, Postman, or similar tools
3. Check the API documentation at: `http://localhost:3001/api/v1/docs`

## Security Considerations

1. **API Keys**: Store securely and rotate regularly
2. **Webhooks**: Always validate the webhook secret
3. **Environment Variables**: Never commit sensitive data to version control
4. **Rate Limiting**: API includes built-in rate limiting
5. **CORS**: Configure appropriate origins for production

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change PORT in .env if 3001 is occupied
2. **Dependencies**: Run `npm install` if packages are missing
3. **CORS errors**: Ensure CORS_ORIGIN matches your frontend URL
4. **API key not working**: Check permissions and active status

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=true
LOG_LEVEL=debug
```

## Production Deployment

### Frontend Build

```bash
npm run build
```

### API Server Production

1. Set production environment variables
2. Use a process manager like PM2
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates
5. Configure database (if using one)

### Database Integration

For production, replace localStorage with a proper database:

1. PostgreSQL, MySQL, or MongoDB
2. Update API endpoints to use database queries
3. Implement proper data validation and sanitization
4. Add database migration scripts

## Support and Documentation

- **API Documentation**: Available at `/api/v1/docs` when server is running
- **Component Documentation**: Each component includes inline documentation
- **Type Definitions**: Check `src/types/index.ts` for data structures

## Compatibility

These new features are designed to:

- ✅ Work alongside existing functionality
- ✅ Maintain backward compatibility
- ✅ Not modify existing user interfaces
- ✅ Be completely optional (faculty-only access)
- ✅ Support future enhancements

## Future Enhancements

Possible future improvements:

1. Real-time notifications for students
2. Advanced analytics with charts and graphs
3. Bulk data import/export functionality
4. Integration with popular LMS platforms
5. Mobile app API support
6. Advanced user role management
7. Audit logs and activity tracking
