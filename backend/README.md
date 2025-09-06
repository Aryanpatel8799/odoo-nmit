# SynergySphere Backend

A powerful REST API backend for the SynergySphere project collaboration platform built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 **Authentication & Authorization** - JWT-based auth with refresh tokens
- 👥 **User Management** - User profiles, registration, and login
- 📁 **Project Management** - Create, update, delete projects with member management
- ✅ **Task Management** - Full CRUD operations for tasks with status tracking
- 🔍 **Search & Filtering** - Advanced search and filtering capabilities
- 📄 **Pagination** - Efficient data pagination for large datasets
- 🛡️ **Security** - Helmet, CORS, rate limiting, and input validation
- 📊 **Real-time Updates** - Socket.io integration for live updates
- 📝 **Logging** - Comprehensive logging with Winston
- 🔧 **Validation** - Request validation with express-validator
- 🚀 **Performance** - Compression, caching, and optimized queries

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **Security**: Helmet, CORS, bcryptjs
- **Validation**: express-validator, Joi
- **Logging**: Winston
- **Development**: tsx, nodemon

## Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 5.0 or higher
- npm or yarn package manager

## Quick Start

### 1. Clone and Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Configure Environment

Edit the `.env` file with your configuration:

```env
# Environment
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/synergysphere

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Using MongoDB service (Linux/macOS)
sudo systemctl start mongod

# Using MongoDB directly
mongod

# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Initialize Database

```bash
# Seed the database with sample data
npm run seed
```

### 5. Start Development Server

```bash
# Start in development mode with hot reload
npm run dev

# Or build and start in production mode
npm run build
npm start
```

The API will be available at `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Users

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <access-token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Updated Name",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

### Projects

#### Get All Projects
```http
GET /api/projects?page=1&limit=10&search=project&sort=createdAt&order=desc
Authorization: Bearer <access-token>
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description",
  "tags": ["development", "web"],
  "deadline": "2024-12-31T00:00:00Z"
}
```

#### Get Project by ID
```http
GET /api/projects/:id
Authorization: Bearer <access-token>
```

#### Update Project
```http
PUT /api/projects/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

#### Delete Project
```http
DELETE /api/projects/:id
Authorization: Bearer <access-token>
```

#### Add Project Member
```http
POST /api/projects/:id/members
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "userId": "user-id",
  "role": "member"
}
```

#### Remove Project Member
```http
DELETE /api/projects/:id/members/:userId
Authorization: Bearer <access-token>
```

### Tasks

#### Get Project Tasks
```http
GET /api/tasks/project/:projectId?status=todo&priority=high&page=1&limit=10
Authorization: Bearer <access-token>
```

#### Get My Tasks
```http
GET /api/tasks/my-tasks?status=in_progress&page=1&limit=10
Authorization: Bearer <access-token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "projectId": "project-id",
  "title": "Task Title",
  "description": "Task description",
  "assigneeId": "user-id",
  "dueDate": "2024-12-31T00:00:00Z",
  "priority": "high",
  "tags": ["bug", "urgent"]
}
```

#### Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer <access-token>
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "title": "Updated Task Title",
  "status": "in_progress",
  "priority": "medium"
}
```

#### Update Task Status
```http
PATCH /api/tasks/:id/status
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "status": "done"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <access-token>
```

### Health Check
```http
GET /api/health
```

## Sample Data

After running `npm run seed`, you can use these credentials:

**Primary User:**
- Email: `user@example.com`
- Password: `password123`

**Other Users:**
- `sarah@example.com` / `password123`
- `mike@example.com` / `password123`
- `emma@example.com` / `password123`

## Socket.io Events

### Client Events

#### Join Project Room
```javascript
socket.emit('join-project', projectId);
```

#### Leave Project Room
```javascript
socket.emit('leave-project', projectId);
```

#### Task Updated
```javascript
socket.emit('task-updated', {
  taskId: 'task-id',
  projectId: 'project-id',
  status: 'done'
});
```

### Server Events

#### Task Updated
```javascript
socket.on('task-updated', (data) => {
  // Handle task update
});
```

#### Project Updated
```javascript
socket.on('project-updated', (data) => {
  // Handle project update
});
```

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Database connection
│   └── index.ts      # Environment config
├── controllers/      # Route controllers
│   ├── AuthController.ts
│   ├── ProjectController.ts
│   └── TaskController.ts
├── middleware/       # Custom middleware
│   ├── auth.ts       # Authentication middleware
│   ├── error.ts      # Error handling
│   └── validation.ts # Request validation
├── models/           # Mongoose models
│   ├── User.ts
│   ├── Project.ts
│   ├── Task.ts
│   └── index.ts
├── routes/           # Express routes
│   ├── auth.ts
│   ├── users.ts
│   ├── projects.ts
│   ├── tasks.ts
│   └── index.ts
├── scripts/          # Utility scripts
│   └── seed.ts       # Database seeding
├── types/            # TypeScript types
│   └── index.ts
├── utils/            # Utility functions
│   ├── jwt.ts        # JWT utilities
│   ├── logger.ts     # Logging setup
│   ├── query.ts      # Query helpers
│   └── response.ts   # Response helpers
├── app.ts            # Express app setup
└── server.ts         # Server entry point
```

## Scripts

```bash
# Development
npm run dev          # Start with hot reload
npm run build        # Build TypeScript
npm start           # Start production server

# Database
npm run seed        # Seed database with sample data

# Code Quality
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint errors
npm run format      # Format code with Prettier

# Testing
npm test           # Run tests
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/synergysphere` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | Required |
| `JWT_REFRESH_EXPIRE` | Refresh token expiration | `30d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW` | Rate limit window (minutes) | `15` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## Security Features

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control
- **Password Security**: bcrypt hashing with salt
- **Rate Limiting**: Configurable request limits
- **CORS**: Cross-origin resource sharing protection
- **Helmet**: Security headers
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Secure error responses

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "data": null
}
```

## Pagination

List endpoints support pagination:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

Built with ❤️ by the NMIT Team
