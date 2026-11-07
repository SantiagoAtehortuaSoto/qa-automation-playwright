# Plan de pruebas

## Objetivo y entorno

Comprobar los recorridos principales de la tienda pública SauceDemo desde la
perspectiva de un usuario, con datos ficticios y comprobaciones reproducibles.
URL fija: `https://www.saucedemo.com/`. La suite no admite apuntar accidentalmente
a una tienda real mediante una variable de entorno.

Se automatiza la interfaz con Playwright y TypeScript. La regresión usa
`standard_user`; los rechazos usan la cuenta bloqueada publicada en la demo.
`problem_user` se reserva para una reproducción de defecto separada.

## Criterios utilizados

No existe una especificación comercial acordada con Sauce Labs para este
portafolio. Los resultados esperados se basan en el comportamiento público de la
demo, sus etiquetas y reglas de consistencia explícitas: orden ascendente y
descendente, identidad de productos, campos obligatorios y suma de importes.
La matriz documenta estas expectativas y permite revisarlas si cambia el sitio.

## Prioridad

| Prioridad | Criterio                                                                 | Ejemplos                                          |
| --------- | ------------------------------------------------------------------------ | ------------------------------------------------- |
| Alta      | Impide acceder o completar el recorrido principal, o afecta los importes | Acceso, carrito, formulario, total y confirmación |
| Media     | Afecta navegación, comparación o presentación de productos               | Ordenación y detalle                              |

La selección smoke incluye acceso, disponibilidad del catálogo, adición al carrito
y compra completa. La regresión amplía los escenarios negativos y de persistencia.

## Diseño y aislamiento

- Un contexto limpio por caso; sin datos de sesión compartidos ni orden requerido.
- Preparación de acceso centralizada en una fixture, con verificación del catálogo.
- Localizadores `data-test` y roles; sin coordenadas ni XPath frágil.
- Aserciones que esperan estados visibles; la URL por sí sola no confirma que la
  nueva pantalla haya terminado de renderizar.
- Importes comparados en centavos enteros. El impuesto se toma de la pantalla;
  no se asume una tasa fiscal sin especificación.
- Datos nominales de la demo y cliente ficticio `QA Demo`, código `00000`.

## Entrada, salida y diagnóstico

Entrada: dependencias fijadas instaladas, navegadores disponibles y acceso a la demo.
Salida de regresión: TypeScript y formato correctos, sin pruebas fallidas,
omitidas o inestables en los perfiles ejecutados. Un error al iniciar el navegador
es un problema de infraestructura y no un defecto funcional del sitio.

CI admite un reintento para reunir evidencia de intermitencias, pero falla si una
prueba resulta inestable. Las trazas y capturas se conservan para diagnosticar.
El informe de defecto independiente debe fallar por la comparación de precios;
un error de acceso, red o arranque no demuestra BUG-001.

## Exclusiones y riesgos

No cubre dispositivos físicos, pagos reales, API, rendimiento, accesibilidad
integral ni seguridad. La sesión protegida de esta demo no se presenta como una
auditoría de autenticación. No se realizan pruebas de carga ni envíos de mensajes.

El catálogo y la disponibilidad dependen de un tercero. La cifra de seis productos
y los precios de la muestra son una referencia explícita: un cambio de datos exige
revisar la expectativa, no alterar la aserción sin analizar la causa.
