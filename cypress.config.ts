import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { defineConfig } from "cypress";
import { Client } from "pg";
dotenv.config({ override: true });

export default defineConfig({
  projectId: "daoxcx",
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    // CYPRESS_BASE_URL (e.g. in .env) overrides the published site, for running against the local app.
    baseUrl: process.env.CYPRESS_BASE_URL ?? 'https://playground.serverapp.com.br',
    scrollBehavior: 'center',
    setupNodeEvents(on, config) {
      on("task", {
        // Runs a SQL query straight against the app database (fast test setup/cleanup).
        // CYPRESS_DATABASE_URL lets the tests target a different database than the one
        // Prisma uses locally (e.g. an SSH tunnel to the published app's database).
        async "db:query"({ sql, params = [] }: { sql: string; params?: unknown[] }) {
          const databaseUrl = process.env.CYPRESS_DATABASE_URL ?? process.env.DATABASE_URL;
          const client = new Client({
            connectionString: databaseUrl?.replace(/\?schema=.*$/, ""),
          });
          await client.connect();
          try {
            const result = await client.query(sql, params);
            return result.rows;
          } finally {
            await client.end();
          }
        },
        hashPassword(password: string) {
          return bcrypt.hash(password, 10);
        },
      });
    },
  },
});
