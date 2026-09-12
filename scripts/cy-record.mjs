// The Cypress CLI reads CYPRESS_RECORD_KEY straight from the process env before it
// ever loads cypress.config.ts, so a dotenv override inside that config runs too
// late to matter. This wrapper loads .env (overriding anything already exported in
// the shell, e.g. an old CYPRESS_RECORD_KEY in ~/.zshrc) and only then spawns
// Cypress, so the corrected value is already in place when the CLI starts.
import { spawnSync } from "node:child_process";
import dotenv from "dotenv";

dotenv.config({ override: true });

const result = spawnSync("npx", ["cypress", "run", "--record"], {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
