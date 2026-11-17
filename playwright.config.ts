import { defineConfig, devices } from '@playwright/test';

const API_PORT = Number(process.env.API_PORT ?? 4000);
const WEB_PORT = Number(process.env.WEB_PORT ?? 5173);

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // tests share one in-memory mock server
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${WEB_PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node server/index.mjs',
      url: `http://localhost:${API_PORT}/api/health`,
      reuseExistingServer: !process.env.CI,
      env: { API_PORT: String(API_PORT) },
    },
    {
      command: `npx vite --port ${WEB_PORT} --strictPort`,
      url: `http://localhost:${WEB_PORT}`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
