import { beforeEach, describe, expect, it } from "vitest";

import {
  THEME_STORAGE_KEY,
  applyResolvedTheme,
  persistThemeMode,
  readStoredThemeMode,
  resolveTheme,
} from "../theme";

describe("theme utils", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = "";
  });

  it("resolves system mode from the OS preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to system for missing or invalid stored values", () => {
    expect(readStoredThemeMode()).toBe("system");
    localStorage.setItem(THEME_STORAGE_KEY, "sepia");
    expect(readStoredThemeMode()).toBe("system");
  });

  it("persists explicit modes and clears the key for system", () => {
    persistThemeMode("dark");
    expect(readStoredThemeMode()).toBe("dark");
    persistThemeMode("system");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it("toggles the dark class on the document root", () => {
    applyResolvedTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    applyResolvedTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
