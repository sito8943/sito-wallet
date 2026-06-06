# Debts API Frontend

Doc corta del modulo `debts` para consumo frontend.

## 0. Enums

### `direction`
- `0` = `RECEIVABLE`
- `1` = `PAYABLE`

### `status`
- `0` = `OPEN`
- `1` = `PARTIALLY_PAID`
- `2` = `PAID`
- `3` = `CANCELLED`

## 1. DTOs

### `DebtDTO`
```json
{
  "id": 15,
  "counterpartyName": "Juan Perez",
  "counterpartyContact": "juan@email.com",
  "title": "Prestamo mayo",
  "description": "Devuelve en dos partes",
  "direction": 0,
  "status": 1,
  "originalAmount": 150.00,
  "pendingAmount": 50.00,
  "currency": {
    "id": 1,
    "name": "Euro",
    "symbol": "EUR"
  },
  "issuedAt": "2026-06-01T10:00:00",
  "dueAt": "2026-06-30T23:59:59",
  "closedAt": null,
  "createdAt": "2026-06-01T10:00:00",
  "updatedAt": "2026-06-10T12:00:00",
  "deletedAt": null
}
```

### `CommonDebtDTO`
```json
{
  "id": 15,
  "name": "Prestamo mayo",
  "counterpartyName": "Juan Perez",
  "direction": 0,
  "status": 1,
  "pendingAmount": 50.00,
  "dueAt": "2026-06-30T23:59:59"
}
```

### `DebtPaymentDTO`
```json
{
  "id": 77,
  "debtId": 15,
  "amount": 100.00,
  "paidAt": "2026-06-10T12:00:00",
  "note": "Pago parcial",
  "transactionId": 88,
  "createdAt": "2026-06-10T12:00:00",
  "updatedAt": "2026-06-10T12:00:00",
  "deletedAt": null
}
```

### `PageResponse<T>`
```json
{
  "items": [],
  "currentPage": 0,
  "pageSize": 20,
  "totalElements": 0,
  "totalPages": 0
}
```

## 2. CRUD debts

### `POST /debts`
- Body:
```json
{
  "counterpartyName": "Juan Perez",
  "counterpartyContact": "juan@email.com",
  "title": "Prestamo mayo",
  "description": "Devuelve en dos partes",
  "direction": "RECEIVABLE",
  "originalAmount": 150.00,
  "currencyId": 1,
  "issuedAt": "2026-06-01T10:00:00",
  "dueAt": "2026-06-30T23:59:59"
}
```
- Response `200`:
```json
15
```
- Reglas:
  - `counterpartyName`, `title`, `direction`, `originalAmount`, `currencyId`, `issuedAt` son obligatorios.
  - `originalAmount > 0`.

### `POST /debts/batch`
- Body: `CreateDebtCommand[]`
- Response `200`:
```json
3
```

### `PATCH /debts/{id}`
- Body: parcial. Solo manda los campos que quieras actualizar.
```json
{
  "counterpartyName": "Juan P.",
  "title": "Prestamo junio",
  "description": "Actualizado",
  "direction": "PAYABLE",
  "originalAmount": 200.00,
  "currencyId": 2,
  "issuedAt": "2026-06-01T10:00:00",
  "dueAt": "2026-07-10T00:00:00"
}
```
- Response `200`:
```json
15
```
- Reglas:
  - Si ya hay pagos activos, no deja cambiar `direction`.
  - Si cambias `originalAmount`, no puede quedar por debajo de lo ya pagado.
  - `dueAt` solo se actualiza si mandas un valor no nulo.

### `PATCH /debts/batch`
- Body: `UpdateDebtCommand[]`
- Response `200`:
```json
2
```

### `DELETE /debts`
- Body:
```json
[15, 16]
```
- Response `200`:
```json
2
```
- Soft delete.

### `PATCH /debts/restore`
- Body:
```json
[15, 16]
```
- Response `200`:
```json
2
```

### `PATCH /debts/{id}/cancel`
- Body: none
- Response `200`:
```json
15
```
- Regla:
  - marca la deuda como `CANCELLED`.

## 3. Reads debts

### `GET /debts`
- Response: `PageResponse<DebtDTO>`
- Query base:
  - `page`
  - `pageSize`
  - `sort`
  - `order=ASC|DESC`
  - `softDeleteScope=ACTIVE|DELETED|ALL`
  - `filters`

- Filtros soportados:
  - `id`
  - `currencyId`
  - `direction`
  - `status`
  - `dueAt`
  - `issuedAt`
  - `counterpartyName`

- Ejemplo:
```http
GET /debts?softDeleteScope=ACTIVE&filters=direction==RECEIVABLE,status==OPEN,dueAt>=2026-06-01T00:00:00,dueAt<=2026-06-30T23:59:59&page=0&pageSize=20&sort=issuedAt&order=DESC
```

- Notas:
  - En `filters`, `direction` y `status` aceptan nombre o codigo.
  - `counterpartyName` hace contains ignore case.

### `GET /debts/common`
- Response: `CommonDebtDTO[]`
- Query:
  - `filters`
  - `softDeleteScope` no aplica en la practica para common; devuelve activos.

### `GET /debts/export`
- Response: `DebtDTO[]`
- Query: mismos filtros que `GET /debts`.

### `GET /debts/{id}`
- Response: `DebtDTO`

## 4. Payments

### `GET /debts/{debtId}/payments`
- Response: `PageResponse<DebtPaymentDTO>`
- Query base:
  - `page`
  - `pageSize`
  - `sort`
  - `order=ASC|DESC`
  - `softDeleteScope=ACTIVE|DELETED|ALL`
  - `filters`

- Filtros soportados:
  - `id`
  - `paidAt`

- Ejemplo:
```http
GET /debts/15/payments?filters=paidAt>=2026-06-01T00:00:00,paidAt<=2026-06-30T23:59:59&page=0&pageSize=20&sort=paidAt&order=DESC
```

### `POST /debts/{debtId}/payments`
- Body:
```json
{
  "amount": 100.00,
  "paidAt": "2026-06-10T12:00:00",
  "note": "Pago parcial",
  "autoCreateTransaction": true,
  "accountId": 3,
  "categoryId": 8
}
```
- Response `200`: `DebtPaymentDTO`
```json
{
  "id": 77,
  "debtId": 15,
  "amount": 100.00,
  "paidAt": "2026-06-10T12:00:00",
  "note": "Pago parcial",
  "transactionId": 88,
  "createdAt": "2026-06-10T12:00:00",
  "updatedAt": "2026-06-10T12:00:00",
  "deletedAt": null
}
```
- Reglas:
  - `amount > 0`
  - `amount <= pendingAmount`
  - no deja pagar deudas `PAID`
  - no deja pagar deudas `CANCELLED`
  - `autoCreateTransaction` default `false`
  - si `autoCreateTransaction=true`, `accountId` es obligatorio
  - si `autoCreateTransaction=true` y no mandas `categoryId`, backend usa:
    - `debt-payment-in` para `RECEIVABLE`
    - `debt-payment-out` para `PAYABLE`
  - si mandas `categoryId`, debe coincidir con el tipo:
    - `RECEIVABLE` -> categoria `IN`
    - `PAYABLE` -> categoria `OUT`
  - la transaccion automatica queda con `auto=true`
  - `transactionId` viene en response si se creo transaccion

### `DELETE /debts/{debtId}/payments/{paymentId}`
- Body: none
- Response `200`:
```json
1
```
- Efecto:
  - soft delete del payment
  - si tenia transaccion automatica asociada, tambien la revierte y la borra soft
  - recalcula `pendingAmount` y `status` de la deuda

## 5. Errores utiles para frontend

### Feature flags
- `debts.featureDisabled`
- `transactions.featureDisabled`

### Validacion de debt
- `counterpartyName is required`
- `title is required`
- `direction is required`
- `currencyId is required`
- `issuedAt is required`
- `originalAmount must be greater than 0`
- `originalAmount must be greater than or equal to paid amount`
- `direction cannot be changed when payments exist`

### Validacion de payment
- `amount must be greater than 0`
- `amount must be less than or equal to pendingAmount`
- `paidAt is required`
- `accountId is required when autoCreateTransaction=true`
- `Debt payment category must match transaction type`
- `Cannot create payment for paid debt`
- `Cannot create payment for canceled debt`

### Not found / ownership
- `Debt not found with id: {id}`
- `Debt payment not found with id: {id}`
- `account not found`
- `currency not found`
- `category not found`

## 6. Notas frontend

- Todas las rutas requieren auth JWT como el resto del backend.
- `userId` no se manda en create/update; backend usa el usuario autenticado.
- El frontend puede asumir que `pendingAmount` y `status` vienen ya recalculados por backend.
- Si necesitas mostrar texto por enum:
  - `direction`: `RECEIVABLE = Me deben`, `PAYABLE = Yo debo`
  - `status`: `OPEN`, `PARTIALLY_PAID`, `PAID`, `CANCELLED`
