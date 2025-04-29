import { config } from "dotenv";
import { DataSource } from "typeorm";
import { dataSourceOptions } from "../config/data-source";

// Load environment variables
config();

const dataSource = new DataSource(dataSourceOptions);

dataSource
  .initialize()
  .then(async () => {
    console.log("Running migrations...");
    return dataSource.runMigrations();
  })
  .then(() => {
    console.log("Migrations completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during migration:", error);
    process.exit(1);
  });
