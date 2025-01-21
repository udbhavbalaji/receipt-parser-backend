import type { Knex } from "knex";
import { paths } from "./constants/index";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      // filename: "./data/receipts.db",
      filename: paths.knexDB,
    },
    useNullAsDefault: true,
    migrations: {
      extension: "ts",
      // directory: "./data/migrations",
      directory: paths.knexMigrations,
    },
  },
};

export default config;
