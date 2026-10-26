/**
 * Form state for an optional photo that can be an uploaded file or an
 * external URL. `photo` is the stored value from the API (an external URL or
 * a signed local file URL); `photoUrl` is what the user typed.
 */
export type PhotoFormValues = {
  photo: string;
  photoUrl: string;
  file: File | null;
  removePhoto: boolean;
};
