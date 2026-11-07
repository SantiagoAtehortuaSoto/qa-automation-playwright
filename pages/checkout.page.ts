import type { Page } from '@playwright/test';

export type Customer = { firstName: string; lastName: string; postalCode: string };

export class CheckoutPage {
  constructor(readonly page: Page) {}

  get title() {
    return this.page.getByTestId('title');
  }
  get error() {
    return this.page.getByTestId('error');
  }
  get subtotal() {
    return this.page.getByTestId('subtotal-label');
  }
  get tax() {
    return this.page.getByTestId('tax-label');
  }
  get total() {
    return this.page.getByTestId('total-label');
  }

  async fillCustomer(customer: Customer) {
    await this.page.getByTestId('firstName').fill(customer.firstName);
    await this.page.getByTestId('lastName').fill(customer.lastName);
    await this.page.getByTestId('postalCode').fill(customer.postalCode);
  }

  async continue() {
    await this.page.getByTestId('continue').click();
  }

  async cancel() {
    await this.page.getByTestId('cancel').click();
  }

  async finish() {
    await this.page.getByTestId('finish').click();
  }
}
