import { test, expect } from '../fixtures.js';
import { demoCustomer, moneyToCents, products } from '../../test-data/demo.js';

test.describe('Compra ficticia', () => {
  test.beforeEach(async ({ authenticated, inventory, cart, checkout }) => {
    void authenticated;
    await inventory.add(products.backpack.name);
    await inventory.add(products.bikeLight.name);
    await inventory.openCart();
    await expect(cart.items).toHaveCount(2);
    await cart.checkout();
    await expect(checkout.title).toHaveText('Checkout: Your Information');
  });

  for (const scenario of [
    { id: 'CHK-01', customer: { ...demoCustomer, firstName: '' }, error: 'First Name is required' },
    { id: 'CHK-02', customer: { ...demoCustomer, lastName: '' }, error: 'Last Name is required' },
    {
      id: 'CHK-03',
      customer: { ...demoCustomer, postalCode: '' },
      error: 'Postal Code is required',
    },
  ]) {
    test(`${scenario.id} impide avanzar: ${scenario.error}`, async ({ checkout, page }) => {
      await checkout.fillCustomer(scenario.customer);
      await checkout.continue();
      await expect(checkout.error).toContainText(scenario.error);
      await expect(page).toHaveURL(/\/checkout-step-one\.html$/);
    });
  }

  test('CHK-04 cancelar la información de compra conserva el carrito', async ({
    checkout,
    cart,
  }) => {
    await checkout.cancel();
    await expect(cart.title).toHaveText('Your Cart');
    await expect(cart.items).toHaveCount(2);
    await expect(cart.badge).toHaveText('2');
  });

  test('CHK-05 el resumen conserva productos y cuadra el importe total', async ({
    page,
    checkout,
  }) => {
    await checkout.fillCustomer(demoCustomer);
    await checkout.continue();
    await expect(checkout.title).toHaveText('Checkout: Overview');
    await expect(page.getByTestId('inventory-item-name')).toHaveText([
      products.backpack.name,
      products.bikeLight.name,
    ]);
    const subtotal = moneyToCents(await checkout.subtotal.innerText());
    const tax = moneyToCents(await checkout.tax.innerText());
    const total = moneyToCents(await checkout.total.innerText());
    expect(subtotal).toBe(products.backpack.cents + products.bikeLight.cents);
    expect(tax).toBeGreaterThanOrEqual(0);
    expect(total).toBe(subtotal + tax);
  });

  test('CHK-06 @smoke completar la compra muestra confirmación y vacía el carrito', async ({
    page,
    checkout,
    cart,
  }) => {
    await checkout.fillCustomer(demoCustomer);
    await checkout.continue();
    await expect(checkout.title).toHaveText('Checkout: Overview');
    await checkout.finish();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
    await page.getByTestId('back-to-products').click();
    await expect(checkout.title).toHaveText('Products');
    await page.getByTestId('shopping-cart-link').click();
    await expect(cart.items).toHaveCount(0);
  });
});
