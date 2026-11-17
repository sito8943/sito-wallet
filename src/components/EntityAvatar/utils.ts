/** Non-empty, trimmed photo, or null when there is none. */
export const normalizePhoto = (photo?: string | null): string | null => {
  const trimmed = photo?.trim();
  return trimmed ? trimmed : null;
};
