# 03. PrettyGrid

## Contexto local a absorber
1. `sito-wallet/web/src/components/PrettyGrid/PrettyGrid.tsx`
2. `sito-wallet/web/src/components/PrettyGrid/types.ts`
3. `sito-wallet/web/src/components/PrettyGrid/styles.css`
4. Delta funcional: infinite scroll con `IntersectionObserver`.

## Instrucción literal para `@sito/dashboard-app`
1. **No crear** otro grid.
2. Actualiza el `PrettyGrid` existente.
3. Amplía tipos y comportamiento manteniendo compatibilidad con props actuales.

## Cambios exactos
1. Extender `PrettyGridPropsType` con:
2. `hasMore?: boolean`
3. `loadingMore?: boolean`
4. `onLoadMore?: () => void | Promise<void>`
5. `loadMoreComponent?: ReactNode`
6. `observerRootMargin?: string`
7. `observerThreshold?: number`
8. Mantener defaults:
9. `hasMore=false`
10. `loadingMore=false`
11. `loadMoreComponent=null`
12. `observerRootMargin="0px 0px 200px 0px"`
13. `observerThreshold=0`
14. Implementar sentinel al final del `<ul>` y disparo de `onLoadMore` cuando entra en viewport.
15. Evitar doble-disparo mientras `loadingMore=true` o mientras hay request en curso.
16. Añadir clase `pretty-grid-load-more` al sentinel y su CSS base.
17. Mantener `loading` full-screen behavior actual.
18. Mantener fallback de empty state actual.

## Compatibilidad obligatoria
1. Consumidores actuales que solo usan `data`, `loading`, `renderComponent` deben comportarse igual.
2. No cambiar semántica ni nombre de clases existentes (`pretty-grid-main`, `pretty-grid-item`).

## Pruebas obligatorias
1. Test de render clásico (sin infinite props).
2. Test de `onLoadMore` disparado al intersectar.
3. Test de no doble-disparo con `loadingMore=true`.
4. Test de no disparo si `hasMore=false`.

## Done de este caso
1. Se elimina la necesidad del fork local `src/components/PrettyGrid/*` en `sito-wallet/web`.
