# Department Management API

A robust API built with NestJS, GraphQL, TypeORM, and PostgreSQL for managing departments and sub-departments.

## Features

- JWT Authentication with Role-based Access
- GraphQL API with Pagination
- Department and Sub-department Management
- Rate Limiting & CORS Protection
- Input Validation & Error Handling
- Docker Support
- TypeScript Support
- User-based Access Control

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or Docker

## Installation

### Using Docker (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/Barnyvic/managing-departments.git
cd managing-departments
```

2. Start the application with Docker Compose:

```bash
docker-compose up --build
```

The API will be available at `http://localhost:3000/graphql`

### Manual Setup

1. Clone and install dependencies:

```bash
git clone https://github.com/Barnyvic/managing-departments.git
cd managing-departments
npm install
```

2. Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=department_management

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1d

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# CORS
CORS_ORIGIN=*
```

3. Run database migrations:

```bash
npm run migration:run
```

4. Start the development server:

```bash
npm run start:dev
```

## API Documentation

### Authentication

1. Register a new user:

```graphql
mutation Register {
  register(input: { username: "admin", password: "password123" }) {
    id
    username
    createdAt
  }
}
```

2. Login to get a JWT token:

```graphql
mutation Login {
  login(input: { username: "admin", password: "password123" }) {
    access_token
  }
}
```

### Department Operations

1. Create a department with subdepartments:

```graphql
mutation CreateDepartment {
  createDepartment(
    input: {
      name: "Engineering"
      subDepartments: [
        { name: "Frontend" }
        { name: "Backend" }
        { name: "DevOps" }
      ]
    }
  ) {
    id
    name
    subDepartments {
      id
      name
    }
    createdAt
  }
}
```

2. Get departments (paginated):

```graphql
query GetDepartments {
  getDepartments(pagination: { page: 1, limit: 10 }) {
    departments {
      id
      name
      subDepartments {
        id
        name
      }
      createdBy {
        username
      }
    }
    total
    totalPages
    currentPage
  }
}
```

### Subdepartment Operations

1. Create a subdepartment:

```graphql
mutation CreateSubDepartment {
  createSubDepartment(
    departmentId: "1"
    input: { name: "Mobile Development" }
  ) {
    id
    name
    department {
      id
      name
    }
  }
}
```

2. Get subdepartments (paginated):

```graphql
query GetSubDepartments {
  getSubDepartments(pagination: { page: 1, limit: 10 }, departmentId: "1") {
    subDepartments {
      id
      name
      department {
        name
      }
    }
    total
    totalPages
    currentPage
  }
}
```

## Development

- Generate migration: `npm run migration:generate -- src/migrations/MigrationName`
- Run migrations: `npm run migration:run`
- Format code: `npm run format`
- Lint code: `npm run lint`
- Run tests: `npm run test`

## Docker Commands

- Build and start services: `docker-compose up --build`
- Start services in background: `docker-compose up -d`
- Stop services: `docker-compose down`
- View logs: `docker-compose logs -f`
- Access PostgreSQL: `docker-compose exec db psql -U postgres -d department_management`

## Production Deployment

1. Build the application:

```bash
npm run build
```

2. Start in production mode:

```bash
npm run start:prod
```

### Using Docker in Production

1. Build the production image:

```bash
docker build -t department-management-api .
```

2. Run with production environment:

```bash
docker run -p 3000:3000 --env-file .env.production department-management-api
```

## Security Features

- JWT-based authentication
- Rate limiting protection
- CORS configuration
- Password hashing
- Input validation
- SQL injection protection
- User-based access control

## Error Handling

The API provides detailed error messages with appropriate HTTP status codes:

```json
{
  "errors": [
    {
      "message": "Department with ID 999 not found",
      "extensions": {
        "code": "NOT_FOUND",
        "response": {
          "message": "Department with ID 999 not found",
          "error": "NOT_FOUND",
          "statusCode": 404
        }
      }
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

ISC

## Author

[Barnyvic](https://github.com/Barnyvic)
