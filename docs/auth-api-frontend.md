# Wallet Auth API Contract (Frontend)

## Regla principal

El frontend solo debe hablar con el backend Java (`/auth/**`).
No llamar Supabase directo desde frontend.

## Base

- Base URL: `https://<tu-backend>/auth`
- Auth header para endpoints protegidos: `Authorization: Bearer <token>`

## Endpoints

### 1) Sign In

`POST /auth/sign-in`

Request:

```json
{
  "email": "user@mail.com",
  "password": "123456",
  "rememberMe": true
}
```

Response `200` (`AuthDto`):

```json
{
  "id": 1,
  "username": "user",
  "email": "user@mail.com",
  "token": "jwt-access-token",
  "refreshToken": "opaque-refresh-token",
  "accessTokenExpiresAt": "2026-04-21T20:00:00"
}
```

Errores comunes:

- `400` payload invalido
- `401` password invalida
- `404` usuario no existe en DB local

### 2) Sign Up

`POST /auth/sign-up`

Request:

```json
{
  "email": "user@mail.com",
  "password": "123456"
}
```

Response `200` (`AuthDto`):

```json
{
  "id": 1,
  "username": "user",
  "email": "user@mail.com",
  "token": "jwt-access-token",
  "accessTokenExpiresAt": "2026-04-21T20:00:00"
}
```

Errores comunes:

- `400` payload invalido
- `409` email ya registrado localmente

### 3) Refresh

`POST /auth/refresh`

Request:

```json
{
  "refreshToken": "<refresh-token>"
}
```

Response `200` (`AuthDto`, rota refresh token):

```json
{
  "token": "new-jwt-access-token",
  "refreshToken": "new-refresh-token",
  "accessTokenExpiresAt": "2026-04-21T21:00:00"
}
```

Errores:

- `400` refresh token invalido/expirado

### 4) Sign Out

`POST /auth/sign-out`

Headers:

- `Authorization: Bearer <access-token>` (recomendado)

Request body (opcional):

```json
{
  "refreshToken": "<refresh-token>"
}
```

Response:

- `204 No Content`

### 5) Session

`GET /auth/session`

Headers:

- `Authorization: Bearer <access-token>`

Response `200` (`AuthDto`):

```json
{
  "id": 1,
  "username": "user",
  "email": "user@mail.com",
  "token": "jwt-access-token",
  "accessTokenExpiresAt": "2026-04-21T20:00:00"
}
```

Errores:

- `401` token invalido o faltante

### 6) Forgot Password

`POST /auth/password/forgot`

Request:

```json
{
  "email": "user@mail.com",
  "redirectTo": "https://tu-frontend.com/auth/reset-password"
}
```

Response `202` (siempre misma forma):

```json
{
  "accepted": true,
  "message": "If the account exists, we sent a password reset link."
}
```

### 7) Reset Password

`POST /auth/password/reset`

Request canonico (nuevo flujo):

```json
{
  "tokenHash": "<supabase-token-hash>",
  "type": "recovery",
  "newPassword": "newStrongPassword123"
}
```

Compatibilidad temporal (flujo legacy, opcional mientras se migra):

```json
{
  "accessToken": "<supabase-recovery-access-token>",
  "newPassword": "newStrongPassword123"
}
```

Response:

- `204 No Content`

Errores comunes:

- `400` request invalido / `newPassword` invalido / `tokenHash` vacio / `type` no soportado
- `401` token de recovery invalido o expirado
- `404` usuario no existe localmente
- `503` bridge de Supabase no disponible

Contrato esperado del backend:

1. Endpoint publico (sin `Authorization`) para consumir callback de recovery.
2. Validar `newPassword` requerido y politicas de password.
3. Soportar como payload canonico `tokenHash` + `type`.
4. Normalizar `type` a lowercase y permitir `recovery`.
5. Verificar token contra Supabase bridge (equivalente a `verifyOtp` con `token_hash` + `type`).
6. Compatibilidad temporal: aceptar `accessToken` mientras existan enlaces legacy en circulacion.
7. Si el token verifica y usuario existe localmente, actualizar password y devolver `204`.
8. Si la verificacion falla, devolver `401` (no `500`).

### 8) Resend Confirm Email

`POST /auth/email/confirm/resend`

Request:

```json
{
  "email": "user@mail.com",
  "redirectTo": "https://tu-frontend.com/confirm-email"
}
```

Response `202`:

```json
{
  "accepted": true,
  "message": "If the account exists, we sent a confirmation email."
}
```

### 9) Confirm Email (token_hash callback)

`POST /auth/email/confirm`

Request:

```json
{
  "tokenHash": "<supabase-token-hash>",
  "type": "email"
}
```

Response:

- `204 No Content`

Errores comunes:

- `400` payload invalido (`tokenHash` vacio o `type` no soportado)
- `401` token invalido/expirado
- `503` bridge de Supabase no disponible

Contrato esperado del backend:

1. Endpoint publico (sin `Authorization`) para consumir el callback de email.
2. Validar `tokenHash` requerido y `type` requerido.
3. Normalizar `type` a lowercase y permitir `email` (al menos en este flujo).
4. Verificar el token contra Supabase bridge (equivalente a `verifyOtp` con `token_hash` + `type`).
5. Si verifica correctamente, devolver `204`.
6. Si el email ya estaba confirmado, devolver `204` (idempotente) para evitar falsos errores de UX.

Compatibilidad temporal:

- El frontend de `wallet` intenta `POST /auth/email/confirm`.
- Si recibe `404`, intenta `POST /auth/email/confirm/verify`.
- Recomendado: exponer `POST /auth/email/confirm` como endpoint canonico y retirar el fallback cuando backend este desplegado en todos los entornos.

## Flujo recomendado de reset en frontend

1. Pantalla "Forgot password" llama `POST /auth/password/forgot`.
2. Usuario abre link del email.
3. Plantilla de Supabase para recovery debe redirigir a:
   `/auth/reset-password?token_hash={{ .TokenHash }}&type=recovery`
4. Frontend lee `token_hash`/`type` y envia `tokenHash` + `type` + `newPassword` a `POST /auth/password/reset`.
5. Compatibilidad temporal: si llega enlace legacy con `access_token`, frontend puede enviar `accessToken` + `newPassword`.
6. Si `204`, redirigir a login.

## Flujo recomendado de confirmacion de email (sign-up)

1. Frontend envia `POST /auth/email/confirm/resend` con `redirectTo` apuntando a `https://<frontend>/auth/confirm-email-success`.
2. Plantilla de Supabase redirige con query params: `/auth/confirm-email-success?token_hash={{ .TokenHash }}&type=email`.
3. Frontend lee `token_hash`/`type` y llama `POST /auth/email/confirm`.
4. Si backend responde `204`, frontend muestra `ConfirmEmailSuccess`.
5. Si backend responde error, frontend redirige a `ConfirmEmailError`.

## Notas de integracion

- El backend puede devolver errores como texto simple (`message`), no siempre JSON estructurado.
- Guardar y renovar sesion con `token` + `refreshToken` usando `/auth/refresh`.
- El backend Java mantiene la fuente de verdad de usuarios; Supabase se usa para flujo de emails/mirror.
