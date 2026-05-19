# Users API

Base path: `/users`
Auth: `Authorization: Bearer <accessToken>` — **all endpoints require `ROLE_ADMIN`**.

---

## Models

### `UserDTO` (response)

| Field       | Type                           | Notes                         |
| ----------- | ------------------------------ | ----------------------------- |
| `username`  | string                         |                               |
| `password`  | string                         | hashed (BCrypt) — do not show |
| `email`     | string                         | unique                        |
| `admin`     | boolean                        | admin role flag               |
| `updatedAt` | string (ISO date-time)         |                               |
| `deletedAt` | string (ISO date-time) \| null | soft-delete marker            |

> ⚠️ `UserDTO` currently omits `id` and `createdAt`. Use `CommonUserDTO` (`/users/common`) if you need the id.

### `CommonUserDTO` (response)

| Field      | Type   |
| ---------- | ------ |
| `id`       | number |
| `username` | string |

### `CreateUserRequest` (body)

| Field      | Type    | Required | Notes                                       |
| ---------- | ------- | -------- | ------------------------------------------- |
| `email`    | string  | yes      | unique                                      |
| `password` | string  | yes      | plain text — server hashes via BCrypt       |
| `username` | string  | no       | auto-derived from email prefix when omitted |
| `admin`    | boolean | no       | default `false`                             |

### `UpdateUserRequest` (body)

| Field      | Type    | Required | Notes                       |
| ---------- | ------- | -------- | --------------------------- |
| `id`       | number  | yes      | target user id              |
| `email`    | string  | no       |                             |
| `password` | string  | no       | only re-hashed when present |
| `username` | string  | no       |                             |
| `admin`    | boolean | no       |                             |

### `GetUserRequest` (query, extends `IFilterDTO`)

Endpoint-specific query fields:

| Param      | Type   |
| ---------- | ------ |
| `username` | string |
| `email`    | string |
| `password` | string |

Inherited from `IFilterDTO`:

| Param             | Type                                                 | Default  |
| ----------------- | ---------------------------------------------------- | -------- |
| `page`            | int                                                  | `0`      |
| `pageSize`        | int                                                  | `99`     |
| `sort`            | string (field name)                                  | `"id"`   |
| `order`           | `ASC` \| `DESC`                                      | `DESC`   |
| `softDeleteScope` | `ACTIVE` \| `DELETED` \| `ALL`                       | `ACTIVE` |
| `deleted`         | boolean (shortcut → sets scope to `DELETED`)         | `false`  |
| `filters`         | comma list `field<op>value` (`==`,`>`,`>=`,`<`,`<=`) | `""`     |

Example: `?page=0&pageSize=20&sort=email&order=ASC&filters=id>=10,id<=50`

### `PageResponse<T>` (response wrapper)

| Field           | Type   |
| --------------- | ------ |
| `items`         | `T[]`  |
| `currentPage`   | number |
| `pageSize`      | number |
| `totalElements` | number |
| `totalPages`    | number |

---

## Endpoints

### `POST /users` — create one

**Request body**: `CreateUserRequest`

```json
{
  "email": "ada@example.com",
  "password": "s3cret",
  "username": "ada",
  "admin": false
}
```

**Response**: `200` — `Long` (new user id)

```json
42
```

---

### `POST /users/batch` — create many

**Request body**: `CreateUserRequest[]`

**Response**: `200` — `int` (created count)

```json
3
```

---

### `DELETE /users` — soft delete batch

**Request body**: `Long[]` (user ids)

```json
[10, 11, 12]
```

**Response**: `200` — `int` (deleted count)

---

### `PATCH /users/restore` — restore soft-deleted batch

**Request body**: `Long[]` (user ids)

**Response**: `200` — `int` (restored count)

---

### `PATCH /users/{id}` — update one

**Path**: `id` (long)
**Request body**: `UpdateUserRequest`

```json
{
  "id": 42,
  "email": "ada@new.com",
  "admin": true
}
```

**Response**: `200` — `Long` (updated id)

---

### `PATCH /users/batch` — update many

**Request body**: `UpdateUserRequest[]`

**Response**: `200` — `int` (updated count)

---

### `GET /users` — paginated list

**Query**: `GetUserRequest` (see above)

**Response**: `200` — `PageResponse<UserDTO>`

```json
{
  "items": [
    {
      "username": "ada",
      "password": "$2a$10$...",
      "email": "ada@example.com",
      "admin": true,
      "updatedAt": "2026-05-14T10:23:00",
      "deletedAt": null
    }
  ],
  "currentPage": 0,
  "pageSize": 99,
  "totalElements": 1,
  "totalPages": 1
}
```

---

### `GET /users/common` — minimal list

**Response**: `200` — `CommonUserDTO[]`

```json
[
  { "id": 42, "username": "ada" },
  { "id": 43, "username": "linus" }
]
```

---

### `GET /users/{id}` — get one

**Path**: `id` (long)

**Response**: `200` — `UserDTO`

```json
{
  "username": "ada",
  "password": "$2a$10$...",
  "email": "ada@example.com",
  "admin": true,
  "updatedAt": "2026-05-14T10:23:00",
  "deletedAt": null
}
```

---

## Error responses

Handled by `GlobalExceptionHandler`. Typical shape:

| Status | Cause                                     |
| ------ | ----------------------------------------- |
| `401`  | Missing / invalid / blacklisted JWT       |
| `403`  | Authenticated but not admin               |
| `404`  | User id not found                         |
| `409`  | Duplicate email                           |
| `400`  | Validation error in request body or query |

---

## Login response (related)

`POST /auth/login`, `/auth/register`, `/auth/refresh`, `/auth/session` return `AuthDto`:

| Field                  | Type                   |
| ---------------------- | ---------------------- |
| `id`                   | number                 |
| `username`             | string                 |
| `email`                | string                 |
| `admin`                | boolean                |
| `token`                | string                 |
| `refreshToken`         | string                 |
| `accessTokenExpiresAt` | string (ISO date-time) |

Frontend should store `admin` from this payload and use it to gate the users CRUD UI.
