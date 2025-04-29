import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: configService.get("DB_HOST") || "localhost",
  port: parseInt(configService.get("DB_PORT"), 10) || 5432,
  username: configService.get("DB_USERNAME") || "postgres",
  password: configService.get("DB_PASSWORD") || "Yungvicky007",
  database: configService.get("DB_DATABASE") || "department_management",
  entities: ["src/**/*.entity{.ts,.js}"],
  migrations: ["src/migrations/*{.ts,.js}"],
  migrationsTableName: "migrations",
});
