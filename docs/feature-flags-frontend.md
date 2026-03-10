# Frontend Docs: Feature Flags

## Objetivo
Consumir feature flags desde backend para habilitar/deshabilitar modulos de UI sin hardcodear reglas en vistas.

## Contrato Backend

- Metodo: `GET`
- URL: `/app/features`
- Auth: `Authorization: Bearer <token>` (requerido)
- Status esperado: `200 OK`

### Response

```json
{
  "features": {
    "balanceGreaterThanZero": false,
    "currenciesEnabled": true,
    "accountsEnabled": true,
    "transactionsEnabled": true
  }
}
```

## Flags Disponibles

- `balanceGreaterThanZero`: regla de saldo no negativo (impacto principal en backend, pero visible para UI).
- `currenciesEnabled`: habilita/deshabilita modulo de monedas.
- `accountsEnabled`: habilita/deshabilita modulo de cuentas.
- `transactionsEnabled`: habilita/deshabilita modulo de transacciones.
- Dependencia obligatoria: si `transactionsEnabled=false`, entonces `transaction-categories` tambien debe quedar deshabilitado en toda la UI.

## Reglas de Arquitectura (obligatorias)

1. Debe existir un `FeatureFlagClient` dedicado, igual que los demas clientes de `src/lib/api/`.
2. `FeatureFlagClient` no representa una entidad de BD; solo consume el endpoint `/app/features`.
3. Debe existir un `FeatureFlagsProvider` global que:
   - Consuma `FeatureFlagClient`.
   - Exponga estado + helper (`isFeatureEnabled`).
   - Persista flags en `localStorage`.
4. Los valores por defecto no deben estar hardcodeados en TypeScript:
   - Deben venir de variables `.env`.
5. Refresco de flags:
   - Solo cuando el usuario se loggea (sign-in/sign-up con exito).
   - No refrescar en background, ni por navegacion, ni por render.
   - Al desloguear, limpiar flags de memoria y `localStorage`.
6. Si se requiere UX dedicada para modulos deshabilitados, crear componente/pagina `Modulo No Disponible`.
7. Regla de dependencia entre modulos:
   - `transaction-categories` depende de `transactionsEnabled`.
   - No existe flag independiente para categories en este alcance.

## Variables `.env` Requeridas

Estas variables reemplazan cualquier `DEFAULT_FEATURES` hardcodeado:

```bash
VITE_FEATURE_FLAGS_STORAGE_KEY=featureFlags
VITE_FEATURE_BALANCE_GREATER_THAN_ZERO_DEFAULT=false
VITE_FEATURE_CURRENCIES_ENABLED_DEFAULT=true
VITE_FEATURE_ACCOUNTS_ENABLED_DEFAULT=true
VITE_FEATURE_TRANSACTIONS_ENABLED_DEFAULT=true
```

Notas:
- Parsear booleans de forma estricta (`"true"` / `"false"`).
- Centralizar parsing en `config.ts` para evitar duplicacion.
- Estructura requerida en config: usar `config.featureFlags` como contenedor unico de esta configuracion.
  - Ejemplo esperado: `config.featureFlags.defaults` y `config.featureFlags.storageKey`.
  - Evitar exponer flags/defaults como propiedades sueltas en la raiz de `config`.

## Flujo Funcional Esperado

1. App inicia:
   - Provider carga flags desde `localStorage`.
   - Si no existen, usa defaults de `.env`.
2. Usuario hace login exitoso:
   - Provider ejecuta fetch via `FeatureFlagClient`.
   - Mezcla defaults + payload backend.
   - Guarda en estado y en `localStorage`.
3. Usuario navega:
   - Rutas/menu/acciones usan `isFeatureEnabled`.
4. Usuario hace logout:
   - Limpiar flags en estado.
   - Eliminar `localStorage` de flags.

## Plan de Implementacion (fases atomicas)

### Fase 1 - Tipos + Config de defaults por `.env`

- Crear tipos en `src/lib/api/types.ts` o archivo `types.ts` dedicado (`AppFeatures`, `AppFeaturesResponse`, `FeatureFlagKey`).
- Agregar defaults en `src/config.ts` leyendo `.env`.
- Exponer `config.featureFlags.defaults` + `config.featureFlags.storageKey`.

Entregable:
- No existe `DEFAULT_FEATURES` hardcodeado en codigo de negocio.

### Fase 2 - `FeatureFlagClient`

- Crear `src/lib/api/FeatureFlagClient.ts`.
- Implementar metodo `getFeatures(): Promise<AppFeatures>`.
- Integrar cliente en `Manager` con getter `FeatureFlags`.
- Mantener claro en comentarios/nombre que no es entidad CRUD de BD.

Entregable:
- Cliente reutilizable y alineado al patron actual de `lib/api`.

### Fase 3 - Persistencia local de flags

- Crear utilidades en `src/lib/utils` para:
  - leer flags persistidas.
  - guardar flags.
  - limpiar flags.
- Normalizar merge: `defaults (.env) + payload backend + persisted (cuando aplique)`.

Entregable:
- Acceso a `localStorage` encapsulado y tipado.

### Fase 4 - `FeatureFlagsProvider`

- Crear `src/providers/FeatureFlagsProvider.tsx`.
- Crear contexto/hook `useFeatureFlags()`.
- Exponer:
  - `features`
  - `isFeatureEnabled(key)`
  - `refreshFeatures()` (uso interno para login)
  - `clearFeatures()` (logout)

Entregable:
- Estado global de flags disponible en toda la app.

### Fase 5 - Integracion del provider

- Montar `FeatureFlagsProvider` dentro de `SitoWalletProvider`.
- Verificar orden para que tenga acceso a auth/manager segun necesidad.

Entregable:
- Provider activo en arbol principal.

### Fase 6 - Disparo de refresco solo en login

- En `SignIn` y `SignUp`, tras login exitoso:
  - llamar `refreshFeatures()`.
- No llamar refresh en bootstrap de sesion (`useAppSession`) ni en otras vistas.

Entregable:
- Refresco ocurre exclusivamente al loggear usuario.

### Fase 7 - Limpieza en logout

- En flujo de logout (`SignOut` y/o handler central de sesion):
  - ejecutar `clearFeatures()`.
  - borrar storage de flags.

Entregable:
- Sin residuos de flags entre sesiones.

### Fase 8 - Guardas de UI

- Aplicar flags a:
  - rutas (`Routes.tsx`)
  - menu (`menuMap`/Header)
  - sitemap y buscador
  - acciones visibles por modulo
- Aplicar dependencia:
  - si `transactionsEnabled=false`, bloquear `/transactions` y `/transaction-categories`.

Entregable:
- Usuario no ve ni navega a modulos deshabilitados.

### Fase 9 - `Modulo No Disponible` (si aplica)

- Crear vista/componente dedicada para accesos a modulo deshabilitado:
  - mensaje claro.
  - CTA para volver al inicio.
- Agregar traducciones (`en` y `es`).

Entregable:
- UX consistente para feature off.

### Fase 10 - Manejo de errores de negocio

- Ante errores backend `*.featureDisabled`:
  - mostrar notificacion "modulo no disponible".
  - no refrescar flags automaticamente (regla: refresh solo login).

Entregable:
- Comportamiento alineado con politica de refresco definida.

### Fase 11 - Pruebas

- Unit tests:
  - `FeatureFlagClient`
  - utils de persistencia
  - provider/hook
- Integracion:
  - refresco en login
  - limpieza en logout
  - guardas en rutas/menu

Entregable:
- Cobertura de flujo principal y regresiones.

## Criterios de Aceptacion Globales

1. Existe `FeatureFlagClient` en `lib/api` y no modela entidad de BD.
2. Defaults salen de `.env`, no de constantes hardcodeadas de dominio.
3. Flags se refrescan solo en login.
4. Flags se limpian en logout.
5. UI respeta flags en rutas/menu/buscador/acciones.
6. Existe estrategia para "Modulo No Disponible" (componente o ruta dedicada).
7. Si `transactionsEnabled=false`, `transaction-categories` queda deshabilitado tambien.
