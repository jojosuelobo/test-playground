import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://playground.serverapp.com.br',
    setupNodeEvents(on, config) {},
  },
});
