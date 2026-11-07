import { test, expect } from '../fixtures.js';
import { demoAccounts } from '../../test-data/demo.js';

test.describe('Acceso y sesión', () => {
  test.beforeEach(async ({ login }) => {
    await login.open();
  });

  test('AUTH-01 @smoke el usuario estándar accede al catálogo', async ({
    page,
    login,
    inventory,
  }) => {
    await login.signIn(demoAccounts.standard, demoAccounts.password);
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(inventory.title).toHaveText('Products');
  });

  test('AUTH-02 una contraseña incorrecta no concede acceso', async ({ page, login }) => {
    await login.signIn(demoAccounts.standard, 'incorrect-demo-password');
    await expect(login.error).toContainText('Username and password do not match');
    await expect(page).toHaveURL(/\/$/);
  });

  test('AUTH-03 el usuario bloqueado recibe el motivo del rechazo', async ({ login }) => {
    await login.signIn(demoAccounts.locked, demoAccounts.password);
    await expect(login.error).toContainText('this user has been locked out');
    await expect(login.submit).toBeVisible();
  });

  for (const scenario of [
    { id: 'AUTH-04', username: '', password: demoAccounts.password, error: 'Username is required' },
    { id: 'AUTH-05', username: demoAccounts.standard, password: '', error: 'Password is required' },
  ]) {
    test(`${scenario.id} valida el campo obligatorio: ${scenario.error}`, async ({ login }) => {
      await login.signIn(scenario.username, scenario.password);
      await expect(login.error).toContainText(scenario.error);
    });
  }

  test('AUTH-06 cerrar sesión impide volver al catálogo protegido', async ({
    page,
    login,
    inventory,
  }) => {
    await login.signIn(demoAccounts.standard, demoAccounts.password);
    await expect(inventory.title).toHaveText('Products');
    await inventory.logout();
    await expect(login.submit).toBeVisible();
    await page.goto('/inventory.html');
    await expect(login.error).toContainText('when you are logged in');
    await expect(login.submit).toBeVisible();
  });
});
