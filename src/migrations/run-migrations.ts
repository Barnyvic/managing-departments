import { DataSource } from "typeorm";
import { config } from "dotenv";
import { ConfigService } from "@nestjs/config";

config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: "postgres",
  host: configService.get("database.host"),
  port: configService.get("database.port"),
  username: configService.get("database.username"),
  password: configService.get("database.password"),
  database: configService.get("database.database"),
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/*{.ts,.js}"],
  migrationsTableName: "migrations",
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    return AppDataSource.runMigrations();
  })
  .then(() => {
    console.log("Migrations have been executed successfully!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
