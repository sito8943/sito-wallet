# Codex Prompt Pack: actualizar `@sito/dashboard-app` (sin recrear)

Este documento ahora es índice. Las instrucciones operativas están separadas por caso.

## Regla principal (obligatoria)

1. **Actualizar, no recrear.**
2. No crear componentes/hooks/clientes nuevos si ya existen en `@sito/dashboard-app`.
3. Hacer cambios incrementales sobre implementación existente y conservar API pública salvo ampliaciones compatibles.

## Orden de lectura obligatorio

1. [00-scope-and-rules.md](./codex-upstream-dashboard-app-migration/00-scope-and-rules.md)
2. [01-icon-button-styles.md](./codex-upstream-dashboard-app-migration/01-icon-button-styles.md)
3. [02-import-dialog-and-hook.md](./codex-upstream-dashboard-app-migration/02-import-dialog-and-hook.md)
4. [03-pretty-grid.md](./codex-upstream-dashboard-app-migration/03-pretty-grid.md)
5. [04-indexeddb-client.md](./codex-upstream-dashboard-app-migration/04-indexeddb-client.md)
6. [05-web-consumer-cleanup.md](./codex-upstream-dashboard-app-migration/05-web-consumer-cleanup.md)

## Estado auditado en `sito-wallet/web` (fuente de verdad)

1. IconButton styles locales: `src/components/Buttons/styles.css` (archivo actualmente sin imports directos).
2. Fork local de ImportDialog: `src/components/Dialog/ImportDialog.tsx` + `src/components/Dialog/ImportDialog/*`.
3. Fork local de hook de import: `src/hooks/useImportDialog.tsx`.
4. Fork local de PrettyGrid: `src/components/PrettyGrid/*`.
5. Fork local de IndexedDBClient: `src/lib/api/offline/IndexedDBClient.ts`.

## Entregable esperado

1. PR upstream en `@sito/dashboard-app` aplicando los 4 casos de este pack.
2. PR en `sito-wallet/web` eliminando forks locales ya absorbidos upstream.
