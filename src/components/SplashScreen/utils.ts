import { SPLASH_MIN_VISIBLE_MS } from "./constants";

/** Milliseconds left before a splash shown at `shownAt` may start hiding. */
export const getRemainingVisibleMs = (shownAt: number, now = Date.now()) =>
  Math.max(0, SPLASH_MIN_VISIBLE_MS - (now - shownAt));
