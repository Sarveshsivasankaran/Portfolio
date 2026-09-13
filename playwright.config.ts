import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests/e2e', timeout: 30_000, workers: 1,
  use: { baseURL: 'http://127.0.0.1:4175', channel: 'chrome', headless: true, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4175 --strictPort', url: 'http://127.0.0.1:4175',
    env: { VITE_SUPABASE_URL: 'https://portfolio-test.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test_fixture' },
  },
})
