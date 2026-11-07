import { defineConfig, devices } from '@playwright/test';
import regression from './playwright.config.js';

export default defineConfig({
  ...regression,
  testDir: './tests/known-defects',
  workers: 1,
  retries: 0,
  outputDir: 'test-results/known-defect',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/known-defect', open: 'never' }],
    ['json', { outputFile: 'test-results/known-defect/results.json' }],
  ],
  projects: [{ name: 'defect-chromium', use: { ...devices['Desktop Chrome'] } }],
});
