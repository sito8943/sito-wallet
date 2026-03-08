# Dashboard-App Auth Remember Me

## Status
Implemented in `@sito/dashboard-app` (current integration target in this repo).
This file is kept as a historical record and operational checklist.

## What is already implemented upstream
- `AuthDto` accepts `rememberMe`.
- `SessionDto` includes `refreshToken` and `accessTokenExpiresAt`.
- `AuthClient` supports `refresh()` and `logout()` with optional token revocation payload.
- `APIClient`/`BaseClient` include centralized refresh + single-flight mutex + one retry on `401`.
- `AuthProvider` supports auth storage key config:
  - `user`
  - `remember`
  - `refreshTokenKey`
  - `accessTokenExpiresAtKey`

## Integration rule (consumer apps)
Use a single shared auth key source and pass the same keys to both:
1. `IManager` / API clients
2. `AuthProvider`

Do not implement ad-hoc refresh logic in app code.

## Validation checklist
- [ ] Login without remember: no refresh token persisted.
- [ ] Login with remember: refresh token + expiration persisted.
- [ ] Expired access token: protected request refreshes and retries once.
- [ ] Sign-out: access token invalidated and refresh token revoked when provided.
- [ ] Offline sync reconnect: refresh happens first (if needed), then `/sync/status` and sync flow continue.
