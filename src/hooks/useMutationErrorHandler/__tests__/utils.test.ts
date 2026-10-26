import { describe, expect, it } from "vitest";

import { getBackendErrorCodeKey } from "../utils";

describe("getBackendErrorCodeKey", () => {
  it("maps photo codes to their translation key", () => {
    expect(getBackendErrorCodeKey("photo.tooLarge")).toBe(
      "_entities:base.photo.tooLarge",
    );
  });

  it("ignores free text and other codes", () => {
    expect(getBackendErrorCodeKey("Name is required")).toBeNull();
    expect(getBackendErrorCodeKey("name.label")).toBeNull();
    expect(getBackendErrorCodeKey(undefined)).toBeNull();
  });
});
