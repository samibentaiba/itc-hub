# ITC Hub API Documentation

This document provides comprehensive documentation for all the APIs created for the ITC Hub application.

## Authentication

All APIs require authentication using NextAuth.js. Include the session token in your requests.

## Base URL

All API endpoints are prefixed with `/api/`

## API Endpoints

### Users

#### GET /api/users
Get all users with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email
- `role` (optional): Filter by role
- `departmentId` (optional): Filter by department
- `teamId` (optional): Filter by team

**Response:**
```json
{
  "users": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "ADMIN|SUPERLEADER|LEADER|MEMBER|GUEST",
      "avatar": "string",
      "status": "string",
      "createdAt": "datetime",
      "departments": [...],
      "teams": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

#### POST /api/users
Create a new user (Admin only).

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "ADMIN|SUPERLEADER|LEADER|MEMBER|GUEST",
  "departmentIds": ["string"],
  "teamIds": ["string"]
}
```

#### GET /api/users/[userId]
Get a specific user by ID.

#### PUT /api/users/[userId]
Update a user (Admin or self).

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "string",
  "avatar": "string",
  "status": "string",
  "password": "string",
  "departmentIds": ["string"],
  "teamIds": ["string"]
}
```

#### DELETE /api/users/[userId]
Delete a user (Admin only).

### Departments

#### GET /api/departments
Get all departments with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or description
- `status` (optional): Filter by status

#### POST /api/departments
Create a new department (Admin/SuperLeader only).

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "status": "active|planning",
  "memberIds": ["string"]
}
```

#### GET /api/departments/[departmentId]
Get a specific department by ID.

#### PUT /api/departments/[departmentId]
Update a department (Admin/SuperLeader only).

#### DELETE /api/departments/[departmentId]
Delete a department (Admin only).

### Teams

#### GET /api/teams
Get all teams with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or description
- `status` (optional): Filter by status
- `departmentId` (optional): Filter by department

#### POST /api/teams
Create a new team (Admin/SuperLeader/Leader only).

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "status": "active|planning",
  "departmentId": "string",
  "memberIds": ["string"]
}
```

#### GET /api/teams/[teamId]
Get a specific team by ID.

#### PUT /api/teams/[teamId]
Update a team (Admin/SuperLeader/Leader only).

#### DELETE /api/teams/[teamId]
Delete a team (Admin/SuperLeader only).

### Tickets

#### GET /api/tickets
Get all tickets with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title or description
- `status` (optional): Filter by status
- `type` (optional): Filter by type
- `assigneeId` (optional): Filter by assignee
- `createdById` (optional): Filter by creator
- `teamId` (optional): Filter by team
- `departmentId` (optional): Filter by department

#### POST /api/tickets
Create a new ticket.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "TASK|MEETING|EVENT",
  "status": "OPEN|IN_PROGRESS|SCHEDULED|VERIFIED|CLOSED|CANCELLED",
  "dueDate": "datetime",
  "assigneeId": "string",
  "teamId": "string",
  "departmentId": "string"
}
```

#### GET /api/tickets/[ticketId]
Get a specific ticket by ID.

#### PUT /api/tickets/[ticketId]
Update a ticket (Creator, Assignee, or Admin).

#### DELETE /api/tickets/[ticketId]
Delete a ticket (Creator or Admin).

### Messages

#### GET /api/messages
Get messages for a ticket.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)
- `ticketId` (required): Ticket ID
- `senderId` (optional): Filter by sender

#### POST /api/messages
Create a new message.

**Request Body:**
```json
{
  "ticketId": "string",
  "content": "string",
  "type": "text|image|file",
  "reactions": {}
}
```

#### GET /api/messages/[messageId]
Get a specific message by ID.

#### PUT /api/messages/[messageId]
Update a message (Sender only).

#### DELETE /api/messages/[messageId]
Delete a message (Sender or Admin).

### Events

#### GET /api/events
Get all events with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by title or description
- `type` (optional): Filter by type
- `organizerId` (optional): Filter by organizer
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

#### POST /api/events
Create a new event.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "date": "datetime",
  "time": "string",
  "duration": "string",
  "type": "meeting|event|deadline|workshop|networking",
  "location": "string",
  "attendees": "number",
  "isRecurring": "boolean"
}
```

#### GET /api/events/[eventId]
Get a specific event by ID.

#### PUT /api/events/[eventId]
Update an event (Organizer or Admin).

#### DELETE /api/events/[eventId]
Delete an event (Organizer or Admin).

### Notifications

#### GET /api/notifications
Get user's notifications.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `unread` (optional): Filter unread notifications
- `type` (optional): Filter by type

#### POST /api/notifications
Create a new notification.

**Request Body:**
```json
{
  "userId": "string",
  "title": "string",
  "description": "string",
  "type": "ASSIGNMENT|VERIFICATION|REMINDER|TEAM|GENERAL"
}
```

#### GET /api/notifications/[notificationId]
Get a specific notification by ID.

#### PUT /api/notifications/[notificationId]
Update notification read status (Owner only).

**Request Body:**
```json
{
  "unread": "boolean"
}
```

#### DELETE /api/notifications/[notificationId]
Delete a notification (Owner only).

### Files

#### GET /api/files
Get files with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `ticketId` (optional): Filter by ticket
- `messageId` (optional): Filter by message
- `uploadedById` (optional): Filter by uploader

#### POST /api/files
Upload a file (multipart/form-data).

**Form Data:**
- `file`: File to upload (max 10MB)
- `ticketId` (optional): Associated ticket ID
- `messageId` (optional): Associated message ID

#### GET /api/files/[fileId]
Download a file.

#### DELETE /api/files/[fileId]
Delete a file (Uploader or Admin).

### Profile

#### GET /api/profile
Get user profile.

**Query Parameters:**
- `userId` (optional): User ID (defaults to current user)

#### POST /api/profile
Create a new profile.

**Request Body:**
```json
{
  "realName": "string",
  "bio": "string",
  "profilePic": "base64_string"
}
```

#### GET /api/profile/[profileId]
Get a specific profile by ID.

#### PUT /api/profile/[profileId]
Update a profile (Owner only).

#### DELETE /api/profile/[profileId]
Delete a profile (Owner only).

## Error Responses

All APIs return consistent error responses:

```json
{
  "error": "Error message"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Authentication & Authorization

### Roles
- `ADMIN`: Full access to all features
- `SUPERLEADER`: Can manage departments and teams
- `LEADER`: Can manage teams
- `MEMBER`: Standard user access
- `GUEST`: Limited access

### Permission Matrix

| Action | ADMIN | SUPERLEADER | LEADER | MEMBER | GUEST |
|--------|-------|-------------|--------|--------|-------|
| Create Users | ✅ | ❌ | ❌ | ❌ | ❌ |
| Create Departments | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create Teams | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create Tickets | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create Events | ✅ | ✅ | ✅ | ✅ | ❌ |
| Upload Files | ✅ | ✅ | ✅ | ✅ | ❌ |

## Usage Examples

### JavaScript/TypeScript

```javascript
// Get all users
const response = await fetch('/api/users?page=1&limit=10');
const data = await response.json();

// Create a new ticket
const ticketResponse = await fetch('/api/tickets', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Task',
    description: 'Task description',
    type: 'TASK',
    assigneeId: 'user-id'
  })
});

// Upload a file
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('ticketId', 'ticket-id');

const fileResponse = await fetch('/api/files', {
  method: 'POST',
  body: formData
});
```

### cURL Examples

```bash
# Get all tickets
curl -X GET "http://localhost:3000/api/tickets?page=1&limit=10"

# Create a new department
curl -X POST "http://localhost:3000/api/departments" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering",
    "description": "Software Engineering Department",
    "status": "active"
  }'

# Upload a file
curl -X POST "http://localhost:3000/api/files" \
  -F "file=@document.pdf" \
  -F "ticketId=ticket-id"
```

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## File Upload Limits

- Maximum file size: 10MB
- Supported formats: All file types
- Files are stored in the database as binary data

## Security Considerations

1. All endpoints require authentication
2. Role-based access control is implemented
3. Input validation is performed on all endpoints
4. SQL injection is prevented through Prisma ORM
5. File uploads are validated for size and type

## Development Notes

- All APIs use Next.js App Router
- Database operations use Prisma ORM
- Authentication is handled by NextAuth.js
- Error handling is consistent across all endpoints
- Pagination is implemented for list endpoints
- Search and filtering capabilities are available 