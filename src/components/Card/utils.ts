import type { ActionType, BaseEntityDto } from "@sito/dashboard-app";

const MOBILE_CONTEXT_MENU_MEDIA_QUERY = "(pointer: coarse)";
const MOBILE_VIEWPORT_MEDIA_QUERY = "(max-width: 640px)";
const HOVER_MEDIA_QUERY = "(hover: hover)";

export function getDeleteAction<TRow extends BaseEntityDto>(
  actions: ActionType<TRow>[],
): ActionType<TRow> | undefined {
  return actions.find(
    (action) =>
      String(action.id).toLowerCase() === "delete" &&
      !action.hidden &&
      !action.disabled,
  );
}

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
  // Always suppress the native context menu / long-press callout when a card
  // supports long-press selection. Cards have no custom right-click menu, and
  // coarse-pointer detection is unreliable (e.g. Chrome device emulation),
  // so gate on the long-press capability alone.
  return hasLongPressSelection;
}

export function isMobileViewport() {
  if (typeof window === "undefined") return false;

  if (typeof window.matchMedia === "function") {
    return window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY).matches;
  }

  return window.innerWidth <= 640;
}

export function supportsHoverTooltips() {
  if (typeof window === "undefined") return true;

  if (typeof window.matchMedia === "function") {
    return window.matchMedia(HOVER_MEDIA_QUERY).matches;
  }

  return !isCoarsePointerDevice();
}
