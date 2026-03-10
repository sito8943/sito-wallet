# Evaluación: adición y actualización en modo offline

Fecha: 2026-03-09
Proyecto: `sito-wallet/web`

## Resumen ejecutivo

1. La **adición (CREATE) offline sí está implementada** para cuentas, monedas, categorías, transacciones, dashboard y perfil.
2. La **actualización (UPDATE) offline está parcialmente rota**: funciona en perfil y dashboard (métodos específicos), pero **falla** en cuentas, monedas, categorías y transacciones por una incompatibilidad de firma en `IndexedDBClient`.
3. Aunque CREATE offline funciona, hay limitaciones de sincronización (mapeo de IDs locales/servidor) que pueden romper ediciones posteriores de registros creados offline.

## Evidencia principal (Dashboard App + web)

1. En `@sito/dashboard-app`, `BaseClient.update` usa firma de un parámetro:
   - `src/lib/api/BaseClient.ts` -> `update(value: TUpdateDto)`.
2. En `@sito/dashboard-app`, `IndexedDBClient.update` usa firma de dos parámetros:
   - `src/lib/api/IndexedDBClient.ts` -> `update(_: number, value: TUpdateDto)`.
3. En `web`, los hooks de edición llaman `update(data)` con **un parámetro**:
   - `src/views/Accounts/hooks/useEditAccountDialog.tsx`
   - `src/views/Currencies/hooks/useEditCurrency.tsx`
   - `src/views/TransactionCategories/hooks/useEditTransactionCategoryDialog.tsx`
   - `src/views/Transactions/hooks/useEditTransaction.tsx`
4. Prueba rápida en la copia local de `dashboard-app`: `IndexedDBClient.update({id:1,...})` devuelve `DataError`, y `update(1,{id:1,...})` sí funciona.

## Qué sí se puede hacer hoy

1. Crear registros offline en:
   - `AccountIndexedDBClient.insert`
   - `CurrencyIndexedDBClient.insert`
   - `TransactionCategoryIndexedDBClient.insert`
   - `TransactionIndexedDBClient.insert`
   - `DashboardIndexedDBClient.insert`
   - `ProfileIndexedDBClient.insert`
2. Encolar operaciones de sync para CREATE/UPDATE/DELETE/RESTORE desde cada cliente offline.
3. Sincronizar automáticamente al recuperar conectividad (`OfflineSyncProvider` + `offlineSyncService`).

## Qué no se puede hacer hoy (o queda frágil)

1. Editar offline (UPDATE) en cuentas/monedas/categorías/transacciones usando el flujo actual de UI.
2. Confiar en reconciliación de IDs tras CREATE offline:
   - La cola usa `localEntityId` para compactar localmente, pero no hay mapeo explícito local->server en la respuesta de sync.
   - Esto puede romper updates/deletes posteriores sobre entidades creadas offline.
3. Asegurar que el registro offline conserve forma completa de DTO tras update:
   - `store.put(value)` guarda solo el payload de update y puede perder campos derivados (relaciones, timestamps, etc.).

## Qué habría que cambiar para dejarlo bien

1. **En dashboard-app (recomendado):** unificar firma de `IndexedDBClient.update` con `BaseClient.update`.
   - Opción A: `update(value: TUpdateDto)`.
   - Opción B: sobrecarga que acepte ambas (`update(value)` y `update(id, value)`) para compatibilidad retro.
2. **En web:** alinear offline clients y hooks al contrato unificado, evitando llamadas ambiguas.
3. **Sync de IDs:** definir estrategia de reconciliación tras CREATE offline.
   - O backend devuelve mapeo de IDs aplicados.
   - O se evita depender de IDs locales para operaciones posteriores sin reconciliar.
4. **Update local robusto:** hacer merge con registro existente antes de `put` para no perder campos no editables.

## Conclusión

Sí se puede soportar adición y actualización offline, pero con el estado actual solo la adición está consistentemente operativa. Para actualización offline real y estable, hace falta corregir el contrato `update` en `IndexedDBClient` y cerrar la reconciliación de IDs en sync.
