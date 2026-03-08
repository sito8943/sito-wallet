# Offline Sync - Frontend Integration Guide

Guia de integracion del feature de sincronizacion offline implementado en backend.

## 1. Base y autenticacion
- Base path: `/sync`
- Todas las rutas requieren JWT en `Authorization: Bearer <token>`.
- Si el token no existe o es invalido/blacklisted, backend responde `401`.

## 2. Flujo recomendado (MVP)
1. Llamar `GET /sync/status` al recuperar conectividad.
2. Abrir sesion con `POST /sync/session/start`.
3. Enviar bulks por entidad con `POST /sync/bulk/{entity}`.
4. Cerrar con `POST /sync/session/finish`.
5. Si cliente aborta, llamar `POST /sync/session/cancel`.

Orden sugerido de envio:
1. `currencies`
2. `accounts`
3. `transactionCategories`
4. `transactions`
5. `userDashboardConfigs`
6. `profile`

## 3. Endpoints HTTP

### 3.1 `GET /sync/status`
Respuesta:
```json
{
  "connected": true,
  "serverTime": "2026-03-06T21:30:00",
  "lastSyncAt": "2026-03-06T21:00:00",
  "deviceId": "device-abc",
  "hasActiveSession": false
}
```
Notas:
- `lastSyncAt` y `deviceId` pueden ser `null`.

### 3.2 `POST /sync/session/start`
Request:
```json
{
  "deviceId": "device-abc",
  "clientTime": "2026-03-06T21:29:58",
  "lastKnownSyncAt": "2026-03-06T21:00:00",
  "appVersion": "1.9.0"
}
```
Response:
```json
{
  "sessionId": "sync-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "accepted": true,
  "reason": null,
  "serverTime": "2026-03-06T21:30:01",
  "profileDeviceId": "device-abc",
  "profileLastSyncAt": "2026-03-06T21:00:00"
}
```
Reglas:
- `deviceId` es obligatorio.
- Si `profile.deviceId` existe y no coincide, responde `409` con mensaje tipo `SYNC_DEVICE_CONFLICT: Profile device mismatch`.
- Si ya existe una sesion `OPEN`, responde `400`.

### 3.3 `POST /sync/bulk/{entity}`
Request:
```json
{
  "sessionId": "sync-...",
  "entity": "transactions",
  "items": [
    {
      "clientOperationId": "op-001",
      "operation": "CREATE",
      "clientUpdatedAt": "2026-03-06T20:10:00",
      "payload": {
        "accountId": 1,
        "categoryId": 2,
        "amount": 150.00,
        "date": "2026-03-06T20:10:00",
        "description": "coffee"
      }
    }
  ]
}
```
Response:
```json
{
  "sessionId": "sync-...",
  "entity": "transactions",
  "received": 1,
  "applied": 1,
  "skipped": 0,
  "failed": 0,
  "errors": []
}
```
Reglas:
- `sessionId` obligatorio.
- `entity` del body es opcional; si se envia, debe coincidir con `{entity}` del path.
- Idempotencia: si `clientOperationId` ya fue procesado en esa sesion, item se cuenta como `skipped`.
- Si falla un item, backend sigue con los siguientes y agrega error en `errors[]`.
- Si la sesion no esta `OPEN`, responde `400`.

### 3.4 `POST /sync/session/finish`
Request:
```json
{
  "sessionId": "sync-..."
}
```
Response exitosa:
```json
{
  "sessionId": "sync-...",
  "status": "FINISHED",
  "serverTime": "2026-03-06T21:33:10",
  "lastSyncAt": "2026-03-06T21:33:10"
}
```
Reglas:
- Si hubo operaciones fallidas en la sesion, backend marca sesion `FAILED` y responde `400` (`Sync session has failed operations`).
- En finish exitoso actualiza `profile.lastSyncAt` y fija `profile.deviceId` si aun estaba `null`.

### 3.5 `POST /sync/session/cancel`
Request:
```json
{
  "sessionId": "sync-...",
  "reason": "user cancelled"
}
```
Response:
```json
{
  "sessionId": "sync-...",
  "status": "CANCELED",
  "serverTime": "2026-03-06T21:34:00",
  "lastSyncAt": null
}
```

## 4. Valores aceptados en sync

### 4.1 `entity`
Acepta nombre o codigo.

Nombres recomendados para frontend:
- `currencies`
- `accounts`
- `transactionCategories`
- `transactions`
- `userDashboardConfigs`
- `profile`
- `subscriptions` (actualmente no soportado en procesamiento)

Codigos:
- `1` CURRENCIES
- `2` ACCOUNTS
- `3` TRANSACTION_CATEGORIES
- `4` TRANSACTIONS
- `5` USER_DASHBOARD_CONFIGS
- `6` PROFILE
- `7` SUBSCRIPTIONS

### 4.2 `operation`
Acepta nombre o codigo.

Nombres recomendados:
- `CREATE`
- `UPDATE`
- `DELETE`
- `RESTORE`

Codigos:
- `1` CREATE
- `2` UPDATE
- `3` DELETE
- `4` RESTORE

## 5. Contrato de `payload` por entidad

### 5.1 `currencies`
- `CREATE`: `{ "name", "description", "symbol" }`
- `UPDATE`: `{ "id", "name", "description", "symbol" }`
- `DELETE`/`RESTORE`: `{ "id": 123 }` (tambien acepta numero crudo `123`)

### 5.2 `accounts`
- `CREATE`: `{ "name", "description", "type", "currencyId", "balance" }`
- `UPDATE`: `{ "id", "name", "description", "type", "currencyId" }`
- `DELETE`/`RESTORE`: `{ "id": 123 }`

`type` recomendado por nombre:
- `PHYSICAL`
- `VIRTUAL`

### 5.3 `transactionCategories`
- `CREATE`: `{ "name", "description", "type" }`
- `UPDATE`: `{ "id", "name", "description", "type" }`
- `DELETE`/`RESTORE`: `{ "id": 123 }`

`type` recomendado por nombre:
- `OUT`
- `IN`

### 5.4 `transactions`
- `CREATE`: `{ "accountId", "categoryId", "amount", "date", "description" }`
- `UPDATE`: `{ "id", "accountId", "categoryId", "amount", "date", "description" }`
- `DELETE`/`RESTORE`: `{ "id": 123 }`

### 5.5 `userDashboardConfigs`
- `CREATE`: `{ "title", "type", "config", "position" }`
- `UPDATE`: `{ "id", "title", "config", "position" }`
- `DELETE`: `{ "id": 123 }`
- `RESTORE`: no soportado (responde error por item)

`type` recomendado por nombre:
- `TRANSACTION_TYPE`
- `WEEKLY_SPENT`

### 5.6 `profile`
- `CREATE`: `{ "name" }`
- `UPDATE`: `{ "id", "name" }`
- `DELETE`/`RESTORE`: no soportado (responde error por item)

### 5.7 `subscriptions`
- Definido en enums de sync, pero no soportado en MVP (responde error por item).

## 6. Errores HTTP esperados
- `400`: validaciones de request, sesion no abierta, entidad/operacion invalida.
- `401`: token ausente/invalido/blacklisted.
- `404`: recurso/sesion no encontrado.
- `409`: conflicto de dispositivo (`SYNC_DEVICE_CONFLICT`).
- `500`: error no controlado.

Error por item en bulk:
```json
{
  "clientOperationId": "op-077",
  "code": "VALIDATION_ERROR",
  "message": "payload.id is required"
}
```

Codigos de error por item:
- `SYNC_DEVICE_CONFLICT`
- `VALIDATION_ERROR`
- `AUTH_ERROR`
- `INTERNAL_ERROR`

## 7. Socket (STOMP)
- Endpoint handshake: `/ws`
- User destination: `/user/queue/sync-status`

Eventos emitidos por backend:
- `SYNC_CONNECTION_ACK`
```json
{
  "event": "SYNC_CONNECTION_ACK",
  "connected": true,
  "serverTime": "2026-03-06T21:30:00",
  "lastSyncAt": "2026-03-06T21:00:00"
}
```
- `SYNC_SESSION_OPENED`
```json
{
  "event": "SYNC_SESSION_OPENED",
  "sessionId": "sync-...",
  "serverTime": "2026-03-06T21:30:01"
}
```
- `SYNC_BULK_PROGRESS`
```json
{
  "event": "SYNC_BULK_PROGRESS",
  "sessionId": "sync-...",
  "entity": "transactions",
  "applied": 80,
  "total": 120,
  "serverTime": "2026-03-06T21:31:00"
}
```
- `SYNC_SESSION_FINISHED`
```json
{
  "event": "SYNC_SESSION_FINISHED",
  "sessionId": "sync-...",
  "lastSyncAt": "2026-03-06T21:33:10",
  "serverTime": "2026-03-06T21:33:10"
}
```
- `SYNC_SESSION_ERROR`
```json
{
  "event": "SYNC_SESSION_ERROR",
  "sessionId": "sync-...",
  "code": "VALIDATION_ERROR",
  "message": "payload.id is required",
  "serverTime": "2026-03-06T21:32:00"
}
```

## 8. Recomendaciones de cliente
- Usar `clientOperationId` estable por cambio local (UUID), no regenerarlo en reintentos.
- Reintentar solo items fallidos (o toda la entidad) con nuevos `clientOperationId` segun estrategia.
- Si `start` da `409 SYNC_DEVICE_CONFLICT`, detener sincronizacion y pedir accion de usuario.
- Guardar `sessionId` activo localmente para completar `finish/cancel` tras reconexion.
- `clientUpdatedAt` hoy se acepta pero no altera la logica de merge en backend.

