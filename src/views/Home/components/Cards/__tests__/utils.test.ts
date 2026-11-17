import { afterEach, describe, expect, it, vi } from "vitest";

import { parseCardConfig } from "../utils";
import { parseFilterConfig } from "../WeeklySpent/utils";

type StoredType = { limit?: number };
type FormType = { limit: number };

const FALLBACK: FormType = { limit: 5 };
const toForm = (stored: StoredType): FormType => ({
  limit: stored.limit ?? FALLBACK.limit,
});

describe("parseCardConfig", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps the stored JSON to form values", () => {
    expect(parseCardConfig('{"limit":10}', FALLBACK, toForm)).toEqual({
      limit: 10,
    });
  });

  it("maps an empty object when there is no config", () => {
    expect(parseCardConfig(null, FALLBACK, toForm)).toEqual(FALLBACK);
    expect(parseCardConfig("", FALLBACK, toForm)).toEqual(FALLBACK);
  });

  it("logs and falls back silently on malformed JSON", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(parseCardConfig("{not json", FALLBACK, toForm)).toBe(FALLBACK);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  it("falls back when the mapping throws on an unexpected shape", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(
      parseCardConfig("null", FALLBACK, (stored: StoredType) => ({
        limit: stored.limit ?? 0,
      })),
    ).toBe(FALLBACK);
  });
});

describe("parseFilterConfig (weekly spent)", () => {
  it("reads the type and account ids", () => {
    expect(
      parseFilterConfig('{"type":0,"accounts":[{"id":3},{"id":7}]}'),
    ).toEqual({ type: 0, accounts: [3, 7] });
  });

  it("falls back to the default filters when accounts aren't a list", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(parseFilterConfig('{"type":0,"accounts":"oops"}')).toEqual({
      type: 1,
      accounts: [],
    });
  });
});
