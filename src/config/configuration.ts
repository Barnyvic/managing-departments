import { registerAs } from "@nestjs/config";

const requiredEnvMessage = (key: string) =>
  `${key} environment variable is required`;

const validateConfig = () => {
  const required = [
    "DB_HOST",
    "DB_PORT",
    "DB_USERNAME",
    "DB_PASSWORD",
    "DB_DATABASE",
    "JWT_SECRET",
    "SESSION_SECRET",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(requiredEnvMessage(key));
    }
  }
};

export default registerAs("app", () => {
  // Validate required environment variables
  validateConfig();

  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    database: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION || "1h",
    },
    graphql: {
      playground: process.env.NODE_ENV !== "production",
      introspection: process.env.NODE_ENV !== "production",
    },
    session: {
      secret: process.env.SESSION_SECRET,
    },
    security: {
      bcryptSaltRounds: 12,
      cors: {
        origin: process.env.CORS_ORIGIN?.split(",") || [
          "http://localhost:3000",
        ],
        credentials: true,
      },
    },
  };
});
