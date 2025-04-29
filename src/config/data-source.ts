import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";

// Load environment variables
config();

// Validate required environment variables
const required = [
  "DB_HOST",
  "DB_PORT",
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_DATABASE",
];
for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`${key} environment variable is required`);
  }
}

const isProd = process.env.NODE_ENV === "production";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: isProd ? ["dist/**/*.entity.js"] : ["src/**/*.entity{.ts,.js}"],
  migrations: isProd ? ["dist/migrations/*.js"] : ["src/migrations/*{.ts,.js}"],
  synchronize: false,
  ssl:
    isProd || process.env.DB_SSL === "true"
      ? {
          rejectUnauthorized: false,
        }
      : false,
  logging: !isProd,
  extra: isProd
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : undefined,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
