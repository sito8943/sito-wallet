import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const setTitle = vi.fn();
const setRightContent = vi.fn();

vi.mock("@sito/dashboard-app", () => ({
  useNavbar: () => ({
    setTitle,
    setRightContent,
  }),
  ActionsDropdown: () => null,
  Actions: () => null,
}));

import { useMobileNavbar } from "../useMobileNavbar";

type MatchMediaState = {
  matches: boolean;
  listeners: Set<(event: MediaQueryListEvent) => void>;
};

const createMatchMediaStub = (initialMatches: boolean) => {
  const state: MatchMediaState = {
    matches: initialMatches,
    listeners: new Set(),
  };

  const matchMedia = vi.fn().mockImplementation(() => ({
    matches: state.matches,
    media: "(max-width: 639px)",
    onchange: null,
    addEventListener: (
      _event: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      state.listeners.add(listener);
    },
    removeEventListener: (
      _event: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      state.listeners.delete(listener);
    },
    dispatchEvent: () => true,
  }));

  const emitChange = (matches: boolean) => {
    state.matches = matches;
    const event = { matches } as MediaQueryListEvent;
    state.listeners.forEach((listener) => listener(event));
  };

  return { matchMedia, emitChange };
};

describe("useMobileNavbar", () => {
  beforeEach(() => {
    setTitle.mockReset();
    setRightContent.mockReset();
  });

  it("sets the title when the viewport is below sm", async () => {
    const { matchMedia } = createMatchMediaStub(true);
    vi.stubGlobal("matchMedia", matchMedia);

    renderHook(() => useMobileNavbar("Accounts"));

    await waitFor(() => {
      expect(setTitle).toHaveBeenCalledWith("Accounts");
    });

    vi.unstubAllGlobals();
  });

  it("clears the title when the viewport is at or above sm", async () => {
    const { matchMedia } = createMatchMediaStub(false);
    vi.stubGlobal("matchMedia", matchMedia);

    renderHook(() => useMobileNavbar("Accounts"));

    await waitFor(() => {
      expect(setTitle).toHaveBeenCalledWith("");
    });

    vi.unstubAllGlobals();
  });

  it("updates the title when the viewport crosses the sm breakpoint", async () => {
    const { matchMedia, emitChange } = createMatchMediaStub(true);
    vi.stubGlobal("matchMedia", matchMedia);

    renderHook(() => useMobileNavbar("Accounts"));

    await waitFor(() => {
      expect(setTitle).toHaveBeenCalledWith("Accounts");
    });

    emitChange(false);

    await waitFor(() => {
      expect(setTitle).toHaveBeenLastCalledWith("");
    });

    vi.unstubAllGlobals();
  });
});
