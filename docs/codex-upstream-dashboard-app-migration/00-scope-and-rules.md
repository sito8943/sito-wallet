# 00. Scope y reglas

## Objetivo
Actualizar `@sito/dashboard-app` para absorber mejoras ya implementadas localmente en `sito-wallet/web`, **sin recrear** componentes/hooks/clientes existentes.

## Reglas duras
1. No recrear `ImportDialog`, `useImportDialog`, `PrettyGrid`, `IndexedDBClient`, `IconButton`.
2. Trabajar sobre implementaciones existentes de `@sito/dashboard-app`.
3. Mantener compatibilidad hacia atrás. Si cambias firma, debe ser aditiva o con backward compatibility.
4. No usar `any`.
5. No introducir imports internos desde el consumidor; solo export raíz.
6. Mantener FontAwesome para iconos.

## Reglas de estilo
1. Evitar colores hardcoded (`gray-*`, `red-*`, `white`, `black`) en componentes compartidos.
2. Usar tokens semánticos/variables de la librería.
3. No forzar estilos de `@sito/dashboard` base dentro de `dashboard-app` salvo wrappers propios de `dashboard-app`.

## Validación mínima en `@sito/dashboard-app`
1. `npm run lint`
2. `npm run build`
3. `npm run test`

## Validación mínima en `sito-wallet/web` tras subir versión
1. `npm run lint`
2. `npm run build`
3. `npm run test`
