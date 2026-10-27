import { PHOTO_ALLOWED_TYPES, PHOTO_MAX_SIZE_BYTES } from "./constants";
import type { PhotoFormValues } from "./types";

export const isExternalPhoto = (value?: string | null): boolean =>
  /^https?:\/\//i.test(value?.trim() ?? "");

export const photoToFormValues = (photo?: string | null): PhotoFormValues => ({
  photo: photo ?? "",
  photoUrl: isExternalPhoto(photo) ? (photo ?? "") : "",
  file: null,
  removePhoto: false,
});

/**
 * Value to send as `photo` in create/update. A selected file is uploaded
 * afterwards, so here it only matters what to keep until then.
 */
export const resolvePhotoPayload = (values: PhotoFormValues): string | null => {
  if (values.removePhoto) return null;

  const typedUrl = values.photoUrl.trim();
  if (typedUrl) return typedUrl;

  // An external URL lives in `photoUrl`: if it was cleared, the photo goes.
  if (isExternalPhoto(values.photo)) return null;

  return values.photo.trim() || null;
};

/**
 * Translation key of the reason a selected file can't be uploaded, or null
 * when it is valid. Same rules and codes as the backend.
 */
export const getPhotoFileErrorKey = (file: File): string | null => {
  if (!PHOTO_ALLOWED_TYPES.includes(file.type)) {
    return "_entities:base.photo.invalidType";
  }
  if (file.size > PHOTO_MAX_SIZE_BYTES) return "_entities:base.photo.tooLarge";
  return null;
};
