# Contributing to SynergySphere

Thank you for your interest in contributing to SynergySphere! We welcome contributions from everyone, regardless of experience level.

## 🤝 Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming environment for all contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- Git
- Basic knowledge of TypeScript, React, and Node.js

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/odoo-nmit.git
   cd odoo-nmit
   ```

3. **Set up the backend**:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run build
   npm run seed
   ```

4. **Set up the frontend**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   # Edit .env with backend URL
   ```

5. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📋 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report:

1. **Use a clear, descriptive title**
2. **Describe the exact steps to reproduce**
3. **Provide expected vs actual behavior**
4. **Include screenshots/logs if applicable**
5. **Specify your environment** (OS, Node version, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are welcome! Please:

1. **Check if the enhancement already exists**
2. **Provide a clear use case**
3. **Explain why it would be useful**
4. **Consider implementation complexity**

### 🔧 Code Contributions

#### Types of Contributions

- **Bug fixes**: Fix existing issues
- **Features**: Add new functionality
- **Documentation**: Improve docs
- **Tests**: Add or improve test coverage
- **Performance**: Optimize existing code
- **Refactoring**: Improve code quality

#### Development Workflow

1. **Choose an issue** or create one for discussion
2. **Comment on the issue** to claim it
3. **Create a feature branch** from `develop`
4. **Make your changes** following our guidelines
5. **Write tests** for new functionality
6. **Run the test suite** to ensure nothing breaks
7. **Update documentation** if needed
8. **Submit a pull request**

## 📝 Development Guidelines

### Code Style

#### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful variable/function names
- Add JSDoc comments for public APIs

```typescript
/**
 * Creates a new project with validation
 * @param data - Project creation data
 * @param userId - ID of the user creating the project
 * @returns Promise resolving to created project
 */
async function createProject(data: CreateProjectDTO, userId: string): Promise<Project> {
  // Implementation
}
```

#### React Components
- Use functional components with hooks
- Follow component composition patterns
- Implement proper error boundaries
- Use TypeScript interfaces for props

```tsx
interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  // Implementation
};
```

### Testing Guidelines

#### Unit Tests
- Write tests for all business logic
- Aim for 80%+ code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      // Arrange
      const userData = { name: 'John', email: 'john@example.com', password: 'secret' };
      
      // Act
      const user = await userService.createUser(userData);
      
      // Assert
      expect(user.password).not.toBe('secret');
      expect(user.email).toBe('john@example.com');
    });
  });
});
```

#### Integration Tests
- Test API endpoints end-to-end
- Use test database
- Clean up after each test

### Git Guidelines

#### Commit Messages
Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add password reset functionality
fix(api): resolve user deletion cascade issue
docs(readme): update installation instructions
test(user): add unit tests for user service
```

#### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Pull Request Guidelines

#### Before Submitting
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventions

#### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
```

## 🏗️ Architecture Guidelines

### Backend (MVC Pattern)
```
backend/src/
├── app/                    # Application layer
│   ├── controllers/        # HTTP request handlers
│   ├── services/          # Business logic
│   ├── repositories/      # Data access
│   ├── models/           # Database models
│   └── dto/              # Data transfer objects
├── core/                  # Core framework
│   ├── base/             # Abstract classes
│   ├── interfaces/       # Core interfaces
│   ├── middleware/       # Express middleware
│   └── utils/           # Utility functions
└── infrastructure/       # Infrastructure layer
    ├── database/        # Database config
    └── routes/         # Route definitions
```

### Frontend (Component-Based)
```
frontend/src/
├── components/           # Reusable components
│   ├── ui/              # Base UI components
│   ├── layout/          # Layout components
│   └── features/        # Feature components
├── pages/               # Page components
├── hooks/               # Custom hooks
├── services/            # API services
├── stores/              # State management
└── types/               # TypeScript types
```

## 📚 Documentation Standards

### Code Documentation
- Add JSDoc comments for public APIs
- Include examples in documentation
- Document complex algorithms
- Keep README files updated

### API Documentation
- Use OpenAPI/Swagger specifications
- Include request/response examples
- Document error codes
- Provide authentication details

## 🧪 Testing Standards

### Coverage Requirements
- **Unit Tests**: 80% minimum coverage
- **Integration Tests**: All API endpoints
- **E2E Tests**: Critical user journeys

### Test Organization
```
tests/
├── unit/               # Unit tests
├── integration/        # Integration tests
├── e2e/               # End-to-end tests
├── fixtures/          # Test data
└── utils/             # Test utilities
```

## 🚀 Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Git tag created
- [ ] Release notes written

## 🆘 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: team@synergysphere.com

### Resources
- [Development Setup Guide](docs/development.md)
- [API Documentation](docs/api.md)
- [Architecture Overview](docs/architecture.md)
- [Troubleshooting Guide](docs/troubleshooting.md)

## 🎉 Recognition

Contributors will be:
- Added to the [Contributors](CONTRIBUTORS.md) file
- Mentioned in release notes
- Invited to our contributors Discord

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to SynergySphere! 🚀
