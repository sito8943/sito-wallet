import { describe, expect, it } from "vitest";

import {
  createApiKeyFormToDto,
  formatApiKeyPrefix,
  getApiKeyNameErrorKey,
  isApiKeyLimitReached,
} from "../utils";

describe("AiAgents utils", () => {
  it("formats the visible key prefix", () => {
    expect(formatApiKeyPrefix("swal_Ab12Cd")).toBe("swal_Ab12Cd…");
  });

  it("trims the name before sending it", () => {
    expect(createApiKeyFormToDto({ name: "  Laptop  " })).toEqual({
      name: "Laptop",
    });
  });

  it.each([
    ["", "_pages:aiAgents.keys.dialog.nameRequired"],
    ["   ", "_pages:aiAgents.keys.dialog.nameRequired"],
    [undefined, "_pages:aiAgents.keys.dialog.nameRequired"],
    ["a".repeat(61), "_pages:aiAgents.keys.dialog.nameMax"],
    ["a", null],
    ["a".repeat(60), null],
  ])("validates name %j", (name, expected) => {
    expect(getApiKeyNameErrorKey(name)).toBe(expected);
  });

  it("detects the key limit", () => {
    expect(isApiKeyLimitReached(9, 10)).toBe(false);
    expect(isApiKeyLimitReached(10, 10)).toBe(true);
  });
});
