import fs from 'node:fs';
import path from 'node:path';

const source = process.argv[2] || 'test-results/results.json';
const destination = process.argv[3] || 'docs/evidence/latest-run.json';
const report = JSON.parse(fs.readFileSync(source, 'utf8'));
const cases = [];
function visit(suite) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const last = test.results.at(-1);
      const launchFailure = last?.error?.message?.includes('browserType.launch:');
      cases.push({
        id: spec.title.match(/^(AUTH|INV|CART|CHK)-\d+/)?.[0] || spec.title.split(' ')[0],
        project: test.projectName,
        result:
          test.status === 'expected'
            ? 'passed'
            : launchFailure
              ? 'infrastructure-error'
              : test.status,
        attempts: test.results.length,
        durationMs: Math.round(test.results.reduce((sum, result) => sum + result.duration, 0)),
      });
    }
  }
  for (const child of suite.suites || []) visit(child);
}
for (const suite of report.suites) visit(suite);
const summary = {
  generatedFrom: 'Playwright JSON reporter; sin rutas locales ni registros brutos',
  startedAt: report.stats.startTime,
  durationMs: Math.round(report.stats.duration),
  platform: process.platform,
  node: process.version,
  playwright: JSON.parse(fs.readFileSync('package-lock.json', 'utf8')).packages[
    'node_modules/@playwright/test'
  ].version,
  counts: {
    total: cases.length,
    passed: cases.filter((test) => test.result === 'passed').length,
    infrastructureErrors: cases.filter((test) => test.result === 'infrastructure-error').length,
    unexpected: cases.filter((test) => test.result === 'unexpected').length,
    flaky: report.stats.flaky,
    skipped: report.stats.skipped,
  },
  cases,
};
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary.counts));
