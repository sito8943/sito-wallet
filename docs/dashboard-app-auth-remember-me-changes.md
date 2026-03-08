# Dashboard-App Changes for Auth Remember Me

## Objetivo
Adaptar `@sito/dashboard-app` al contrato de `auth-remember-me-frontend.md` para soportar:
- `rememberMe` en sign-in.
- `refreshToken` + `accessTokenExpiresAt`.
- refresh automatico seguro (sin paralelismo).
- sign-out con revocacion opcional de refresh token.

## Estado actual (dashboard-app)
- `AuthClient.login()` solo tipa `AuthDto` (`email` + `password`), sin `rememberMe`.
- `SessionDto` solo contiene `id`, `username`, `email`, `token`.
- `AuthClient` no expone endpoint `/auth/refresh`.
- `AuthClient.logout()` llama `POST auth/sign-out` sin header `Authorization` ni body opcional.
- `AuthProvider` persiste unicamente el `token` (key `user`) y no maneja expiracion/refresh.
- `APIClient` no tiene estrategia built-in para refresh y retry de requests protegidos.

## Cambios recomendados en `@sito/dashboard-app`

### 1) Tipos de auth (bloqueante)
- Extender request de login:
  - `SignInDto` (o `AuthDto`) con `rememberMe?: boolean`.
- Extender sesion:
  - `SessionDto` con:
    - `refreshToken?: string | null`
    - `accessTokenExpiresAt?: string | null`
- Crear tipo para refresh:
  - `RefreshDto { refreshToken: string }`

### 2) AuthClient (bloqueante)
- `login(data)` debe aceptar `rememberMe`.
- Anadir `refresh(data: RefreshDto): Promise<SessionDto>` (`POST /auth/refresh`).
- Cambiar `logout` a:
  - incluir `Authorization: Bearer <accessToken>`.
  - aceptar body opcional `{ refreshToken?: string }`.

### 3) AuthProvider storage model (bloqueante)
- Guardar sesion completa, no solo token:
  - access token
  - refresh token (si existe)
  - access token expiry
  - remember flag
- Anadir keys configurables en props (con defaults retrocompatibles):
  - `user` (actual)
  - `remember`
  - `refreshTokenKey`
  - `accessTokenExpiresAtKey`

### 4) Refresh automatico con mutex (bloqueante)
- Implementar una sola operacion de refresh concurrente:
  - si varios requests detectan token expirado/401, todos esperan el mismo refresh en vuelo.
- Rotacion obligatoria:
  - siempre reemplazar localmente el refresh token viejo por el nuevo.
- Si refresh falla:
  - limpiar sesion local completa
  - forzar flujo de login.

### 5) APIClient integration para endpoints protegidos (alta)
Implementar una estrategia centralizada (en dashboard-app, no por app):
- Antes de requests protegidos:
  - verificar expiracion y refrescar si aplica.
- Si una request protegida devuelve `401`:
  - intentar refresh (si hay refresh token) y reintentar request 1 vez.
- Evitar loops infinitos de retry.

## Compatibilidad recomendada
- Mantener compatibilidad con apps actuales:
  - si no hay `refreshToken` o `accessTokenExpiresAt`, comportamiento legacy.
  - `rememberMe` opcional.
- No romper firma publica existente:
  - agregar APIs nuevas sin eliminar las actuales.

## Impacto esperado en este proyecto (`sito-wallet/web`)
Una vez publicado `@sito/dashboard-app` con lo anterior, en este repo solo haria falta:
- enviar `rememberMe` en SignIn.
- usar las nuevas capacidades del provider/client sin implementar refresh manual aqui.

## Orden sugerido de implementacion en dashboard-app
1. Tipos (`SessionDto`, `SignInDto/AuthDto`, `RefreshDto`).
2. `AuthClient` (`refresh`, `logout` con headers/body).
3. Persistencia extendida en `AuthProvider`.
4. Mutex de refresh en provider o capa auth interna.
5. Integracion de refresh/retry en `APIClient`.
6. Tests unitarios de:
  - rotacion refresh token,
  - refresh concurrente unico,
  - fallback legacy sin remember.
