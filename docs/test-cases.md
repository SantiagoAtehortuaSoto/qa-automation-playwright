# Matriz de casos y trazabilidad

Cada ID aparece también en el nombre de la prueba automatizada. Los 23 casos se
repiten por perfil; no se contabilizan como 69 requisitos distintos.

| ID      | Prioridad    | Escenario / acción                    | Resultado esperado                                                            | Archivo           |
| ------- | ------------ | ------------------------------------- | ----------------------------------------------------------------------------- | ----------------- |
| AUTH-01 | Alta · smoke | Acceder con usuario estándar          | Catálogo visible y ruta de inventario                                         | auth.spec.ts      |
| AUTH-02 | Alta         | Contraseña incorrecta                 | Mensaje de rechazo; permanece el acceso                                       | auth.spec.ts      |
| AUTH-03 | Alta         | Cuenta bloqueada                      | Motivo de bloqueo visible                                                     | auth.spec.ts      |
| AUTH-04 | Alta         | Usuario vacío                         | Error «Username is required»                                                  | auth.spec.ts      |
| AUTH-05 | Alta         | Contraseña vacía                      | Error «Password is required»                                                  | auth.spec.ts      |
| AUTH-06 | Alta         | Salir y abrir inventario directamente | El catálogo exige iniciar sesión                                              | auth.spec.ts      |
| INV-01  | Alta · smoke | Inspeccionar los seis productos       | Nombres, precios y acción presentes                                           | inventory.spec.ts |
| INV-02  | Media        | Ordenar A a Z                         | Nombres en orden ascendente                                                   | inventory.spec.ts |
| INV-03  | Media        | Ordenar Z a A                         | Nombres en orden descendente                                                  | inventory.spec.ts |
| INV-04  | Media        | Precio menor a mayor                  | Valores numéricos ascendentes                                                 | inventory.spec.ts |
| INV-05  | Media        | Precio mayor a menor                  | Valores numéricos descendentes                                                | inventory.spec.ts |
| INV-06  | Media        | Abrir el detalle de Backpack          | Mismo nombre y precio del producto                                            | inventory.spec.ts |
| CART-01 | Alta · smoke | Añadir Backpack                       | Un producto, cantidad 1 y precio correcto                                     | cart.spec.ts      |
| CART-02 | Alta         | Añadir dos y retirar Backpack         | Bike Light permanece; contador 1                                              | cart.spec.ts      |
| CART-03 | Alta         | Retirar el último producto            | Carrito vacío y contador ausente                                              | cart.spec.ts      |
| CART-04 | Alta         | Añadir y recargar catálogo            | Producto conservado en el carrito                                             | cart.spec.ts      |
| CART-05 | Alta         | Abrir carrito en sesión nueva         | Sin productos; permite continuar comprando                                    | cart.spec.ts      |
| CHK-01  | Alta         | Continuar sin nombre                  | No avanza; indica el campo obligatorio                                        | checkout.spec.ts  |
| CHK-02  | Alta         | Continuar sin apellido                | No avanza; indica el campo obligatorio                                        | checkout.spec.ts  |
| CHK-03  | Alta         | Continuar sin código postal           | No avanza; indica el campo obligatorio                                        | checkout.spec.ts  |
| CHK-04  | Alta         | Cancelar datos de compra              | Regresa al carrito con ambos productos                                        | checkout.spec.ts  |
| CHK-05  | Alta         | Revisar dos productos y total         | Identidad conservada; subtotal correcto; total = subtotal + impuesto mostrado | checkout.spec.ts  |
| CHK-06  | Alta · smoke | Finalizar compra ficticia             | Confirmación y carrito vacío                                                  | checkout.spec.ts  |

Los archivos viven en [`tests/e2e/`](../tests/e2e/). Cada prueba prepara sus propios
datos. Los casos de formulario rellenan los otros campos para aislar la validación
del campo que falta.

## Reproducción separada

`BUG-001` reutiliza el criterio de ordenación de INV-04 con `problem_user`. Está en
[`tests/known-defects/price-sorting.spec.ts`](../tests/known-defects/price-sorting.spec.ts)
y no integra los 23 casos de regresión. Ver el [informe de defecto](bug-report.md).
