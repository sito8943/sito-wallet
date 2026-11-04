import { afterEach, describe, expect, it } from "vitest";
import { toLocal } from "@sito/dashboard-app";

import { config } from "../../../config";
import { withStoredRefreshToken } from "../authAccountSnapshot";

const session = { id: 1, token: "access" };

describe("withStoredRefreshToken", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("keeps the stored refresh token when the session has none", () => {
    toLocal(config.auth.refreshTokenKey, "stored-refresh");

    expect(withStoredRefreshToken({ ...session, refreshToken: null })).toEqual({
      ...session,
      refreshToken: "stored-refresh",
    });
  });

  it("prefers the refresh token the session brings", () => {
    toLocal(config.auth.refreshTokenKey, "stored-refresh");

    expect(
      withStoredRefreshToken({ ...session, refreshToken: "new-refresh" }),
    ).toEqual({ ...session, refreshToken: "new-refresh" });
  });

  it("leaves the session as is without a stored token", () => {
    expect(withStoredRefreshToken(session)).toEqual(session);
  });
});
