const MOBILE_CONTEXT_MENU_MEDIA_QUERY = "(pointer: coarse)";

export function shouldPreventMobileContextMenu(
  hasLongPressSelection: boolean,
) {
  if (!hasLongPressSelection || typeof window === "undefined") return false;

  if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) {
    return true;
  }

  if ("ontouchstart" in window) {
    return true;
  }

  if (typeof window.matchMedia === "function") {
    return window.matchMedia(MOBILE_CONTEXT_MENU_MEDIA_QUERY).matches;
  }

  return false;
}
