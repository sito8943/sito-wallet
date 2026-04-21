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
  "redirectTo": "https://tu-frontend.com/reset-password"
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

Request:
```json
{
  "accessToken": "<supabase-recovery-access-token>",
  "newPassword": "newStrongPassword123"
}
```

Response:
- `204 No Content`

Errores comunes:
- `400` request invalido / contrasena corta / bridge desactivado
- `401` token de recovery invalido
- `404` usuario no existe localmente

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

## Flujo recomendado de reset en frontend
1. Pantalla "Forgot password" llama `POST /auth/password/forgot`.
2. Usuario abre link del email.
3. Frontend obtiene `access_token` del link de recuperacion.
4. Frontend envia `accessToken` + `newPassword` a `POST /auth/password/reset`.
5. Si `204`, redirigir a login.

## Notas de integracion
- El backend puede devolver errores como texto simple (`message`), no siempre JSON estructurado.
- Guardar y renovar sesion con `token` + `refreshToken` usando `/auth/refresh`.
- El backend Java mantiene la fuente de verdad de usuarios; Supabase se usa para flujo de emails/mirror.
