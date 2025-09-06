# SynergySphere - Advanced Project Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)](https://www.mongodb.com/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Code Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen)]()

## 🚀 Overview

SynergySphere is a comprehensive, enterprise-grade project management platform built with modern technologies and following industry best practices. It provides real-time collaboration, advanced task management, and robust security features.

### ✨ Key Features

- **🔐 Secure Authentication** - JWT-based auth with refresh tokens
- **📊 Real-time Dashboard** - Live updates with Socket.io
- **👥 Team Collaboration** - Project member management and roles
- **✅ Advanced Task Management** - Kanban boards, priorities, and deadlines
- **📱 Responsive Design** - Mobile-first approach with TailwindCSS
- **🔍 Search & Filtering** - Advanced search across projects and tasks
- **📈 Analytics** - Project progress tracking and team productivity insights
- **🌐 REST API** - Comprehensive API with OpenAPI documentation
- **🐳 Docker Support** - Containerized deployment ready
- **🧪 Test Coverage** - Comprehensive unit and integration tests

## 🏗️ Architecture

### Backend (MVC Pattern)
```
backend/
├── src/
│   ├── app/                    # Application layer (MVC)
│   │   ├── controllers/        # Route controllers
│   │   ├── models/            # Database models
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   ├── dto/              # Data transfer objects
│   │   └── views/            # Response templates
│   ├── core/                  # Core framework
│   │   ├── base/             # Abstract base classes
│   │   ├── interfaces/       # Core interfaces
│   │   ├── middleware/       # Custom middleware
│   │   └── utils/           # Utility functions
│   └── infrastructure/       # Infrastructure layer
│       ├── database/        # Database configuration
│       └── routes/         # Route definitions
```

### Frontend (Component-Based)
```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   ├── layout/          # Layout components
│   │   ├── forms/           # Form components
│   │   └── features/        # Feature-specific components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── stores/              # State management
│   ├── types/               # TypeScript definitions
│   └── utils/               # Utility functions
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **MongoDB** >= 6.0
- **npm** or **yarn**
- **Git**

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aryanpatel8799/odoo-nmit.git
   cd odoo-nmit
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run build
   npm run seed
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with backend URL
   npm run dev
   ```

4. **Docker Setup (Alternative)**
   ```bash
   docker-compose up -d
   ```

### 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Documentation**: http://localhost:5000/docs
- **Health Check**: http://localhost:5000/api/health

## 📋 Environment Variables

### Backend (.env)
```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/synergysphere

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=SynergySphere
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run with coverage report
npm run test:e2e          # Run end-to-end tests
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run component tests
npm run test:e2e           # Run Cypress tests
```

## 📊 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <access_token>
```

### Project Endpoints

#### Get All Projects
```http
GET /api/projects?page=1&limit=10&search=project&status=active
Authorization: Bearer <access_token>
```

#### Create Project
```http
POST /api/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "New Project",
  "description": "Project description",
  "category": "development",
  "priority": "high",
  "startDate": "2024-01-15",
  "endDate": "2024-06-15",
  "members": ["userId1", "userId2"]
}
```

### Task Endpoints

#### Get Project Tasks
```http
GET /api/tasks?projectId=<id>&status=pending&priority=high
Authorization: Bearer <access_token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Implement Feature X",
  "description": "Detailed description",
  "projectId": "projectId",
  "assignedTo": "userId",
  "priority": "high",
  "dueDate": "2024-02-15"
}
```

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt (12 rounds)
- **Rate Limiting** to prevent abuse
- **CORS Protection** with configurable origins
- **Input Validation** using express-validator
- **SQL Injection Prevention** via Mongoose ODM
- **XSS Protection** with sanitization
- **Security Headers** via Helmet.js
- **Environment Variable Protection**

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up --scale api=3 --scale frontend=2
```

### Environment-Specific Deployments

#### Development
- Hot reloading with nodemon
- Detailed error messages
- Development-specific logging

#### Staging
- Production-like environment
- Integration testing
- Performance monitoring

#### Production
- Optimized builds
- Error tracking
- Health monitoring
- Load balancing

## 📈 Performance Optimization

- **Database Indexing** for optimal query performance
- **Response Compression** using gzip
- **Caching Strategies** with Redis (optional)
- **Connection Pooling** for database efficiency
- **Code Splitting** in frontend
- **Lazy Loading** for improved UX
- **Bundle Optimization** with Vite

## 🔧 Development Workflow

### Code Quality Tools

1. **ESLint** - Code linting and style checking
2. **Prettier** - Code formatting
3. **TypeScript** - Type safety
4. **Husky** - Git hooks for quality gates
5. **Jest** - Unit testing framework
6. **Cypress** - End-to-end testing

### Pre-commit Hooks
```bash
# Install pre-commit hooks
npm run prepare

# Hooks will run automatically on commit:
# - ESLint checks
# - TypeScript compilation
# - Unit tests
# - Code formatting
```

## 📊 Monitoring & Analytics

### Application Monitoring
- **Health Check Endpoints** for uptime monitoring
- **Performance Metrics** collection
- **Error Tracking** with detailed logging
- **Database Query Analysis**

### Business Analytics
- **User Activity Tracking**
- **Project Completion Metrics**
- **Team Productivity Reports**
- **Task Performance Analytics**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Maintain 80%+ test coverage
- Use conventional commit messages
- Update documentation for new features

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Changelog](CHANGELOG.md)

## 🔄 Version History

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## 🆘 Support

- **Documentation**: Check our comprehensive docs
- **Issues**: [GitHub Issues](https://github.com/Aryanpatel8799/odoo-nmit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Aryanpatel8799/odoo-nmit/discussions)
- **Email**: support@synergysphere.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/) - Runtime environment
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [React](https://reactjs.org/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling framework

---

**Built with ❤️ by the NMIT Team**

For questions, suggestions, or support, please reach out to us through our GitHub repository or email.
