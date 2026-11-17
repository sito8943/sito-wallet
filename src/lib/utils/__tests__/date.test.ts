import { describe, expect, it } from "vitest";

import { formatDate, formatDateTime, parseDisplayDate } from "../date";

// Local wall-clock time, so results do not depend on the runner's time zone.
const LOCAL_DATE_TIME = new Date(2026, 10, 17, 15, 5);

describe("formatDate", () => {
  it("follows the app language, not the browser locale", () => {
    expect(formatDate(LOCAL_DATE_TIME, "en")).toBe("Nov 17, 2026");
    expect(formatDate(LOCAL_DATE_TIME, "es")).toBe("17 nov 2026");
  });

  it("reads YYYY-MM-DD as a local date", () => {
    expect(formatDate("2026-01-01", "en")).toBe("Jan 1, 2026");
    expect(formatDate("2026-01-01", "es")).toBe("1 ene 2026");
  });

  it("returns a dash for empty or invalid values", () => {
    expect(formatDate(null, "en")).toBe("-");
    expect(formatDate(undefined, "en")).toBe("-");
    expect(formatDate("", "es")).toBe("-");
    expect(formatDate("not a date", "es")).toBe("-");
  });
});

describe("formatDateTime", () => {
  it("adds the short time in the app language", () => {
    // ICU versions differ on the space before "PM" (regular vs narrow).
    expect(formatDateTime(LOCAL_DATE_TIME, "en")).toMatch(
      /^Nov 17, 2026, 3:05\sPM$/,
    );
    expect(formatDateTime(LOCAL_DATE_TIME, "es")).toBe("17 nov 2026, 15:05");
  });

  it("parses ISO strings", () => {
    expect(formatDateTime("2026-11-17T15:05:00", "es")).toBe(
      "17 nov 2026, 15:05",
    );
  });

  it("returns a dash for empty or invalid values", () => {
    expect(formatDateTime(null, "es")).toBe("-");
    expect(formatDateTime("nope", "en")).toBe("-");
  });
});

describe("parseDisplayDate", () => {
  it("returns null for empty or invalid values", () => {
    expect(parseDisplayDate(null)).toBeNull();
    expect(parseDisplayDate("nope")).toBeNull();
  });

  it("keeps Date instances", () => {
    expect(parseDisplayDate(LOCAL_DATE_TIME)).toBe(LOCAL_DATE_TIME);
  });
});
