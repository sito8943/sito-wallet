# Auth Remember Me - Frontend Integration

Guia para integrar `keep me signed in` usando `rememberMe` + `refreshToken`.

## 1. Base y autenticacion
- Base path: `/auth`
- Endpoints de esta guia:
  - `POST /auth/sign-in`
  - `POST /auth/refresh`
  - `POST /auth/sign-out`
- Endpoints protegidos (`/sync/**`, `/profiles/**`, etc.) siguen usando:
  - `Authorization: Bearer <accessToken>`

## 2. Flujo resumido
1. Usuario marca checkbox "Keep me signed in".
2. Frontend envia `rememberMe: true` en `sign-in`.
3. Backend responde `token` (access token) + `refreshToken`.
4. Cuando expira access token, frontend llama `/auth/refresh`.
5. Backend rota refresh token (el anterior deja de ser valido) y devuelve uno nuevo.
6. En `sign-out`, enviar access token y opcionalmente refresh token para revocar ambos.

## 3. Endpoints

### 3.1 `POST /auth/sign-in`
Request:
```json
{
  "email": "john@example.com",
  "password": "123456",
  "rememberMe": true
}
```

Response (`200`):
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "token": "eyJ...",
  "refreshToken": "G2lQ...N9Q",
  "accessTokenExpiresAt": "2026-03-07T22:47:00"
}
```

Notas:
- `rememberMe` es opcional.
- Si `rememberMe` no se envia o es `false`, backend no entrega `refreshToken`.

Errores comunes:
- `404` user no encontrado.
- `401` password invalido.

### 3.2 `POST /auth/refresh`
Request:
```json
{
  "refreshToken": "G2lQ...N9Q"
}
```

Response (`200`):
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "token": "eyJ...nuevo",
  "refreshToken": "k8Pa...x2M",
  "accessTokenExpiresAt": "2026-03-07T23:47:00"
}
```

Reglas:
- Rotacion obligatoria: siempre reemplazar localmente el `refreshToken` viejo por el nuevo.
- Si intentas reusar un refresh token ya usado/revocado/expirado, backend responde `400` (`Invalid refresh token`).

### 3.3 `POST /auth/sign-out`
Headers:
- `Authorization: Bearer <accessToken>`

Body opcional:
```json
{
  "refreshToken": "k8Pa...x2M"
}
```

Response:
- `204 No Content`

Notas:
- Si mandas `refreshToken`, backend lo revoca.
- Si no mandas body, solo se invalida el access token actual (blacklist).

## 4. Flujo recomendado en frontend

### 4.1 Login
1. Si checkbox activo, enviar `rememberMe: true`.
2. Guardar:
   - `token`
   - `accessTokenExpiresAt`
   - `refreshToken` (solo si llega)

### 4.2 Refresh automatico
1. Antes de consumir APIs protegidas, verificar expiracion de access token.
2. Si expiro y hay `refreshToken`, llamar `/auth/refresh`.
3. Guardar el nuevo par `token + refreshToken`.
4. Reintentar request original.

### 4.3 Integracion con Offline Sync
Al recuperar conectividad:
1. Si access token expiro y existe `refreshToken`, refrescar primero.
2. Luego llamar `GET /sync/status`.
3. Continuar `start -> bulk -> finish`.
4. Si `/auth/refresh` falla, limpiar sesion local y pedir login antes de sync.

## 5. Recomendaciones tecnicas
- No disparar multiples `/auth/refresh` en paralelo.
- Implementar mutex/queue para refresh.
- Guardar `refreshToken` en almacenamiento seguro.
- No loggear tokens.

## 6. Tipos sugeridos (TypeScript)
```ts
export interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  email: string;
  token: string;
  refreshToken?: string | null;
  accessTokenExpiresAt?: string | null;
}
```

## 7. Ejemplos fetch

### Sign-in con remember me
```ts
const res = await fetch(`${API_URL}/auth/sign-in`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email,
    password,
    rememberMe: true
  })
});
```

### Refresh token
```ts
const res = await fetch(`${API_URL}/auth/refresh`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ refreshToken })
});
```

### Sign-out revocando refresh token
```ts
await fetch(`${API_URL}/auth/sign-out`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`
  },
  body: JSON.stringify({ refreshToken })
});
```
