import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export default new DataSource({
  type: "postgres",
  host: configService.get("database.host"),
  port: configService.get("database.port"),
  username: configService.get("database.username"),
  password: configService.get("database.password"),
  database: configService.get("database.database"),
  entities: ["src/**/*.entity{.ts,.js}"],
  migrations: ["src/migrations/*{.ts,.js}"],
  migrationsTableName: "migrations",
});
