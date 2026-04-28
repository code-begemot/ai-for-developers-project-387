import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI ? [] : [
    {
      command: 'cd ../backend && ./venv/bin/python main.py',
      url: 'http://localhost:8000/event-types',
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: 'npm run build && npx vite preview --port 3000',
      url: 'http://localhost:3000',
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
