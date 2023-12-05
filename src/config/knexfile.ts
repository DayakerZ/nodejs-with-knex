import type { Knex } from "knex";
import * as dotenv from "dotenv";

dotenv.config();
// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: process.env.DB_CLIENT || "postgresql",
    connection: {
      database: process.env.DB_NAME || "user",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "secret",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};

export default config;
