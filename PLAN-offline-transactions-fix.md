# Fix: Transactions desaparecen al pasar a offline

## Problema

Al cambiar de online a offline estando en la vista de transactions, estas desaparecen momentaneamente o permanentemente.

### Causa raiz

`src/layouts/View/View.tsx:63`:

```tsx
if (preloadLoading) return <SplashScreen />;
```

Cuando `isOnline` cambia, `useAppPreload` entra en estado `loading` transitorio porque el `requiredTasksSignature` cambia (incluye el estado online/offline) pero `lastSettledSignature` aun tiene el valor anterior. Esto causa:

1. `View` renderiza `<SplashScreen />` en lugar de `<Outlet />`
2. `Transactions` (y toda la vista) se **desmonta**
3. `TableOptionsProvider` se desmonta tambien, reseteando paginacion/filtros
4. `useAppPreload` resuelve rapido -> `loading = false`
5. `Transactions` se **monta de nuevo** desde cero
6. `useTransactionsList` ejecuta `queryFn` con `offlineManager`
7. `IndexedDBClient.get()` lee de IndexedDB, que puede estar vacio si el seed (fire-and-forget) no completo

### Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/layouts/View/View.tsx` | Renderiza `SplashScreen` cuando `preloadLoading` es true |
| `src/hooks/useAppPreload/useAppPreload.ts` | Calcula `loading` basado en `requiredTasksSignature` vs `lastSettledSignature` |
| `src/hooks/queries/useTransactions.tsx` | Hooks de query que seedean IndexedDB (fire-and-forget) |
| `src/lib/api/preloadOfflineBootstrapData.ts` | Bootstrap de datos offline (NO incluye transactions) |
| `src/providers/SWManagerProvider.tsx` | Cambia el manager activo segun `isOnline` |

---

## Plan de solucion

### Paso 1: Evitar splash screen en transiciones online/offline

**Archivo:** `src/hooks/useAppPreload/useAppPreload.ts`

Cuando `useAppPreload` ya ha completado una carga inicial exitosa, NO debe volver a `loading: true` solo porque el estado online/offline cambio. El splash screen solo debe mostrarse en la carga inicial de la app.

**Cambio:** Agregar una ref `hasSettledOnce` que, una vez true, impida que `loading` vuelva a ser `true`.

```ts
const hasSettledOnceRef = useRef(false);

// Despues de que se resuelven las tasks:
if (completed.length > 0 || failed.length > 0) {
  hasSettledOnceRef.current = true;
}

// En el return:
const loading =
  !hasSettledOnceRef.current &&
  requiredTasks.length > 0 &&
  lastSettledSignature !== requiredTasksSignature;
```

Esto evita el desmontaje/remontaje de toda la vista al cambiar de online a offline.

### Paso 2: Agregar transactions al bootstrap de datos offline

**Archivo:** `src/lib/api/preloadOfflineBootstrapData.ts`

Actualmente solo se precargan Accounts, Currencies y TransactionCategories. Las transactions solo se seedean cuando el usuario las consulta. Esto es un problema porque si el seed fire-and-forget no completa antes de ir offline, IndexedDB esta vacio.

**Cambio:** Agregar `fetchTransactionsList` al bootstrap.

```ts
export const defaultTransactionsListFilters = {
  deletedAt: false as unknown as FilterTransactionDto["deletedAt"],
};

export async function fetchTransactionsList(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
  filters: FilterTransactionDto,
): Promise<QueryResult<TransactionDto>> {
  try {
    const result = await manager.Transactions.get(undefined, {
      ...filters,
    });
    offlineManager.Transactions.seed(result.items).catch(() => {});
    return result;
  } catch (error) {
    console.warn("API failed, loading transactions from IndexedDB", error);
    return await offlineManager.Transactions.get(undefined, {
      ...filters,
    });
  }
}
```

Y agregarlo a `preloadOfflineBootstrapData`:

```ts
export async function preloadOfflineBootstrapData(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
): Promise<void> {
  await Promise.allSettled([
    fetchAccountsList(manager, offlineManager, defaultAccountsListFilters),
    fetchCurrenciesList(manager, offlineManager, defaultCurrenciesListFilters),
    fetchTransactionCategoriesList(
      manager, offlineManager, defaultTransactionCategoriesListFilters,
    ),
    fetchTransactionsList(
      manager, offlineManager, defaultTransactionsListFilters,
    ),
  ]);
}
```

> **Nota:** Esto precarga la primera pagina de transactions (pageSize por defecto). No todas las paginas, pero garantiza que hay datos en IndexedDB al ir offline.

### Paso 3: Asegurar que el seed completa antes de devolver datos (opcional, mejora)

**Archivo:** `src/hooks/queries/useTransactions.tsx`

Actualmente el seed es fire-and-forget:

```ts
offlineManager.Transactions.seed(result.items).catch(() => {});
```

Esto significa que si el usuario va offline inmediatamente despues de cargar, el seed puede no haber completado. Con el Paso 2 esto se mitiga, pero como mejora adicional, en los hooks de query se puede hacer `await` del seed:

```ts
const result = await manager.Transactions.get(parsedQueries, parsedFilters);
await offlineManager.Transactions.seed(result.items).catch(() => {});
return result;
```

El impacto en performance es minimo (IndexedDB writes son rapidos), y garantiza que los datos estan disponibles offline inmediatamente.

**Aplicar en:** `useTransactionsList` (linea 117) y `useInfiniteTransactionsList` (linea 173).

---

## Orden de implementacion

1. **Paso 1** (critico) - Corrige el problema principal: el desmontaje de la vista
2. **Paso 2** (importante) - Garantiza datos en IndexedDB desde el inicio
3. **Paso 3** (mejora) - Elimina race condition del seed

## Verificacion

- Abrir la vista de transactions estando online
- Desconectar la red (o simular offline en DevTools)
- Las transactions deben seguir visibles sin flash de splash screen
- Navegar entre vistas offline debe funcionar con datos cacheados
