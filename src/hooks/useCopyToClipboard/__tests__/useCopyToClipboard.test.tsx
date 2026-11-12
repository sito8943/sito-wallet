import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockShowErrorNotification, mockShowSuccessNotification } = vi.hoisted(
  () => ({
    mockShowErrorNotification: vi.fn(),
    mockShowSuccessNotification: vi.fn(),
  }),
);

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useNotification: () => ({
    showErrorNotification: mockShowErrorNotification,
    showSuccessNotification: mockShowSuccessNotification,
  }),
}));

import { COPY_ERROR_KEY, COPY_SUCCESS_KEY } from "../constants";
import { useCopyToClipboard } from "../useCopyToClipboard";

const mockWriteText = vi.fn<(text: string) => Promise<void>>();

describe("useCopyToClipboard", () => {
  beforeEach(() => {
    mockWriteText.mockReset();
    vi.stubGlobal("navigator", { clipboard: { writeText: mockWriteText } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("copies the text and notifies success", async () => {
    mockWriteText.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCopyToClipboard());

    let copied = false;
    await act(async () => {
      copied = await result.current("swal_secret");
    });

    expect(copied).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith("swal_secret");
    expect(mockShowSuccessNotification).toHaveBeenCalledWith({
      message: COPY_SUCCESS_KEY,
    });
  });

  it("notifies an error when the clipboard is unavailable", async () => {
    mockWriteText.mockRejectedValue(new Error("denied"));
    const { result } = renderHook(() => useCopyToClipboard());

    let copied = true;
    await act(async () => {
      copied = await result.current("swal_secret");
    });

    expect(copied).toBe(false);
    expect(mockShowErrorNotification).toHaveBeenCalledWith({
      message: COPY_ERROR_KEY,
    });
  });
});
