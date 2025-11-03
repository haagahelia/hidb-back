import type { Knex } from "knex";

const config: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.MARIADB_USER || "root",
    password: process.env.MARIADB_PASSWORD || "",
    database: process.env.MARIADB_DATABASE || "casedb",
  },
  pool: { min: 0, max: 7 },
  migrations: { tableName: "migrations" },
};

export default config;