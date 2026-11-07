import { test, expect } from '../fixtures.js';
import { moneyToCents, products } from '../../test-data/demo.js';

test.describe('Catálogo y ordenación', () => {
  test.beforeEach(async ({ authenticated }) => {
    void authenticated;
  });

  test('INV-01 @smoke los seis productos tienen nombre, precio y acción', async ({ inventory }) => {
    await expect(inventory.items).toHaveCount(6);
    for (const item of await inventory.items.all()) {
      await expect(item.getByTestId('inventory-item-name')).not.toBeEmpty();
      await expect(item.getByTestId('inventory-item-price')).toHaveText(/^\$\d+\.\d{2}$/);
      await expect(item.getByRole('button', { name: 'Add to cart', exact: true })).toBeVisible();
    }
  });

  for (const scenario of [
    { id: 'INV-02', option: 'az', descending: false },
    { id: 'INV-03', option: 'za', descending: true },
  ] as const) {
    test(`${scenario.id} ordena por nombre ${scenario.option}`, async ({ inventory }) => {
      const original = await inventory.names.allTextContents();
      const expected = [...original].sort((a, b) => a.localeCompare(b));
      if (scenario.descending) expected.reverse();
      await inventory.sort(scenario.option);
      await expect(inventory.names).toHaveText(expected);
    });
  }

  for (const scenario of [
    { id: 'INV-04', option: 'lohi', descending: false },
    { id: 'INV-05', option: 'hilo', descending: true },
  ] as const) {
    test(`${scenario.id} ordena los precios ${scenario.option}`, async ({ inventory }) => {
      const original = (await inventory.prices.allTextContents()).map(moneyToCents);
      const expected = [...original].sort((a, b) => (scenario.descending ? b - a : a - b));
      await inventory.sort(scenario.option);
      await expect
        .poll(async () => (await inventory.prices.allTextContents()).map(moneyToCents))
        .toEqual(expected);
    });
  }

  test('INV-06 el detalle conserva nombre y precio del producto', async ({ page, inventory }) => {
    await inventory.openProduct(products.backpack.name);
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(page.getByTestId('inventory-item-name')).toHaveCount(1);
    await expect(page.getByTestId('inventory-item-name')).toHaveText(products.backpack.name);
    await expect(page.getByTestId('inventory-item-price')).toHaveText(products.backpack.price);
  });
});
