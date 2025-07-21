# ProjectMark CRM API

A robust Customer Relationship Management (CRM) API built with NestJS, featuring a clean architecture pattern with domain-driven design principles.

## 🏗️ Architecture Overview

This project follows a **Clean Architecture** pattern with **Domain-Driven Design (DDD)** principles, organized into distinct layers:

### Architecture Layers

```
src/
├── access/           # Presentation Layer (Controllers)
├── application/      # Application Layer (Use Cases)
├── domain/          # Domain Layer (Business Logic)
├── repository/      # Infrastructure Layer (Data Access)
├── models/          # Data Models
├── modules/         # Shared Modules (DTOs, Guards, etc.)
└── resources/       # Shared Resources (Services, Interceptors, etc.)
```

### Layer Responsibilities

1. **Access Layer** (`src/access/`)
   - Controllers handle HTTP requests/responses
   - Input validation and request routing
   - Authentication and authorization

2. **Application Layer** (`src/application/`)
   - Use cases and application services
   - Orchestrates domain objects
   - Handles business workflows

3. **Domain Layer** (`src/domain/`)
   - Core business logic and rules
   - Domain entities and value objects
   - Business invariants and constraints

4. **Repository Layer** (`src/repository/`)
   - Data access abstraction
   - Database operations
   - External service integrations

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Complete user CRUD operations with role management
- **Resource Management**: File and resource handling capabilities
- **Topic Management**: Content organization and categorization
- **Email Integration**: Email service for notifications
- **Database Migrations**: Sequelize-based migration system
- **API Documentation**: RESTful API endpoints
- **Testing**: Unit and E2E testing setup
- **Docker Support**: Containerized development environment

## 🛠️ Tech Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer with MailHog for development
- **Caching**: Redis
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **Validation**: Class-validator & Class-transformer

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose**
- **PostgreSQL** (if running locally without Docker)

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProjectMarkCRM
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   Edit `.env` file with your configuration:
   ```env
   # API Configuration
   API_PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=postgres
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=password
   DB_NAME=crm_db
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   
   # Email Configuration
   SMTP_HOST=mailhog
   SMTP_PORT=1025
   SMTP_USER=
   SMTP_PASS=
   ```

4. **Start the application with Docker**
   ```bash
   npm run start:docker
   ```
   or
   ```bash
   docker-compose up --build
   ```

5. **Run database migrations**
   ```bash
   npm run migrate:run
   ```

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL database**
   - Create a PostgreSQL database
   - Update the database configuration in `.env`

3. **Start Redis** (for caching)
   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:7
   
   # Or install Redis locally
   ```

4. **Start MailHog** (for email testing)
   ```bash
   docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog:latest
   ```

5. **Run database migrations**
   ```bash
   npm run migrate:run
   ```

6. **Start the development server**
   ```bash
   npm run start:dev
   ```

## 📊 Database Schema

The application includes the following main entities:

### Users
- **id**: Primary key
- **name**: User's full name
- **email**: Unique email address
- **role**: User role (admin, editor, viewer)
- **createdAt/updatedAt**: Timestamps

### Topics
- **id**: Primary key
- **name**: Topic name
- **description**: Topic description
- **createdAt/updatedAt**: Timestamps

### Resources
- **id**: Primary key
- **name**: Resource name
- **description**: Resource description
- **createdAt/updatedAt**: Timestamps

## 🔧 Available Scripts

### Development
```bash
npm run start:dev          # Start development server with hot reload
npm run start:debug        # Start with debug mode
npm run build              # Build the application
npm run start:prod         # Start production server
```

### Testing
```bash
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests
```

### Database
```bash
npm run migrate:run        # Run database migrations
npm run migrate:revert     # Revert last migration
npm run migrate:create     # Create new migration
npm run seed:run           # Run database seeds
```

### Code Quality
```bash
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

## 🔐 Authentication

The API uses JWT-based authentication. To access protected endpoints:

1. **Create a user:**
    ```bash
    POST /api/user
    Content-Type: application/json

    {
        "name": "Jhon",
        role: "admin",
        "email": "user@example.com"
    }
    ```

2. **Login** to get a JWT token:
   ```bash
   POST /api/auth/login
   Content-Type: application/json
   
   {
     "email": "user@example.com"
   }
   ```

3. **Use the token** in subsequent requests:
   ```bash
   Authorization: Bearer <your-jwt-token>
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Topics
- `GET /api/topics` - List topics
- `POST /api/topics` - Create topic
- `GET /api/topics/:id` - Get topic by ID
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic

### Resources
- `GET /api/resources` - List resources
- `POST /api/resources` - Create resource
- `GET /api/resources/:id` - Get resource by ID
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Test Structure
- **Unit Tests**: Located alongside source files with `.spec.ts` extension
- **E2E Tests**: Located in `test/` directory
- **Test Helpers**: Located in `test/helpers/`

## 🐳 Docker Services

The application includes the following Docker services:

- **API**: NestJS application (port 3000)
- **PostgreSQL**: Database (port 5432)
- **Redis**: Caching layer (port 6379)
- **MailHog**: Email testing service (ports 1025, 8025)

## 📁 Project Structure

```
src/
├── access/                    # Presentation layer
│   └── controller/           # HTTP controllers
├── application/              # Application layer
│   ├── auth/                # Authentication use cases
│   ├── user/                # User use cases
│   ├── topic/               # Topic use cases
│   └── resource/            # Resource use cases
├── domain/                  # Domain layer
│   ├── user/                # User domain logic
│   ├── topic/               # Topic domain logic
│   └── resource/            # Resource domain logic
├── repository/              # Infrastructure layer
├── models/                  # Database models
├── modules/                 # Shared modules
│   ├── auth/                # Authentication modules
│   ├── user/                # User modules
│   ├── topic/               # Topic modules
│   └── resource/            # Resource modules
├── resources/               # Shared resources
│   ├── services/            # Shared services
│   ├── interceptors/        # HTTP interceptors
│   ├── filters/             # Exception filters
│   └── pipes/               # Validation pipes
├── config/                  # Configuration files
├── database/                # Database migrations
└── main.ts                  # Application entry point
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_PORT` | API server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `DB_NAME` | Database name | `crm_db` |
| `JWT_SECRET` | JWT secret key | Required |
| `SMTP_HOST` | SMTP server host | `mailhog` |
| `SMTP_PORT` | SMTP server port | `1025` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the development team

---

**Happy Coding! 🚀**
