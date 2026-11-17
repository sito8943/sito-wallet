import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockShowError } = vi.hoisted(() => ({ mockShowError: vi.fn() }));

const KNOWN_KEYS = new Set(["_entities:base.restore.nameInUse"]);

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { exists: (key: string) => KNOWN_KEYS.has(key) },
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  isHttpError: (error: unknown) =>
    !!error &&
    typeof error === "object" &&
    typeof (error as { status?: unknown }).status === "number",
  useNotification: () => ({ showErrorNotification: mockShowError }),
}));

import { RESTORE_NAME_IN_USE_KEY } from "../constants";
import { useMutationErrorHandler } from "../useMutationErrorHandler";

describe("useMutationErrorHandler", () => {
  beforeEach(() => {
    mockShowError.mockClear();
  });

  it("translates a known backend code on a 409", () => {
    const { result } = renderHook(() => useMutationErrorHandler());

    result.current({ status: 409, message: "restore.nameInUse" });

    expect(mockShowError).toHaveBeenCalledWith({
      message: "_entities:base.restore.nameInUse",
    });
  });

  it("falls back to the unique key for a generic 409", () => {
    const { result } = renderHook(() => useMutationErrorHandler());

    result.current(
      { status: 409, message: "data.conflict" },
      { uniqueKey: RESTORE_NAME_IN_USE_KEY },
    );

    expect(mockShowError).toHaveBeenCalledWith({
      message: RESTORE_NAME_IN_USE_KEY,
    });
  });

  it("shows the generic error for a 409 without a unique key", () => {
    const { result } = renderHook(() => useMutationErrorHandler());

    result.current({ status: 409, message: "data.conflict" });

    expect(mockShowError).toHaveBeenCalledWith({
      message: "_accessibility:errors.500",
    });
  });
});
