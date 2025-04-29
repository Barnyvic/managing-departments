# Department Management API

A robust API built with NestJS, GraphQL, TypeORM, and PostgreSQL for managing departments and sub-departments.

## Features

- JWT Authentication
- GraphQL API with Pagination
- Department and Sub-department Management
- Input Validation
- Error Handling
- TypeScript Support
- User-based Access Control

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd managing-departments
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=department_management
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1h
```

4. Run database migrations:

```bash
npm run migration:run
```

5. Start the development server:

```bash
npm run start:dev
```

## API Usage

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

### Department Management

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

2. Get all departments (paginated):

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
    page
    limit
  }
}
```

3. Get all subdepartments (paginated):

```graphql
query GetSubDepartments {
  getSubDepartments(
    pagination: { page: 1, limit: 10 }
    departmentId: "1" # Optional: Filter by department
  ) {
    subDepartments {
      id
      name
      department {
        id
        name
      }
      createdAt
    }
    total
    totalPages
  }
}
```

4. Get a single department:

```graphql
query GetDepartment {
  getDepartment(id: "1") {
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
}
```

5. Update a department:

```graphql
mutation UpdateDepartment {
  updateDepartment(id: "1", input: { name: "Engineering & Technology" }) {
    id
    name
    updatedAt
  }
}
```

6. Delete a department:

```graphql
mutation DeleteDepartment {
  deleteDepartment(id: "1") {
    id
    name
  }
}
```

### Subdepartment Management

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

2. Update a subdepartment:

```graphql
mutation UpdateSubDepartment {
  updateSubDepartment(id: "1", input: { name: "Mobile & Web Development" }) {
    id
    name
    updatedAt
  }
}
```

3. Delete a subdepartment:

```graphql
mutation DeleteSubDepartment {
  deleteSubDepartment(id: "1") {
    id
    name
  }
}
```

## Error Handling

The API provides detailed error messages for various scenarios:

- Authentication errors
- Not found errors
- Permission errors
- Validation errors
- Duplicate name errors

Example error response:

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

## Development

- Generate migration: `npm run migration:generate -- src/migrations/MigrationName`
- Run migrations: `npm run migration:run`
- Revert migration: `npm run migration:revert`
- Format code: `npm run format`
- Lint code: `npm run lint`
- Run tests: `npm run test`

## Production

1. Build the application:

```bash
npm run build
```

2. Start in production mode:

```bash
npm run start:prod
```

## Security Notes

1. Always use environment variables for sensitive data
2. JWT tokens are required for all operations except login/register
3. Users can only manage their own departments and subdepartments
4. Password validation requires minimum 6 characters
5. All database queries are protected against SQL injection

## License

ISC
