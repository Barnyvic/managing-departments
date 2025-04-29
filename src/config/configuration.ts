export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "department_management",
  },
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      "your-super-secret-key-change-this-in-production",
    expiresIn: process.env.JWT_EXPIRATION || "1h",
  },
  graphql: {
    playground: process.env.GRAPHQL_PLAYGROUND === "true",
    introspection: process.env.GRAPHQL_INTROSPECTION === "true",
  },
  session: {
    secret: process.env.SESSION_SECRET || "your-session-secret",
  },
});
