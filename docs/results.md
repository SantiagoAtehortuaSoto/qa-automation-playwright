# Resultados ejecutados

Fecha de referencia: **7 de noviembre de 2026**.

## Ejecución local en Windows

| Perfil                 | Casos | Resultado                                                   |
| ---------------------- | ----: | ----------------------------------------------------------- |
| Chromium escritorio    |    23 | 23 correctos                                                |
| Chromium móvil emulado |    23 | 23 correctos                                                |
| Firefox                |    23 | No evaluados funcionalmente: error al arrancar el navegador |

La ejecución local produjo 46 resultados correctos, 23 errores de infraestructura,
cero omitidos y cero intermitentes. Firefox devolvió `browserType.launch: spawn UNKNOWN`
antes de interactuar con la aplicación. No se presenta como un defecto de SauceDemo
ni como 69 pruebas superadas.

Resumen por caso y perfil: [`evidence/local-execution.json`](evidence/local-execution.json).
El resumen excluye rutas privadas, cookies y registros brutos.

## GitHub Actions

El flujo configura los tres perfiles sobre Linux e instala sus dependencias.
El resultado se verifica después de publicar el repositorio y se enlaza aquí.
Consultar el [historial de ejecuciones](https://github.com/SantiagoAtehortuaSoto/qa-automation-playwright/actions/workflows/qa.yml).

## Defecto reproducido

La reproducción independiente BUG-001 se considera demostrada cuando falla la
aserción de ordenación y sus adjuntos contienen los precios observados. No se suma
a la cifra de pruebas de regresión. Ver [el informe](bug-report.md).

## Límites

Los resultados describen esta ejecución en una aplicación externa. No constituyen
una certificación de calidad global, seguridad o rendimiento, ni cubren dispositivos
móviles físicos. La disponibilidad y los datos de la demo pueden cambiar.
