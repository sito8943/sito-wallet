# Change Password - Frontend Contract

Contrato propuesto para cambio de contrasena de un usuario autenticado.

## Estado

- Propuesto
- No sustituye el flujo actual de recovery
- El flujo de recovery debe seguir usando `POST /auth/password/forgot` y `POST /auth/password/reset`

## Objetivo

Separar claramente dos casos:

- `reset password`: usuario no autenticado que viene desde email de recovery
- `change password`: usuario autenticado que quiere cambiar su contrasena desde ajustes de cuenta

## Base

- Base path: `/auth`
- Endpoint protegido: requiere `Authorization: Bearer <backend-jwt>`
- Frontend sigue hablando solo con el backend Java
- Frontend no debe llamar a Supabase directamente

## Endpoint propuesto

### `POST /auth/password/change`

URL completa:

```txt
POST https://<tu-backend>/auth/password/change
```

Headers:

```txt
Content-Type: application/json
Authorization: Bearer <backend-jwt>
```

Request:

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newStrongPassword123"
}
```

Response exitosa:

- `204 No Content`

Errores esperados:

- `400` request invalido
- `401` no autenticado, token invalido o `currentPassword` incorrecta
- `404` usuario autenticado no encontrado localmente
- `409` conflicto de negocio si se decide bloquear password igual a la actual
- `503` bridge de Supabase no disponible

## Reglas funcionales esperadas

1. El backend obtiene el usuario desde la sesion autenticada, no desde el body.
2. `currentPassword` es obligatoria.
3. `newPassword` es obligatoria.
4. `newPassword` debe cumplir politica minima actual del backend.
5. Si `currentPassword` no coincide con la password local, responder `401`.
6. Si la validacion local pasa, backend sincroniza el cambio con Supabase.
7. Si Supabase confirma el cambio, backend actualiza la password local.
8. Backend revoca refresh tokens activos del usuario al terminar.
9. El endpoint no debe aceptar `tokenHash`, `accessToken` ni `refreshToken` en el body.

## Diferencia con reset password

### Recovery

`POST /auth/password/reset`

Se usa cuando el usuario llega desde email de recuperacion y no tiene sesion iniciada.

### Change password

`POST /auth/password/change`

Se usa desde perfil, seguridad o ajustes cuando el usuario ya esta loggeado.

## Tipos sugeridos para frontend

```ts
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
```

No se espera body en la respuesta:

```ts
export type ChangePasswordResponse = void;
```

## Ejemplo fetch

```ts
await fetch(`${API_URL}/auth/password/change`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    currentPassword,
    newPassword,
  }),
});
```

## UX recomendada en frontend

1. Pedir `currentPassword`.
2. Pedir `newPassword`.
3. Pedir confirmacion local de `newPassword`.
4. Llamar al endpoint.
5. Si responde `204`, mostrar exito y forzar refresco de sesion si aplica.
6. Si responde `401`, mostrar error de credenciales sin detallar demasiado.

## Mensajes recomendados

- Exito: `Password updated successfully.`
- Error `401`: `Current password is incorrect.`
- Error `400`: `Please review the form fields.`
- Error `503`: `Password service is temporarily unavailable. Try again later.`

## Notas de implementacion backend

- Este endpoint deberia vivir en `AuthController`.
- El servicio deberia resolver el usuario autenticado con `CurrentUserProvider`.
- Conviene mantener `POST /auth/password/reset` solo para recovery.
- Conviene documentar este endpoint tambien dentro de `docs/auth-api-frontend.md` cuando quede implementado.
