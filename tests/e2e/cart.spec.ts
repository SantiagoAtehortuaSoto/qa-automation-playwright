import { test, expect } from '../fixtures.js';
import { products } from '../../test-data/demo.js';

test.describe('Carrito aislado por prueba', () => {
  test.beforeEach(async ({ authenticated }) => {
    void authenticated;
  });

  test('CART-01 @smoke añadir un producto conserva cantidad y precio', async ({
    inventory,
    cart,
  }) => {
    await inventory.add(products.backpack.name);
    await expect(inventory.badge).toHaveText('1');
    await inventory.openCart();
    await expect(cart.title).toHaveText('Your Cart');
    await expect(cart.items).toHaveCount(1);
    await expect(cart.item(products.backpack.name).getByTestId('item-quantity')).toHaveText('1');
    await expect(cart.item(products.backpack.name).getByTestId('inventory-item-price')).toHaveText(
      products.backpack.price,
    );
  });

  test('CART-02 quitar uno de dos productos conserva el otro', async ({ inventory, cart }) => {
    await inventory.add(products.backpack.name);
    await inventory.add(products.bikeLight.name);
    await expect(inventory.badge).toHaveText('2');
    await inventory.openCart();
    await cart.remove(products.backpack.name);
    await expect(cart.items).toHaveCount(1);
    await expect(cart.item(products.bikeLight.name)).toBeVisible();
    await expect(cart.badge).toHaveText('1');
  });

  test('CART-03 quitar el último producto elimina el contador', async ({ inventory, cart }) => {
    await inventory.add(products.backpack.name);
    await inventory.openCart();
    await cart.remove(products.backpack.name);
    await expect(cart.items).toHaveCount(0);
    await expect(cart.badge).toHaveCount(0);
  });

  test('CART-04 el carrito sobrevive a una recarga', async ({ page, inventory, cart }) => {
    await inventory.add(products.backpack.name);
    await page.reload();
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.badge).toHaveText('1');
    await inventory.openCart();
    await expect(cart.item(products.backpack.name)).toBeVisible();
    await expect(cart.items).toHaveCount(1);
  });

  test('CART-05 una sesión nueva empieza sin productos', async ({ inventory, cart }) => {
    await expect(inventory.badge).toHaveCount(0);
    await inventory.openCart();
    await expect(cart.title).toHaveText('Your Cart');
    await expect(cart.items).toHaveCount(0);
    await cart.continueShopping();
    await expect(inventory.title).toHaveText('Products');
  });
});
