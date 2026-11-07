import { defineConfig, devices } from '@playwright/test';
import regression from './playwright.config.js';

export default defineConfig({
  ...regression,
  outputDir: 'test-results/firefox',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report/firefox', open: 'never' }],
    ['json', { outputFile: 'test-results/firefox/results.json' }],
  ],
  projects: [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }],
});
