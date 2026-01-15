import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing
 * Per constitution principle III (Mobile-First):
 * - Test on mobile viewports first (320px, 375px)
 * - Then tablet and desktop breakpoints
 * - Includes accessibility testing with axe-core
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'Mobile Chrome (320px)',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 320, height: 568 },
      },
    },
    {
      name: 'Mobile Chrome (375px)',
      use: {
        ...devices['iPhone 12'],
        viewport: { width: 375, height: 667 },
      },
    },
    {
      name: 'Tablet (768px)',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'Desktop (1024px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 },
      },
    },
    {
      name: 'Desktop Large (1280px)',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
