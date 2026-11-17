export type ProviderPhotoPropsType = {
  photo?: string | null;
  className?: string;
  alt?: string;
  /** Called when the photo can't be loaded (fetch or decode error). */
  onError?: () => void;
};
