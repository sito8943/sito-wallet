# Transactions Multi Categories - Frontend Integration

## Base
- Base URL: usa tu `API_URL` actual.
- Auth: todos los endpoints de `transactions` requieren `Authorization: Bearer <token>`.
- Recurso: `/transactions`.

## Cambio de contrato (resumen)
- Request (nuevo recomendado): usar `categoryIds: number[]`.
- Request (legacy compatible): `categoryId: number` sigue funcionando.
- Response (nuevo recomendado): leer `categories: CommonTransactionCategoryDTO[]`.
- Response (legacy compatible): `category: CommonTransactionCategoryDTO` se mantiene como fallback.

## Reglas funcionales importantes
- Debe existir al menos una categoría (`categoryIds` o `categoryId`).
- Todas las categorías enviadas deben existir.
- Todas las categorías de una transacción deben compartir el mismo tipo (`IN` o `OUT`).
- `PATCH /transactions/assign-category` reemplaza el set completo de categorías de cada transacción.
- Backend devuelve errores en texto plano (por ejemplo `categoryIds are required`).

## Endpoints impactados

### 1) Crear transacción
- `POST /transactions`
- Body recomendado:
```json
{
  "accountId": 12,
  "amount": 49.9,
  "date": "2026-04-12T10:30:00",
  "description": "Compra semanal",
  "categoryIds": [101, 102]
}
```
- Body legacy (aún válido):
```json
{
  "accountId": 12,
  "amount": 49.9,
  "date": "2026-04-12T10:30:00",
  "description": "Compra semanal",
  "categoryId": 101
}
```
- Respuesta `200`:
```json
55
```

### 2) Actualizar transacción
- `PATCH /transactions/{id}`
- Body recomendado:
```json
{
  "id": 55,
  "accountId": 12,
  "amount": 59.9,
  "date": "2026-04-12T11:00:00",
  "description": "Compra semanal (ajustada)",
  "categoryIds": [101, 102]
}
```
- Respuesta `200`: `id` (`number`).

### 3) Reasignar categorías en lote
- `PATCH /transactions/assign-category`
- Body recomendado:
```json
{
  "transactionIds": [55, 56, 57],
  "categoryIds": [201, 202]
}
```
- Body legacy (aún válido):
```json
{
  "transactionIds": [55, 56, 57],
  "categoryId": 201
}
```
- Respuesta `200`: `number` (cantidad actualizada).
- Header útil: `X-Assign-Category-Message`.

### 4) Importación / preview
- `POST /transactions/import/process` (JSON o multipart)
- `POST /transactions/import`
- Para JSON, cada item `TransactionDTO` soporta:
  - `categories` (nuevo recomendado),
  - `category` (fallback legacy).

## Respuesta de lectura (`GET /transactions`, `GET /transactions/{id}`, `GET /transactions/export`)

Ejemplo de `TransactionDTO`:
```json
{
  "id": 55,
  "auto": false,
  "categories": [
    { "id": 101, "name": "Food", "type": 0, "auto": false, "color": "#22AA66" },
    { "id": 102, "name": "Home", "type": 0, "auto": false, "color": "#3366FF" }
  ],
  "category": { "id": 101, "name": "Food", "type": 0, "auto": false, "color": "#22AA66" },
  "account": { "id": 12, "name": "Main Account" },
  "amount": 49.9,
  "date": "2026-04-12T10:30:00",
  "description": "Compra semanal",
  "updatedAt": "2026-04-12T10:30:10",
  "deletedAt": null
}
```

Nota:
- `category` sigue presente para compatibilidad.
- Frontend debe priorizar `categories`.

## Tipos sugeridos (TypeScript)

```ts
export interface CommonTransactionCategoryDTO {
  id: number;
  name: string;
  type: number; // 0=OUT, 1=IN
  auto: boolean;
  color?: string | null;
}

export interface TransactionDTO {
  id: number;
  auto: boolean;
  categories?: CommonTransactionCategoryDTO[] | null;
  category?: CommonTransactionCategoryDTO | null; // legacy
  account: { id: number; name?: string | null } | null;
  amount: number;
  date: string | null;
  description: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface CreateTransactionRequest {
  accountId: number;
  amount: number;
  date?: string | null;
  description?: string | null;
  categoryIds?: number[];
  categoryId?: number; // legacy
}

export interface UpdateTransactionRequest extends CreateTransactionRequest {
  id: number;
}

export interface AssignTransactionCategoryRequest {
  transactionIds: number[];
  categoryIds?: number[];
  categoryId?: number; // legacy
}
```

## Errores frecuentes para UI
- `400 categoryIds are required`
- `400 One or more categories were not found`
- `400 All categories of a transaction must share the same type`
- `400 transactionIds are required`
- `400 transactions.featureDisabled`
- `400 balance.greaterThan0` (si la flag de balance estricto está activa)

## Checklist de migración frontend
1. En create/update/assign-category enviar `categoryIds` (no `categoryId`).
2. En lecturas usar `categories` y dejar `category` solo como fallback.
3. En formularios bloquear mezcla de categorías `IN` + `OUT`.
4. En reasignación por lote tratar `categoryIds` como reemplazo total.
5. Manejar errores como texto plano en body.
