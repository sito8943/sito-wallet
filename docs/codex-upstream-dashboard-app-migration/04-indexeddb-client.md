# 04. IndexedDBClient

## Contexto local a absorber
1. `sito-wallet/web/src/lib/api/offline/IndexedDBClient.ts`
2. `sito-wallet/web/src/lib/api/offline/__tests__/IndexedDBClient.test.ts`
3. Problema conocido: en `dashboard-app` la firma actual de `update` usa `(id, value)` y rompe consumidores que usan `BaseClient.update(value)`.

## Instrucción literal para `@sito/dashboard-app`
1. **No crear** nuevo cliente offline.
2. Actualiza el `IndexedDBClient` existente en `@sito/dashboard-app`.
3. Alinea su contrato con `BaseClient.update(value)`.

## Cambios exactos
1. `update` debe aceptar `value` como contrato principal.
2. Mantener backward compatibility temporal aceptando también `(id, value)` para no romper integraciones viejas.
3. Implementar resolución de argumentos dentro de `update`:
4. si recibe `(value)` usar ese objeto.
5. si recibe `(id, value)` usar `value`.
6. `put` siempre con objeto que incluye `id`.
7. Mejorar filtrado con helper de equivalencia:
8. para `deletedAt` con filtro booleano:
9. `true` => registros con `deletedAt` no nulo/no undefined.
10. `false` => registros con `deletedAt` nulo/undefined.
11. para el resto de campos, igualdad estricta.
12. Mejorar ciclo de vida de conexión:
13. agregar `close()` seguro.
14. en `open()`, registrar `db.onversionchange` para cerrar conexión.

## Compatibilidad obligatoria
1. `insert`, `insertMany`, `get`, `export`, `import`, `softDelete`, `restore` deben mantener comportamiento actual.
2. No romper tipos genéricos públicos del cliente.

## Pruebas obligatorias
1. Test de `update(value)` exitoso.
2. Test de compatibilidad temporal `update(id, value)` exitoso.
3. Test de filtros `deletedAt=true/false` con comportamiento esperado.
4. Test de filtros no-`deletedAt` con igualdad estricta.

## Done de este caso
1. El contrato offline queda alineado con `BaseClient`.
2. Se elimina la necesidad del fork local de `IndexedDBClient` en `sito-wallet/web`.
