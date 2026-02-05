export function truncateFileName(name: string, maxLength = 25): string {
  if (name.length <= maxLength) return name;

  const dotIndex = name.lastIndexOf(".");
  if (dotIndex === -1) {
    // sin extensión
    return name.slice(0, maxLength - 3) + "...";
  }

  const base = name.slice(0, dotIndex);
  const ext = name.slice(dotIndex); // incluye el punto
  const allowed = maxLength - ext.length - 3;

  return base.slice(0, allowed) + "..." + ext;
}
