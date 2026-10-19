import { defineConfig, devices } from "@playwright/test";
import { E2E_SITE_URL } from "./tests/e2e/e2e-site";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;
const MOCK_RESEND_PORT = Number(process.env.MOCK_RESEND_PORT ?? 3199);
const MOCK_RESEND_URL = `http://127.0.0.1:${MOCK_RESEND_PORT}`;

/**
 * E2E tests build and run their own production build in .next-e2e, configured
 * like a live deployment (production domain set, quote form connected to a
 * mock Resend API), so the regular build in .next is never touched. The
 * not-yet-configured state (no domain) is covered by the unit tests.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // One production server serves every worker; more parallel browsers than this
  // overloads it (especially next to a running `next dev`) and causes timeouts
  // that say nothing about the site itself.
  workers: process.env.CI ? 2 : 4,
  expect: {
    // Pages hydrate within ~1s in isolation; allow headroom on a busy machine.
    timeout: 10_000,
  },
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      // Stand-in for the Resend API, so the quote form's real delivery path is
      // tested end to end without sending email.
      command: `node tests/e2e/mock-resend.mjs`,
      url: `${MOCK_RESEND_URL}/`,
      env: { MOCK_RESEND_PORT: String(MOCK_RESEND_PORT) },
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: `npm run build && npm run start -- --port ${PORT}`,
      url: baseURL,
      // Placeholder credentials and the loopback-only RESEND_API_URL send every
      // quote request to the mock above. Process variables take precedence over
      // .env.local, so real credentials there are never used by the tests.
      env: {
        NEXT_DIST_DIR: ".next-e2e",
        NEXT_PUBLIC_SITE_URL: E2E_SITE_URL,
        RESEND_API_KEY: "e2e-placeholder-key",
        QUOTE_TO_EMAIL: "quotes@example.test",
        QUOTE_FROM_EMAIL: "WideCode <noreply@example.test>",
        RESEND_API_URL: `${MOCK_RESEND_URL}/emails`,
        QUOTE_DELIVERY: "resend",
      },
      reuseExistingServer: !process.env.CI,
      // Includes the production build.
      timeout: 300_000,
    },
  ],
});
