// Cuentas de práctica publicadas en la propia pantalla de SauceDemo.
// No son credenciales personales ni de servicios de producción.
export const demoAccounts = {
  standard: 'standard_user',
  locked: 'locked_out_user',
  problem: 'problem_user',
  password: 'secret_sauce',
} as const;

export const products = {
  backpack: { name: 'Sauce Labs Backpack', price: '$29.99', cents: 2999 },
  bikeLight: { name: 'Sauce Labs Bike Light', price: '$9.99', cents: 999 },
} as const;

export const demoCustomer = { firstName: 'QA', lastName: 'Demo', postalCode: '00000' };

/** Oráculo de pruebas: trabajar en centavos evita comparar sumas binarias de importes. */
export function moneyToCents(text: string): number {
  const match = text.match(/\$(\d+)\.(\d{2})\b/);
  if (!match) throw new Error(`Formato monetario inesperado: ${text}`);
  return Number(match[1]) * 100 + Number(match[2]);
}
