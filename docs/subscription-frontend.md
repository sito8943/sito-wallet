# Subscription Manager - Frontend Integration

## Base
- Base URL: usa tu `API_URL` actual.
- Auth: todos los endpoints requieren `Authorization: Bearer <token>`.
- Recursos:
  - `/subscription-providers`
  - `/subscriptions`

## Feature flag
- Flag de bootstrap: `subscriptionsEnabled` en `GET /app/features`.
- Si esta en `false`, ocultar rutas/menus de subscriptions.
- Si frontend llama igual, backend responde `400` con `subscriptions.featureDisabled`.

Ejemplo:
```json
{
  "features": {
    "balanceGreaterThanZero": false,
    "currenciesEnabled": true,
    "accountsEnabled": true,
    "transactionsEnabled": true,
    "subscriptionsEnabled": true
  }
}
```

## Enums y codigos

### `SubscriptionBillingUnit`
- `DAY` = `0`
- `MONTH` = `1`
- `YEAR` = `2`

### `SubscriptionStatus`
- `ACTIVE` = `0`
- `PAUSED` = `1`
- `CANCELED` = `2`

Notas:
- En body JSON, enviar nombres (`"MONTH"`, `"ACTIVE"`) para evitar ambiguedad.
- En filtros de query (`filters=...`) backend acepta nombre y codigo.

## Subscription Providers

### 1) Crear provider
- `POST /subscription-providers`
- Body:
```json
{
  "name": "Netflix",
  "description": "Streaming",
  "website": "https://www.netflix.com",
  "image": "https://cdn.example.com/providers/netflix.png",
  "enabled": true
}
```
- Response `200`: `id` (`number`).

### 2) Crear provider en lote
- `POST /subscription-providers/batch`
- Body: `CreateSubscriptionProviderCommand[]`
- Response `200`: cantidad creada (`number`).

### 3) Actualizar provider
- `PATCH /subscription-providers/{id}`
- Body (importante: backend valida `id` en body):
```json
{
  "id": 7,
  "name": "Netflix",
  "description": "Streaming plans",
  "website": "https://www.netflix.com",
  "image": "https://cdn.example.com/providers/netflix-v2.png",
  "enabled": true
}
```
- Response `200`: `id` (`number`).
- `name` es obligatorio tambien en update.

### 4) Soft delete / restore provider
- `DELETE /subscription-providers`
- `PATCH /subscription-providers/restore`
- Body en ambos: `Long[]` (ejemplo: `[7, 8]`)

### 5) Listados provider
- `GET /subscription-providers` -> `PageResponse<SubscriptionProviderDTO>`
- `GET /subscription-providers/common` -> `CommonSubscriptionProviderDTO[]`
- `GET /subscription-providers/export` -> `SubscriptionProviderDTO[]`
- `GET /subscription-providers/{id}` -> `SubscriptionProviderDTO`

Filtros utiles en `GET /subscription-providers` / `export`:
- `softDeleteScope=ACTIVE|DELETED|ALL`
- `filters=enabled==true`
- `filters=id>=1,id<=100`

Nota:
- Para selects de alta de suscripciones, usar `GET /subscription-providers/common?filters=enabled==true` para no ofrecer providers deshabilitados.

## Subscriptions

### 1) Crear subscription
- `POST /subscriptions`
- Body:
```json
{
  "name": "Netflix Premium",
  "description": "4K plan",
  "providerId": 7,
  "accountId": 12,
  "currencyId": 1,
  "amount": 19.99,
  "billingFrequency": 1,
  "billingUnit": "MONTH",
  "startsAt": "2026-01-15T10:00:00",
  "endsAt": "2026-12-31T23:59:59",
  "lastPaidAt": "2026-04-15T10:00:00",
  "status": "ACTIVE",
  "autoCreateTransaction": true,
  "notificationEnabled": true,
  "notificationDaysBefore": 3
}
```
- Response `200`: `id` (`number`).

Reglas clave:
- `providerId` requerido y provider debe estar habilitado.
- `amount > 0`.
- `billingFrequency >= 1`.
- `billingUnit` requerido.
- `startsAt` requerido.
- `endsAt` es opcional. Si se envia, debe ser `>= startsAt`.
- `autoCreateTransaction` es opcional (default `false`).
- Si `autoCreateTransaction=true`, `accountId` es obligatorio (`> 0`).
- Si se envia `accountId`, la cuenta debe existir, no estar borrada y pertenecer al usuario.
- Si `notificationEnabled=true`, `notificationDaysBefore` es requerido en rango `0..30`.
- Si `notificationEnabled` no se envia, backend lo interpreta como `false`.
- Si `status=CANCELED`, backend deja `nextRenewalAt = null`.
- Si el siguiente ciclo cae despues de `endsAt`, backend deja `nextRenewalAt = null`.
- `userId` no hace falta enviarlo desde UI (backend lo resuelve por token).

### 2) Crear en lote
- `POST /subscriptions/batch`
- Body: `CreateSubscriptionCommand[]`
- Response `200`: cantidad creada (`number`).

### 3) Actualizar subscription
- `PATCH /subscriptions/{id}`
- Body (backend usa `id` del body):
```json
{
  "id": 15,
  "name": "Netflix Premium",
  "amount": 21.99,
  "billingFrequency": 1,
  "billingUnit": "MONTH",
  "accountId": 12,
  "endsAt": "2026-12-31T23:59:59",
  "status": "PAUSED",
  "autoCreateTransaction": true,
  "notificationEnabled": false
}
```
- Response `200`: `id` (`number`).

Notas:
- En update se aplican solo campos enviados (no null).
- Para desasociar cuenta, enviar `accountId: 0` (o negativo).
- `endsAt` solo se actualiza cuando llega valor no null (no se limpia con `null` en el contrato actual).
- Si `notificationEnabled=false`, backend fuerza `notificationDaysBefore=null`.
- En el contrato actual `PATCH /subscriptions/{id}` exige `id` en body (`id is required`).

### 4) Soft delete / restore subscription
- `DELETE /subscriptions`
- `PATCH /subscriptions/restore`
- Body en ambos: `Long[]` (ejemplo: `[15, 16]`)

### 5) Listados subscription
- `GET /subscriptions` -> `PageResponse<SubscriptionDTO>`
- `GET /subscriptions/common` -> `CommonSubscriptionDTO[]`
- `GET /subscriptions/export` -> `SubscriptionDTO[]`
- `GET /subscriptions/{id}` -> `SubscriptionDTO`

#### Filtros en `GET /subscriptions` / `export`
- `softDeleteScope=ACTIVE|DELETED|ALL`
- `providerId=7`
- `currencyId=1`
- `filters=status==ACTIVE`
- `filters=billingUnit==MONTH`
- `filters=amount>=10,amount<=100`
- `filters=nextRenewalAt>=2026-04-01T00:00:00,nextRenewalAt<=2026-04-30T23:59:59`

Ejemplo:
```http
GET /subscriptions?softDeleteScope=ACTIVE&filters=status==ACTIVE,billingUnit==MONTH,nextRenewalAt>=2026-04-01T00:00:00,nextRenewalAt<=2026-04-30T23:59:59&page=0&pageSize=20&sort=nextRenewalAt&order=ASC
```

## Billing Logs

### 1) Crear billing log
- `POST /subscriptions/{id}/billing-logs`
- Body:
```json
{
  "amount": 19.99,
  "paidAt": "2026-04-15T10:00:00",
  "currencyId": 1,
  "note": "Pago tarjeta VISA"
}
```
- Response `200`: `id` del billing log.

Reglas:
- No permite logs para subscriptions `CANCELED`.
- Recalcula `lastPaidAt` y `nextRenewalAt` en la subscription.
- Si no envias `currencyId`, el log hereda la moneda de la suscripcion.
- Si `autoCreateTransaction=true` en la subscription, backend crea una transaccion automatica por cada renewal:
  - `auto=true`
  - `account = subscription.account`
  - `amount/date` desde el billing log
  - `description = note` o fallback `Renewal: {subscriptionName}`
  - categoria auto OUT: `subscription-auto-renewal` (la crea si no existe)
- Si `autoCreateTransaction=true` y no hay cuenta asociada, falla con `accountId is required when autoCreateTransaction=true`.
- Si `transactionsEnabled=false` y hay auto-transaccion, falla con `transactions.featureDisabled`.

### 2) Listar billing logs
- `GET /subscriptions/{id}/billing-logs`
- Response: `PageResponse<SubscriptionBillingLogDTO>`
- Filtros:
  - `softDeleteScope=ACTIVE|DELETED|ALL`
  - `filters=paidAt>=2026-01-01T00:00:00,paidAt<=2026-12-31T23:59:59`

## Renewals (para Calendar/UI)
- `GET /subscriptions/renewals?from=...&to=...`

Ejemplo:
```http
GET /subscriptions/renewals?from=2026-04-01T00:00:00&to=2026-04-30T23:59:59
```

Respuesta:
```json
[
  {
    "subscriptionId": 15,
    "subscriptionName": "Netflix Premium",
    "providerName": "Netflix",
    "amount": 19.99,
    "currency": "USD",
    "nextRenewalAt": "2026-04-30T10:00:00"
  }
]
```

Reglas:
- Si no envias `from`, backend usa `now`.
- Si no envias `to`, backend usa `from + 30 dias`.
- Si `to < from`, backend responde `400` con `to must be greater than or equal to from`.
- Solo devuelve subscriptions `ACTIVE` y no borradas.

## Forma de respuesta

### `SubscriptionDTO` (lectura)
```json
{
  "id": 15,
  "name": "Netflix Premium",
  "description": "4K plan",
  "provider": {
    "id": 7,
    "name": "Netflix",
    "image": "https://cdn.example.com/providers/netflix.png"
  },
  "account": {
    "id": 12,
    "name": "BBVA Debit",
    "currency": {
      "id": 1,
      "name": "USD"
    }
  },
  "currency": {
    "id": 1,
    "name": "USD"
  },
  "amount": 19.99,
  "billingFrequency": 1,
  "billingUnit": 1,
  "startsAt": "2026-01-15T10:00:00",
  "endsAt": "2026-12-31T23:59:59",
  "lastPaidAt": "2026-04-15T10:00:00",
  "nextRenewalAt": "2026-05-15T10:00:00",
  "status": 0,
  "autoCreateTransaction": true,
  "notificationEnabled": true,
  "notificationDaysBefore": 3,
  "updatedAt": "2026-04-12T18:20:10",
  "deletedAt": null
}
```

### `PageResponse<T>`
```json
{
  "items": [],
  "currentPage": 0,
  "pageSize": 20,
  "totalElements": 120,
  "totalPages": 6
}
```

## Errores frecuentes para UI
- `subscriptions.featureDisabled`
- `name is required`
- `providerId is required`
- `provider not found`
- `provider is disabled`
- `currency not found`
- `account not found`
- `amount must be greater than zero`
- `billingFrequency must be greater than zero`
- `billingUnit is required`
- `startsAt is required`
- `endsAt must be greater than or equal to startsAt`
- `accountId is required when autoCreateTransaction=true`
- `notificationDaysBefore is required when notificationEnabled=true`
- `notificationDaysBefore must be between 0 and 30`
- `id is required`
- `Cannot create billing log for canceled subscription`
- `transactions.featureDisabled`
- `to must be greater than or equal to from`
- `Subscription not found with id: {id}`

## Tipos sugeridos (TypeScript)

```ts
export type SubscriptionBillingUnit = "DAY" | "MONTH" | "YEAR";
export type SubscriptionStatus = "ACTIVE" | "PAUSED" | "CANCELED";

export type AppFeatures = {
  balanceGreaterThanZero: boolean;
  currenciesEnabled: boolean;
  accountsEnabled: boolean;
  transactionsEnabled: boolean;
  subscriptionsEnabled: boolean;
};

export interface CommonRef {
  id: number;
  name: string;
}

export interface CommonCurrencyDTO extends CommonRef {
  symbol?: string | null;
}

export interface CommonSubscriptionProviderDTO extends CommonRef {
  image?: string | null;
}

export interface CommonAccountDTO extends CommonRef {
  currency?: CommonCurrencyDTO | null;
}

export interface SubscriptionProviderDTO extends CommonRef {
  description?: string | null;
  website?: string | null;
  image?: string | null;
  enabled: boolean;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface SubscriptionDTO {
  id: number;
  name: string;
  description?: string | null;
  provider: CommonSubscriptionProviderDTO | null;
  account: CommonAccountDTO | null;
  currency: CommonCurrencyDTO | null;
  amount: number;
  billingFrequency: number;
  billingUnit: number; // 0 DAY, 1 MONTH, 2 YEAR
  startsAt: string;
  endsAt?: string | null;
  lastPaidAt?: string | null;
  nextRenewalAt?: string | null;
  status: number; // 0 ACTIVE, 1 PAUSED, 2 CANCELED
  autoCreateTransaction: boolean;
  notificationEnabled: boolean;
  notificationDaysBefore?: number | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
}

export interface CreateSubscriptionCommand {
  name: string;
  description?: string | null;
  providerId: number;
  accountId?: number | null;
  currencyId?: number | null;
  amount: number;
  billingFrequency: number;
  billingUnit: SubscriptionBillingUnit;
  startsAt: string;
  endsAt?: string | null;
  lastPaidAt?: string | null;
  status?: SubscriptionStatus;
  autoCreateTransaction?: boolean;
  notificationEnabled?: boolean;
  notificationDaysBefore?: number | null;
}

export interface UpdateSubscriptionCommand extends Partial<CreateSubscriptionCommand> {
  id: number;
}

export interface CreateSubscriptionBillingLogCommand {
  amount: number;
  paidAt: string;
  currencyId?: number | null;
  note?: string | null;
}

export interface SubscriptionRenewalDTO {
  subscriptionId: number;
  subscriptionName: string;
  providerName: string;
  amount: number;
  currency?: string | null;
  nextRenewalAt: string;
}

export interface PageResponse<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
```

## Checklist de integracion frontend
1. Cargar y validar `subscriptionsEnabled` antes de mostrar el modulo.
2. Para formularios create/update, validar reglas locales (`amount`, `billingFrequency`, `notificationDaysBefore`, `endsAt >= startsAt`).
3. En `PATCH /{id}`, enviar tambien `id` en body para alinear contrato actual.
4. Usar providers de `GET /subscription-providers/common` para selects.
5. Si `autoCreateTransaction=true`, obligar seleccion de `accountId`.
6. Usar `GET /subscriptions/renewals` para agenda/lista de proximas renovaciones.
7. Deshabilitar UI de crear billing log cuando status sea `CANCELED`.
