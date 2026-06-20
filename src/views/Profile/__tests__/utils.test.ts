import { describe, expect, it } from "vitest";

import { isUploadSizeExceededError } from "../utils";

describe("isUploadSizeExceededError", () => {
  it("recognizes payload-too-large responses", () => {
    expect(
      isUploadSizeExceededError({
        status: 413,
        message: "Payload Too Large",
      }),
    ).toBe(true);
  });

  it("recognizes the backend upload size message", () => {
    expect(
      isUploadSizeExceededError({
        status: 400,
        message: "Maximum upload size exceeded",
      }),
    ).toBe(true);
  });

  it("keeps unrelated upload errors on the generic fallback", () => {
    expect(
      isUploadSizeExceededError({
        status: 500,
        message: "Storage unavailable",
      }),
    ).toBe(false);
  });
});
