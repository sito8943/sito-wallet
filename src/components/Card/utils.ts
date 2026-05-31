const MOBILE_CONTEXT_MENU_MEDIA_QUERY = "(pointer: coarse)";
const MOBILE_VIEWPORT_MEDIA_QUERY = "(max-width: 640px)";

export function isCoarsePointerDevice() {
  if (typeof window === "undefined") return false;

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

export function shouldPreventMobileContextMenu(hasLongPressSelection: boolean) {
  if (!hasLongPressSelection) return false;

  return isCoarsePointerDevice();
}

export function isMobileViewport() {
  if (typeof window === "undefined") return false;

  if (typeof window.matchMedia === "function") {
    return window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY).matches;
  }

  return window.innerWidth <= 640;
}
