import dataSource from "../config/data-source";
import { Logger } from "@nestjs/common";

async function runMigrations() {
  const logger = new Logger("MigrationRunner");

  try {
    logger.log("Initializing data source...");
    await dataSource.initialize();

    logger.log("Running migrations...");
    await dataSource.runMigrations();

    logger.log("Migrations completed successfully");
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    logger.error("Error during migration:", error);
    process.exit(1);
  }
}

runMigrations();
