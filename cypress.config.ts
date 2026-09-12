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
    baseUrl: 'http://localhost:3000',
    // The Navbar is `sticky top-0 z-30` (src/app/layout.tsx), so Cypress's
    // default `scrollBehavior: 'top'` scrolls targets right under it, and the
    // click lands on the navbar instead. Scrolling to center avoids that.
    scrollBehavior: 'center',
    setupNodeEvents(on, config) {},
  },
});
