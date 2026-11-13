import { describe, expect, it, vi } from "vitest";

import { McpAccess, McpArea } from "../../../lib/mcp/types";
import { MCP_AREAS } from "../../../lib/mcp/constants";

vi.mock("lib", async () => ({
  ...(await import("../../../lib/mcp")),
  ...(await import("../../../lib/entities/apiKey/constants")),
}));

import {
  apiKeyDtoToForm,
  apiKeyFormToUpdateDto,
  createApiKeyFormToDto,
  getApiKeyAreaLabelKeys,
  getApiKeyAreasErrorKey,
  formatApiKeyPrefix,
  getApiKeyNameErrorKey,
  isApiKeyLimitReached,
} from "../utils";

describe("AiAgents utils", () => {
  it("formats the visible key prefix", () => {
    expect(formatApiKeyPrefix("swal_Ab12Cd")).toBe("swal_Ab12Cd…");
  });

  it("trims the name before sending it", () => {
    expect(
      createApiKeyFormToDto({
        name: "  Laptop  ",
        access: McpAccess.Full,
        areas: [McpArea.Debts],
      }),
    ).toEqual({
      name: "Laptop",
      access: McpAccess.Full,
      areas: [McpArea.Debts],
    });
  });

  it.each([McpAccess.Full, McpAccess.Read, McpAccess.Write])(
    "sends the chosen access %s",
    (access) => {
      expect(
        createApiKeyFormToDto({ name: "Agent", access, areas: [] }).access,
      ).toBe(access);
    },
  );

  it("falls back to read and write for an unknown access", () => {
    expect(
      createApiKeyFormToDto({
        name: "Agent",
        access: "ADMIN" as McpAccess,
        areas: [],
      }).access,
    ).toBe(McpAccess.Full);
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

  it("round-trips a key through the edit form", () => {
    const form = apiKeyDtoToForm({
      id: 7,
      name: "Bot",
      prefix: "swal_Abc123",
      createdAt: "2026-11-01T10:00:00Z",
      lastUsedAt: null,
      access: McpAccess.Read,
      areas: [McpArea.Debts, McpArea.Transactions],
    });
    expect(form).toEqual({
      id: 7,
      name: "Bot",
      access: McpAccess.Read,
      areas: [McpArea.Transactions, McpArea.Debts],
    });
    expect(apiKeyFormToUpdateDto({ ...form, name: " Bot 2 " })).toEqual({
      id: 7,
      name: "Bot 2",
      access: McpAccess.Read,
      areas: [McpArea.Transactions, McpArea.Debts],
    });
  });

  it("treats keys without areas as unrestricted", () => {
    expect(
      apiKeyDtoToForm({
        id: 1,
        name: "Old",
        prefix: "swal_Old000",
        createdAt: "2026-11-01T10:00:00Z",
        lastUsedAt: null,
        access: McpAccess.Full,
        areas: undefined as unknown as McpArea[],
      }).areas,
    ).toEqual(MCP_AREAS);
  });

  it("requires at least one area", () => {
    expect(getApiKeyAreasErrorKey([])).toBe("_pages:aiAgents.areas.required");
    expect(getApiKeyAreasErrorKey([McpArea.Debts])).toBeNull();
  });

  it("only labels the areas of a limited key", () => {
    expect(getApiKeyAreaLabelKeys(MCP_AREAS)).toBeNull();
    expect(getApiKeyAreaLabelKeys([McpArea.Currencies])).toEqual([
      "_pages:aiAgents.areas.items.currencies.label",
    ]);
  });

  it("detects the key limit", () => {
    expect(isApiKeyLimitReached(9, 10)).toBe(false);
    expect(isApiKeyLimitReached(10, 10)).toBe(true);
  });
});
