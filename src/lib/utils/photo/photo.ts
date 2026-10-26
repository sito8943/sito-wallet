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
