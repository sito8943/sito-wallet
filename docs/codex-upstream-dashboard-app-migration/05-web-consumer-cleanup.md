# 05. Limpieza en `sito-wallet/web` tras publicar `dashboard-app`

## Objetivo
Eliminar forks locales una vez que la versión nueva de `@sito/dashboard-app` ya tenga los 4 casos absorbidos.

## Pasos literales
1. Subir versión en `package.json` de `@sito/dashboard-app`.
2. Cambiar imports para usar solo `@sito/dashboard-app`:
3. `ImportDialog` y `useImportDialog` en `Currencies` deben venir del paquete, no de `src/components` ni de `src/hooks`.
4. `PrettyGrid` debe venir del paquete, no de `src/components/PrettyGrid`.
5. Borrar forks locales:
6. `src/components/PrettyGrid/PrettyGrid.tsx`
7. `src/components/PrettyGrid/types.ts`
8. `src/components/PrettyGrid/styles.css`
9. `src/components/PrettyGrid/index.ts`
10. `src/hooks/useImportDialog.tsx`
11. `src/components/Dialog/ImportDialog.tsx`
12. `src/components/Dialog/ImportDialog/Error.tsx`
13. `src/components/Dialog/ImportDialog/Loading.tsx`
14. `src/components/Dialog/ImportDialog/Preview.tsx`
15. `src/components/Buttons/styles.css` si sigue sin uso.
16. Limpiar exports muertos:
17. `src/hooks/index.ts` quitar `export * from "./useImportDialog";`.
18. `src/components/index.ts` quitar export de `PrettyGrid` si ya no existe.
19. Ajustar tests que apunten a forks borrados.

## Validación obligatoria
1. `npm run lint`
2. `npm run build`
3. `npm run test`
4. Verificación manual en `Transactions`, `Accounts`, `Currencies`, `TransactionCategories`.

## Resultado esperado
1. El repo consumidor deja de mantener duplicados de `dashboard-app`.
2. El mantenimiento de esos componentes queda centralizado en upstream.
