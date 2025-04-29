import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";
import { join } from "path";

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: configService.get("DB_HOST") || "localhost",
  port: parseInt(configService.get("DB_PORT") || "5432", 10),
  username: configService.get("DB_USERNAME") || "postgres",
  password: configService.get("DB_PASSWORD") || "postgres",
  database: configService.get("DB_DATABASE") || "department_management",
  entities: [join(__dirname, "..", "**", "*.entity{.ts,.js}")],
  migrations: [join(__dirname, "..", "migrations", "*{.ts,.js}")],
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  migrationsTableName: "migrations",
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
