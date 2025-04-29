# Department Management API

A GraphQL-based API for managing departments, built with NestJS, TypeORM, and PostgreSQL.

## Live Demo

The API is deployed and available at: [https://managing-departments.onrender.com/](https://managing-departments.onrender.com/)

## Features

- GraphQL API with Apollo Server
- JWT-based authentication
- PostgreSQL database with TypeORM
- Rate limiting and security headers
- Comprehensive error handling
- Query complexity analysis
- Department and Sub-department management
- Pagination support
- Ownership-based access control

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

#### Update Department

```graphql
mutation UpdateDepartment($id: Int!, $input: UpdateDepartmentInput!) {
  updateDepartment(id: $id, input: $input) {
    id
    name
    description
    updatedAt
  }
}
```

#### Delete Department

```graphql
mutation DeleteDepartment($id: Int!) {
  removeDepartment(id: $id) {
    id
    name
  }
}
```

#### Get Departments

```graphql
query GetDepartments($paginationInput: PaginationInput!) {
  getDepartments(paginationInput: $paginationInput) {
    items {
      id
      name
      description
      createdAt
    }
    total
    page
    limit
  }
}
```

### Sub-Departments

#### Create Sub-Department

```graphql
mutation CreateSubDepartment($departmentId: Int!, $input: SubDepartmentInput!) {
  createSubDepartment(departmentId: $departmentId, input: $input) {
    id
    name
    description
    createdAt
  }
}
```

#### Update Sub-Department

```graphql
mutation UpdateSubDepartment($id: Int!, $input: UpdateSubDepartmentInput!) {
  updateSubDepartment(id: $id, input: $input) {
    id
    name
    description
    updatedAt
  }
}
```

#### Delete Sub-Department

```graphql
mutation DeleteSubDepartment($id: Int!) {
  removeSubDepartment(id: $id) {
    id
    name
  }
}
```

#### Get Sub-Departments

```graphql
query GetSubDepartments(
  $paginationInput: PaginationInput!
  $departmentId: Int
) {
  getSubDepartments(
    paginationInput: $paginationInput
    departmentId: $departmentId
  ) {
    items {
      id
      name
      description
      createdAt
    }
    total
    page
    limit
  }
}
```

## Error Handling

The API uses standard HTTP status codes and provides detailed error messages:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Security Features

- JWT-based authentication
- Password hashing with Argon2
- Rate limiting
- CORS protection
- Helmet security headers
- CSRF protection
- SSL/TLS support

## Deployment

The API is deployed on Render.com with the following configuration:

- Node.js environment
- PostgreSQL database
- Automatic deployments from main branch
- SSL/TLS enabled
- Environment variables configured

## Development

### Running Tests

```bash
npm run test
npm run test:e2e
```

### Building for Production

```bash
npm run build
```

### Running in Production

```bash
npm run start:prod
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
