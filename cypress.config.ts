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
    baseUrl: 'https://playground.serverapp.com.br',
    scrollBehavior: 'center',
    setupNodeEvents(on, config) {
      on("task", {
        // Runs a SQL query straight against the app database (fast test setup/cleanup).
        async "db:query"({ sql, params = [] }: { sql: string; params?: unknown[] }) {
          const client = new Client({
            connectionString: process.env.DATABASE_URL?.replace(/\?schema=.*$/, ""),
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
