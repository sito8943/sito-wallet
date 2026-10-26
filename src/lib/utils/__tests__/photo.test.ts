import { describe, expect, it } from "vitest";

import { photoToFormValues, resolvePhotoPayload } from "../photo";

const signedLocal = "files/profile-photos/a.jpg?sig=x&exp=1";
const external = "https://cdn.example.com/logo.png";

describe("photo form helpers", () => {
  it("puts external URLs in the editable field and keeps local files hidden", () => {
    expect(photoToFormValues(external).photoUrl).toBe(external);
    expect(photoToFormValues(signedLocal).photoUrl).toBe("");
    expect(photoToFormValues(signedLocal).photo).toBe(signedLocal);
  });

  it("keeps the stored local photo when nothing changes", () => {
    expect(resolvePhotoPayload(photoToFormValues(signedLocal))).toBe(
      signedLocal,
    );
  });

  it("sends the typed URL over the stored photo", () => {
    expect(
      resolvePhotoPayload({
        ...photoToFormValues(signedLocal),
        photoUrl: ` ${external} `,
      }),
    ).toBe(external);
  });

  it("clears the photo when removed or when the external URL is erased", () => {
    expect(
      resolvePhotoPayload({
        ...photoToFormValues(signedLocal),
        removePhoto: true,
      }),
    ).toBeNull();
    expect(
      resolvePhotoPayload({ ...photoToFormValues(external), photoUrl: "" }),
    ).toBeNull();
    expect(resolvePhotoPayload(photoToFormValues())).toBeNull();
  });
});
