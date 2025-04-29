# Department Management API

A GraphQL-based API for managing departments, built with NestJS, TypeORM, and PostgreSQL.

## Features

- GraphQL API with Apollo Server
- JWT-based authentication
- PostgreSQL database with TypeORM
- Rate limiting and security headers
- Comprehensive error handling
- Query complexity analysis

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=department_management
DB_SSL=false

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1h

# Session Configuration
SESSION_SECRET=your_session_secret

# Application Configuration
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd department-management
```

2. Install dependencies:

```bash
npm install
```

3. Run migrations:

```bash
npm run migration:run
```

4. Start the development server:

```bash
npm run start:dev
```

## API Documentation

### Authentication

#### Login

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    access_token
  }
}
```

#### Register

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    username
    createdAt
    updatedAt
  }
}
```

### Departments

#### Create Department

```graphql
mutation CreateDepartment($input: CreateDepartmentInput!) {
  createDepartment(input: $input) {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

#### Get Departments

```graphql
query GetDepartments {
  departments {
    id
    name
    description
    createdAt
    updatedAt
  }
}
```

## Error Handling

The API uses standardized error responses with the following format:

```typescript
{
  "errors": [
    {
      "message": "Error message",
      "extensions": {
        "code": "ERROR_CODE",
        "statusCode": 400,
        "details": {
          // Additional error details
        }
      }
    }
  ]
}
```

Common error codes:

- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `BAD_REQUEST`: Invalid input
- `INTERNAL_SERVER_ERROR`: Server error

## Security Features

- Rate limiting (10 requests per minute)
- JWT authentication
- Password hashing with argon2
- CORS protection
- Security headers with helmet
- Query complexity analysis

## Development

### Running Tests

```bash
npm run test
```

### Running Migrations

```bash
# Create migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Production Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Run migrations:

```bash
npm run migration:run
```

3. Build the application:

```bash
npm run build
```

4. Start the production server:

```bash
npm run start:prod
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
