import { describe, expect, it } from "vitest";

import { PHOTO_MAX_SIZE_BYTES } from "../photo/constants";
import {
  getPhotoFileErrorKey,
  photoToFormValues,
  resolvePhotoPayload,
} from "../photo";

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

describe("getPhotoFileErrorKey", () => {
  const makeFile = (type: string, size: number) =>
    new File([new Uint8Array(size)], "photo", { type });

  it("accepts allowed images within the size limit", () => {
    expect(getPhotoFileErrorKey(makeFile("image/png", 10))).toBeNull();
  });

  it("rejects other types", () => {
    expect(getPhotoFileErrorKey(makeFile("image/gif", 10))).toBe(
      "_entities:base.photo.invalidType",
    );
  });

  it("rejects files over 5 MB", () => {
    expect(
      getPhotoFileErrorKey(makeFile("image/jpeg", PHOTO_MAX_SIZE_BYTES + 1)),
    ).toBe("_entities:base.photo.tooLarge");
  });
});
