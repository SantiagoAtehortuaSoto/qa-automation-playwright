import { test, expect } from '../fixtures.js';
import { demoAccounts, moneyToCents } from '../../test-data/demo.js';

test('BUG-001 problem_user no ordena el catálogo por precio ascendente', async ({
  page,
  login,
  inventory,
}, testInfo) => {
  testInfo.annotations.push({
    type: 'defect',
    description: 'docs/bug-report.md; reproducción separada, fallo real esperado',
  });
  await login.open();
  await login.signIn(demoAccounts.problem, demoAccounts.password);
  await expect(inventory.title).toHaveText('Products');
  const before = (await inventory.prices.allTextContents()).map(moneyToCents);
  const expected = [...before].sort((a, b) => a - b);
  expect(before, 'El estado inicial debe permitir detectar una ordenación ineficaz').not.toEqual(
    expected,
  );
  page.on('dialog', async (dialog) => {
    await dialog.dismiss();
  });
  await inventory.sort('lohi');
  try {
    await expect
      .poll(async () => (await inventory.prices.allTextContents()).map(moneyToCents))
      .toEqual(expected);
  } finally {
    await testInfo.attach('estado-tras-ordenar', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });
    await testInfo.attach('precios', {
      body: JSON.stringify(
        { before, expected, actual: (await inventory.prices.allTextContents()).map(moneyToCents) },
        null,
        2,
      ),
      contentType: 'application/json',
    });
  }
});
