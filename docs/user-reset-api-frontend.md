# User Reset — Admin API

Base path: `/users`
Auth: `Authorization: Bearer <accessToken>` — **`ROLE_ADMIN` required** (enforced by `/users/**` matcher in `SecurityConfig`).

Lets an admin "reboot" a user: wipe everything the user owns (accounts, transactions, categories, currencies, dashboard configs, subscriptions, sync sessions, refresh tokens, etc.) and reset the profile to defaults — while keeping the `User` row intact (including the `admin` flag, so an admin can reset themself).

> ⚠️ Destructive. With `hard=true` the data is **physically deleted** and cannot be restored.

---

## Models

### `ResetUserRequest` (body)

| Field  | Type    | Required | Notes                                                                 |
| ------ | ------- | -------- | --------------------------------------------------------------------- |
| `id`   | number  | no       | overwritten by the path `id`, can be omitted                          |
| `hard` | boolean | yes      | `true` → hard delete (DB DELETE). `false` → soft delete (`deletedAt`) |

---

## Endpoint

### `POST /users/{id}/reset` — wipe user-owned data

**Path**: `id` (long) — target user.
**Request body**: `ResetUserRequest`

```json
{ "hard": true }
```

**Response**: `200` — empty body.

Errors:

| Status | When                                                  |
| ------ | ----------------------------------------------------- |
| `401`  | missing or invalid token                              |
| `403`  | caller is not an admin                                |
| `500`  | `User not found with id: <id>` (no user matches `id`) |

---

## What gets wiped

Order (children → parents). `user_id` and child tables resolved through subqueries.

| Table                        | Scope                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `refresh_token`              | `user_id = :id`                                                                               |
| `sync_operation`             | sessions of `:id`                                                                             |
| `sync_session`               | `user_id = :id`                                                                               |
| `subscription_billing_log`   | subscriptions of `:id`                                                                        |
| `subscription_category_link` | subscriptions of `:id` (hard delete only — join table)                                        |
| `subscription`               | `user_id = :id`                                                                               |
| `subscription_provider`      | `user_id = :id` (only user-owned providers; global ones with `user_id IS NULL` are untouched) |
| `transaction_category_link`  | transactions of `:id` (hard delete only — join table)                                         |
| `transaction`                | via `account.user_id = :id`                                                                   |
| `account`                    | `user_id = :id`                                                                               |
| `transaction-category`       | `user_id = :id`                                                                               |
| `currency`                   | `user_id = :id`                                                                               |
| `user-dashboard-config`      | `user_id = :id`                                                                               |
| `user_entity_config`         | configs of the user's profile                                                                 |

Account balance: not recalculated — accounts are gone, so the cached balance is moot.

## What is preserved

- `user` row (incl. `admin`, `email`, `password`, `tokensValidAfter`).
- `profile` row is **reset in place** to defaults (not deleted):
  - `name` → user's `username`, or email prefix when username is null
  - `language` → `"en"`
  - `hideDeletedEntities` → `true`
  - `alreadyOnboarded` → `false`
  - `photo`, `lastSyncAt`, `deviceId` → `null`
- Global subscription providers (`user_id IS NULL`) — untouched.

---

## hard vs soft

| `hard`  | Mechanism                                           | Reversible?                                   | Side effects                                                                                      |
| ------- | --------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `true`  | Native `DELETE` statements per table                | No                                            | Frees disk, fully removes join-table rows. DB-level `ON DELETE CASCADE` also fires where defined. |
| `false` | JPQL `UPDATE ... SET deletedAt = CURRENT_TIMESTAMP` | Yes — restore by clearing `deletedAt` per row | Rows stay in tables; lists filtered by `RecordStatus.ACTIVE` will hide them.                      |

Soft mode does **not** rewrite `name_slug` (unlike `softDeleteBatch` on individual entities). If you need slug renaming, soft-delete each entity through its dedicated endpoint.

The whole operation runs inside one `@Transactional` boundary — all-or-nothing.

---

## Frontend integration sketch

```ts
async function resetUser(userId: number, hard: boolean): Promise<void> {
  await api.post(`/users/${userId}/reset`, { hard });
}
```

Recommended UX before calling:

1. Two-step confirmation, especially for `hard=true`.
2. Show what will be wiped (table above) and what stays (user + profile defaults).
3. Force re-login after a self-reset is not strictly required (the `User` row, `tokensValidAfter` and password are untouched), but `refresh_token` rows are gone — the next refresh will fail and force a fresh login.

---

## cURL examples

Hard reset another user:

```sh
curl -X POST https://api/.../users/42/reset \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hard": true}'
```

Soft reset self (admin):

```sh
curl -X POST https://api/.../users/7/reset \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hard": false}'
```
