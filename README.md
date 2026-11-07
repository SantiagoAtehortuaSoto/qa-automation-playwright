# QA Automation · Playwright + TypeScript

[![QA · Playwright](https://github.com/SantiagoAtehortuaSoto/qa-automation-playwright/actions/workflows/qa.yml/badge.svg)](https://github.com/SantiagoAtehortuaSoto/qa-automation-playwright/actions/workflows/qa.yml)

**Un portafolio de pruebas funcionales, desde los riesgos hasta la evidencia.**

Proyecto personal de [Santiago Atehortua Soto](https://www.linkedin.com/in/santiago-atehortua-soto-baa56a308/)
sobre [SauceDemo](https://www.saucedemo.com/), la tienda de práctica de Sauce Labs.
El código de este repositorio es la automatización de pruebas; el aplicativo bajo
prueba pertenece a Sauce Labs.

## Qué puedes revisar

- **23 casos independientes** de acceso, catálogo, carrito y compra ficticia.
- Tres perfiles: Chromium de escritorio, Firefox y móvil emulado con Chromium.
- Código TypeScript con Page Objects, fixtures y datos de prueba separados.
- Pruebas positivas, negativas, persistencia de carrito y consistencia de importes.
- Una reproducción automatizada de un defecto observable, con informe separado.
- GitHub Actions, informe HTML, resultados JSON/JUnit y trazas de fallos.

**[Casos y prioridades](docs/test-cases.md)** ·
**[Plan de pruebas](docs/test-plan.md)** ·
**[Defecto documentado](docs/bug-report.md)** ·
**[Resultados](docs/results.md)**

## Qué valida

| Área            | Casos | Riesgo principal                                                     |
| --------------- | ----: | -------------------------------------------------------------------- |
| Acceso y sesión |     6 | Acceso incorrecto o validaciones incompletas                         |
| Catálogo        |     6 | Ordenación y detalle inconsistentes                                  |
| Carrito         |     5 | Pérdida, duplicación o eliminación incorrecta de productos           |
| Compra ficticia |     6 | Formularios incompletos, importes incoherentes o carrito sin limpiar |

Son **23 casos**, ejecutados en tres perfiles: **69 ejecuciones configuradas**.
Cuatro casos llevan la etiqueta `@smoke`, para comprobar rápidamente el recorrido
principal. El estado ejecutado se consulta en [resultados](docs/results.md) y en
el historial de Actions; una configuración de navegador no equivale a una prueba superada.

## Ejecutarlo

Requiere Node.js 24 e Internet. Desde la carpeta del proyecto:

```sh
npm ci
npx playwright install chromium firefox
npm test
npm run report
```

En Windows, si PowerShell restringe los lanzadores, utilizar `npm.cmd` y `npx.cmd`.
En Linux pueden instalarse las dependencias del sistema con
`npx playwright install --with-deps chromium firefox`.

Para una demostración breve:

```sh
npm run test:smoke -- --project=chromium
npm run test:headed
npm run test:ui
```

Para comprobar el código y ejecutar un perfil concreto:

```sh
npm run typecheck
npm run format:check
npm run test:chromium
npm test -- --project=firefox
npm test -- --project=mobile-chromium
```

## Reproducir un defecto

```sh
npm run test:known-defect
npx playwright show-report playwright-report/known-defect
```

Este comando se ejecuta aparte y **debe fallar mientras BUG-001 siga presente**:
`problem_user` no ordena por precio ascendente. Se conserva la aserción correcta;
no se transforma el error en una prueba aprobada ni se marca con `test.fail()`.
La regresión principal utiliza `standard_user` y no incluye esa cuenta problemática.
Ver los pasos, los valores observados y la evidencia en [BUG-001](docs/bug-report.md).

## Organización

```text
pages/                Acciones y localizadores por pantalla
test-data/            Cuentas públicas de práctica y datos ficticios
tests/fixtures.ts     Preparación de sesión aislada para cada prueba
tests/e2e/            Regresión y smoke
tests/known-defects/  Reproducción independiente de BUG-001
scripts/              Resumen de resultados sin rutas privadas
docs/                 Plan, casos, defecto y evidencia
.github/workflows/    Ejecución automatizada con permisos de solo lectura
```

Las aserciones permanecen en las pruebas. Los Page Objects centralizan acciones
y localizadores. Cada caso recibe un contexto de navegador nuevo; no necesita que
otro caso se ejecute antes. Se utilizan `data-test`, roles y esperas de estado, sin
pausas fijas con `waitForTimeout` ni XPath dependiente de la estructura visual.

## Informes y diagnóstico

`npm test` genera `playwright-report/`, JSON y JUnit. Ante un fallo se conservan
captura, vídeo y traza; el informe HTML permite inspeccionar los pasos. En Actions
se descargan desde el artefacto `playwright-report-<número>` durante 14 días.

```sh
npm run evidence
npx playwright show-trace ruta/al/trace.zip
```

El resumen elimina rutas locales y registros brutos. El flujo de CI comprueba
TypeScript y formato antes de probar, limita la duración, usa un trabajador y
rechaza pruebas inestables aunque pasen en el reintento. Sus dependencias y las
acciones están fijadas por versión o commit.

## Alcance profesional

Este proyecto muestra diseño de casos, priorización de riesgos, automatización UI,
análisis de resultados y reporte de defectos. La emulación móvil no equivale a una
prueba en un teléfono físico. La comprobación de importes valida subtotal y suma
del impuesto mostrado; no certifica reglas fiscales ni una tasa tributaria.

La tienda es externa y puede cambiar o no estar disponible. Esta entrega no
presenta pruebas de carga, seguridad o API como si estuvieran implementadas.
Las cuentas son las publicadas por SauceDemo y los datos de compra son ficticios;
no se utilizan cuentas personales, pagos ni información de clientes.

Ver [seguridad y uso](SECURITY.md). Código de portafolio, sin licencia de
redistribución concedida. Sin afiliación con Sauce Labs.

## Referencias

- [Ejemplos oficiales de acceso a SauceDemo](https://docs.saucelabs.com/web-apps/automated-testing/selenium/sample-scripts/).
- [Buenas prácticas de Playwright](https://playwright.dev/docs/best-practices).
- [Playwright en CI](https://playwright.dev/docs/ci) y [Trace Viewer](https://playwright.dev/docs/trace-viewer).
