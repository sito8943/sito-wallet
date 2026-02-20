import "@testing-library/jest-dom";
import { vi } from "vitest";

// Suppress console.error and console.warn in tests unless explicitly needed
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Silence React error boundary noise
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Error: Uncaught") ||
        args[0].includes("The above error occurred"))
    )
      return;
    originalError(...args);
  };
  console.warn = (...args: unknown[]) => {
    // Silence React act() warning noise
    if (typeof args[0] === "string" && args[0].includes("act(")) return;
    originalWarn(...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

afterEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});
