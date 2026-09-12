import dotenv from "dotenv";
import { defineConfig } from "cypress";
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
    setupNodeEvents(on, config) {},
  },
});
