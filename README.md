# Department Management API

A robust API built with NestJS, GraphQL, TypeORM, and PostgreSQL for managing departments and sub-departments.

## Features

- JWT Authentication
- GraphQL API
- Department and Sub-department Management
- Input Validation
- TypeScript Support

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

3. Set up PostgreSQL:
   - Create a database named `department_management`
   - Update the database configuration in `src/app.module.ts` if needed

4. Start the development server:
```bash
npm run start:dev
```

## API Usage

### Authentication

1. Login to get a JWT token:
```graphql
mutation {
  login(loginInput: {
    username: "admin",
    password: "admin"
  }) {
    access_token
  }
}
```

### Department Management

1. Create a department:
```graphql
mutation {
  createDepartment(createDepartmentInput: {
    name: "Engineering",
    subDepartments: [
      { name: "Frontend" },
      { name: "Backend" }
    ]
  }) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

2. Get all departments:
```graphql
query {
  departments {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

3. Get a single department:
```graphql
query {
  department(id: 1) {
    id
    name
    subDepartments {
      id
      name
    }
  }
}
```

## Development

- Run tests: `npm run test`
- Format code: `npm run format`
- Lint code: `npm run lint`

## Production

- Build the application: `npm run build`
- Start in production mode: `npm run start:prod`

## License

ISC 