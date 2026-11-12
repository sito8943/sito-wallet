/** True for an absolute http(s) URL; blocks `javascript:` and other schemes. */
export const isHttpUrl = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
};
