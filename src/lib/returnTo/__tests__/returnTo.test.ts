import { beforeEach, describe, expect, it } from "vitest";

import { RETURN_TO_STORAGE_KEY, RETURN_TO_TTL_MS } from "../constants";
import {
  clearReturnTo,
  consumeReturnTo,
  isSafeReturnPath,
  peekReturnTo,
  saveReturnTo,
} from "../utils";

const CONSENT = "/oauth/consent?request=abc";

describe("isSafeReturnPath", () => {
  it.each([
    ["/", true],
    [CONSENT, true],
    ["/ai-agents#apps", true],
    ["", false],
    ["oauth/consent", false],
    ["//evil.com/x", false],
    ["/\\evil.com", false],
    ["https://evil.com", false],
    ["javascript:alert(1)", false],
    [42, false],
    [null, false],
  ])("%s → %s", (path, expected) => {
    expect(isSafeReturnPath(path)).toBe(expected);
  });
});

describe("return-to storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns the saved path once", () => {
    saveReturnTo(CONSENT, 1000);

    expect(consumeReturnTo(2000)).toBe(CONSENT);
    expect(consumeReturnTo(2000)).toBeNull();
  });

  it("is null when nothing was saved", () => {
    expect(consumeReturnTo()).toBeNull();
  });

  it("ignores unsafe paths", () => {
    saveReturnTo("//evil.com");

    expect(sessionStorage.getItem(RETURN_TO_STORAGE_KEY)).toBeNull();
    expect(consumeReturnTo()).toBeNull();
  });

  it("drops a stale path", () => {
    saveReturnTo(CONSENT, 0);

    expect(consumeReturnTo(RETURN_TO_TTL_MS + 1)).toBeNull();
    expect(sessionStorage.getItem(RETURN_TO_STORAGE_KEY)).toBeNull();
  });

  it("drops tampered or broken values", () => {
    sessionStorage.setItem(
      RETURN_TO_STORAGE_KEY,
      JSON.stringify({ path: "https://evil.com", savedAt: Date.now() }),
    );
    expect(consumeReturnTo()).toBeNull();

    sessionStorage.setItem(RETURN_TO_STORAGE_KEY, "{not json");
    expect(consumeReturnTo()).toBeNull();
    expect(sessionStorage.getItem(RETURN_TO_STORAGE_KEY)).toBeNull();
  });

  it("clears without reading", () => {
    saveReturnTo(CONSENT);
    clearReturnTo();

    expect(consumeReturnTo()).toBeNull();
  });
});

describe("peekReturnTo", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("reads without removing", () => {
    saveReturnTo(CONSENT, 1000);

    expect(peekReturnTo(2000)).toBe(CONSENT);
    expect(peekReturnTo(2000)).toBe(CONSENT);
    expect(consumeReturnTo(2000)).toBe(CONSENT);
    expect(peekReturnTo(2000)).toBeNull();
  });

  it("ignores a stale path", () => {
    saveReturnTo(CONSENT, 0);

    expect(peekReturnTo(RETURN_TO_TTL_MS + 1)).toBeNull();
  });
});
