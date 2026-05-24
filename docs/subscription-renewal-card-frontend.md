# Subscription Renewal Forecast — Dashboard Card

Base path: `/subscriptions`
Auth: `Authorization: Bearer <accessToken>` — authenticated user.
Feature flag: `features.subscriptions` must be enabled (server returns `403` otherwise).

This card projects upcoming subscription renewals over a window and aggregates totals per currency. The same endpoint can power both the flat list (`/renewals`) and the dashboard card with summary (`/renewals/forecast`).

Dashboard card type id: **`SUBSCRIPTION_MONTHLY_FORECAST`** (enum value in `DashboardCardType`).

---

## Models

### `CommonCurrencyDTO`

| Field    | Type           |
| -------- | -------------- |
| `id`     | number         |
| `name`   | string         |
| `symbol` | string \| null |

### `SubscriptionRenewalDTO`

| Field              | Type                        | Notes                                    |
| ------------------ | --------------------------- | ---------------------------------------- |
| `subscriptionId`   | number                      |                                          |
| `subscriptionName` | string                      |                                          |
| `providerName`     | string \| null              |                                          |
| `amount`           | number (decimal)            |                                          |
| `currency`         | `CommonCurrencyDTO` \| null | full common DTO (`id`, `name`, `symbol`) |
| `billingFrequency` | int \| null                 | e.g. `1`, `3`                            |
| `billingUnit`      | int \| null                 | `0` = DAY, `1` = MONTH, `2` = YEAR       |
| `nextRenewalAt`    | string (ISO date-time)      | projected occurrence inside `[from,to]`  |

> One subscription can appear multiple times in the response — once per projected renewal date inside the window.

### `SubscriptionRenewalTotalDTO`

| Field      | Type                        | Notes                                             |
| ---------- | --------------------------- | ------------------------------------------------- |
| `currency` | `CommonCurrencyDTO` \| null | groups totals by currency id (null = no currency) |
| `amount`   | number (decimal)            | sum of `amount` for that group                    |
| `count`    | int                         | how many renewals in that group                   |

### `SubscriptionRenewalForecastDTO`

| Field      | Type                            | Notes                               |
| ---------- | ------------------------------- | ----------------------------------- |
| `from`     | string (ISO date-time)          | resolved start of the window        |
| `to`       | string (ISO date-time)          | resolved end of the window          |
| `count`    | int                             | total renewals in the window        |
| `totals`   | `SubscriptionRenewalTotalDTO[]` | one entry per currency              |
| `renewals` | `SubscriptionRenewalDTO[]`      | sorted ascending by `nextRenewalAt` |

### `GetSubscriptionRenewalsQuery` (query params)

| Param            | Type                                | Notes                                                                                                              |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `subscriptionId` | number                              | optional — restrict to a single subscription                                                                       |
| `range`          | `RenewalRangePreset` enum           | optional preset (see below). Highest precedence.                                                                   |
| `timezone`       | string (IANA, e.g. `Europe/Madrid`) | optional — defaults to server zone. Used by `range` (and by default `from` when `from` is omitted) to anchor "now" |
| `month`          | string (`YYYY-MM`)                  | optional shortcut — sets window to that calendar month                                                             |
| `from`           | string (ISO date-time)              | optional — defaults to `now` (in `timezone`)                                                                       |
| `to`             | string (ISO date-time)              | optional — defaults to `from + 30 days`                                                                            |

Precedence: `range` > `month` > `from`/`to` > defaults.

#### `RenewalRangePreset` values

Week presets use **Sunday → Saturday** (project-wide convention, shared with `WeekUtils`).

| Value           | Window                                               |
| --------------- | ---------------------------------------------------- |
| `CURRENT_WEEK`  | Sunday 00:00 → Saturday 23:59:59 of the current week |
| `NEXT_WEEK`     | Sunday → Saturday of next week                       |
| `LAST_WEEK`     | Sunday → Saturday of previous week                   |
| `CURRENT_MONTH` | day 1 00:00 → last day 23:59:59 of the current month |
| `NEXT_MONTH`    | same shape, next month                               |
| `LAST_MONTH`    | same shape, previous month                           |
| `CURRENT_YEAR`  | Jan 1 00:00 → Dec 31 23:59:59 of the current year    |
| `NEXT_YEAR`     | same shape, next year                                |
| `LAST_YEAR`     | same shape, previous year                            |

"Current" is computed against `LocalDate.now(timezone)` — so passing `timezone=America/Mexico_City` from a CDMX client guarantees the week/month/year boundaries match the user's wall clock.

Rules:

- `userId` is taken from the JWT, do **not** send it.
- If `range` is set, `month` / `from` / `to` are ignored.
- If `month` is invalid (not `YYYY-MM`) → `400 month must use YYYY-MM format`.
- If `timezone` is not a valid IANA id → `400 Invalid timezone: <value>`.
- If `to < from` → `400 to must be greater than or equal to from`.

---

## Endpoints

### `GET /subscriptions/renewals` — flat list (existing)

Returns active subscriptions whose **next** renewal falls inside the window. Each subscription appears at most once (uses the subscription's stored `nextRenewalAt`).

**Query**: `GetSubscriptionRenewalsQuery`

**Response**: `200` — `SubscriptionRenewalDTO[]`

Use this for a simple "upcoming this month" list when you don't need projections beyond the next billing date.

---

### `GET /subscriptions/renewals/forecast` — card payload (new)

Returns **all** projected renewals inside the window, walking `billingFrequency` × `billingUnit` forward from each active subscription. Includes per-currency totals for the card summary.

**Query**: `GetSubscriptionRenewalsQuery`

**Response**: `200` — `SubscriptionRenewalForecastDTO`

Example requests:

```
GET /subscriptions/renewals/forecast?range=CURRENT_MONTH&timezone=Europe/Madrid
GET /subscriptions/renewals/forecast?range=NEXT_WEEK&timezone=America/Mexico_City
GET /subscriptions/renewals/forecast?range=CURRENT_YEAR
GET /subscriptions/renewals/forecast?month=2026-05
```

Example response:

```json
{
  "from": "2026-05-01T00:00:00",
  "to": "2026-05-31T23:59:59",
  "count": 3,
  "totals": [
    {
      "currency": { "id": 1, "name": "EUR", "symbol": "€" },
      "amount": 24.98,
      "count": 2
    },
    {
      "currency": { "id": 2, "name": "USD", "symbol": "$" },
      "amount": 12.0,
      "count": 1
    }
  ],
  "renewals": [
    {
      "subscriptionId": 7,
      "subscriptionName": "Spotify",
      "providerName": "Spotify AB",
      "amount": 12.99,
      "currency": { "id": 1, "name": "EUR", "symbol": "€" },
      "billingFrequency": 1,
      "billingUnit": 1,
      "nextRenewalAt": "2026-05-04T00:00:00"
    },
    {
      "subscriptionId": 12,
      "subscriptionName": "ChatGPT",
      "providerName": "OpenAI",
      "amount": 12.0,
      "currency": { "id": 2, "name": "USD", "symbol": "$" },
      "billingFrequency": 1,
      "billingUnit": 1,
      "nextRenewalAt": "2026-05-15T00:00:00"
    },
    {
      "subscriptionId": 7,
      "subscriptionName": "Spotify",
      "providerName": "Spotify AB",
      "amount": 11.99,
      "currency": { "id": 1, "name": "EUR", "symbol": "€" },
      "billingFrequency": 1,
      "billingUnit": 1,
      "nextRenewalAt": "2026-06-04T00:00:00"
    }
  ]
}
```

---

### `GET /subscriptions/{subscriptionId}/renewals` — per-subscription list (existing)

Same shape as `/renewals` but scoped to one subscription.

---

## Projection rules

A subscription is considered for projection only if:

- `nextRenewalAt` is set.
- `billingFrequency >= 1`.
- `billingUnit` is one of `DAY` / `MONTH` / `YEAR`.
- `status = ACTIVE` and `deletedAt is null`.
- `endsAt` is `null` **or** `endsAt > from`.

Stepping:

- The cursor starts at `nextRenewalAt`. If it is before `from`, it is advanced by `billingFrequency × billingUnit` until it reaches the window.
- Each occurrence inside `[from, to]` is emitted (skipping any after `endsAt`).

---

## Frontend integration sketch

```ts
type CommonCurrency = { id: number; name: string; symbol: string | null };

type RenewalForecast = {
  from: string;
  to: string;
  count: number;
  totals: { currency: CommonCurrency | null; amount: number; count: number }[];
  renewals: SubscriptionRenewal[];
};

async function loadMonthlyForecast(month: string): Promise<RenewalForecast> {
  const res = await api.get("/subscriptions/renewals/forecast", {
    params: { month },
  });
  return res.data;
}
```

Card rendering tips:

- Header: "Renewals in <month name>" with `count`.
- Body: one row per `totals` entry (`amount + currency`).
- Detail expand: list `renewals` grouped by day.

---

## Errors

| Status | When                                                      |
| ------ | --------------------------------------------------------- |
| `400`  | invalid `month` format / invalid `timezone` / `to < from` |
| `401`  | missing or invalid token                                  |
| `403`  | `features.subscriptions` flag disabled                    |
