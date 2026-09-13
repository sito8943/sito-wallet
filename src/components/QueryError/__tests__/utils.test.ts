import { describe, expect, it } from "vitest";

import { CHUNK_LOAD_ERROR_KEY, OFFLINE_ERROR_KEY } from "../constants";
import {
  getErrorMessageKey,
  isChunkLoadError,
  isNetworkError,
  toError,
} from "../utils";

const CHROME_CHUNK_ERROR = new Error(
  "Failed to fetch dynamically imported module: https://localhost:5173/src/views/Transactions/sections/WeeklySummarySection.tsx",
);
const SAFARI_CHUNK_ERROR = new Error("Importing a module script failed.");
const CHROME_FETCH_ERROR = new Error("Failed to fetch");
const SAFARI_FETCH_ERROR = new Error("Load failed");
const SERVER_ERROR = new Error("Transaction not found");

describe("toError", () => {
  it("passes an Error through", () => {
    expect(toError(SERVER_ERROR)).toBe(SERVER_ERROR);
  });

  it("wraps a thrown string", () => {
    expect(toError("boom")?.message).toBe("boom");
  });

  it("gives up on anything else", () => {
    expect(toError(undefined)).toBeNull();
    expect(toError({ message: "nope" })).toBeNull();
  });
});

describe("isNetworkError", () => {
  it("matches each engine's fetch failure", () => {
    expect(isNetworkError(CHROME_FETCH_ERROR)).toBe(true);
    expect(isNetworkError(SAFARI_FETCH_ERROR)).toBe(true);
  });

  it("ignores an ordinary server error", () => {
    expect(isNetworkError(SERVER_ERROR)).toBe(false);
    expect(isNetworkError(null)).toBe(false);
  });
});

describe("isChunkLoadError", () => {
  it("matches each engine's dynamic import failure", () => {
    expect(isChunkLoadError(CHROME_CHUNK_ERROR)).toBe(true);
    expect(isChunkLoadError(SAFARI_CHUNK_ERROR)).toBe(true);
  });

  it("ignores a plain fetch failure", () => {
    expect(isChunkLoadError(CHROME_FETCH_ERROR)).toBe(false);
  });
});

describe("getErrorMessageKey", () => {
  it("blames the connection for anything thrown while offline", () => {
    expect(getErrorMessageKey(CHROME_CHUNK_ERROR, false)).toBe(
      OFFLINE_ERROR_KEY,
    );
    expect(getErrorMessageKey(SERVER_ERROR, false)).toBe(OFFLINE_ERROR_KEY);
  });

  it("blames the chunk when the import fails while online", () => {
    // The message also reads "Failed to fetch", so order matters here.
    expect(getErrorMessageKey(CHROME_CHUNK_ERROR, true)).toBe(
      CHUNK_LOAD_ERROR_KEY,
    );
  });

  it("blames the connection for a bare fetch failure while online", () => {
    expect(getErrorMessageKey(SAFARI_FETCH_ERROR, true)).toBe(
      OFFLINE_ERROR_KEY,
    );
  });

  it("keeps the raw message for a real server error", () => {
    expect(getErrorMessageKey(SERVER_ERROR, true)).toBeNull();
  });
});
