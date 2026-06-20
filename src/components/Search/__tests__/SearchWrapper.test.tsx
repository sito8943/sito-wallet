import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// ─── Hoisted mocks (must be declared before vi.mock factories) ─────────────────
const {
  mockNavigate,
  mockTimeAge,
  mockFromLocal,
  mockToLocal,
  mockIsMac,
  mockUseAuth,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockTimeAge: vi.fn(() => "just now"),
  mockFromLocal: vi.fn(() => null),
  mockToLocal: vi.fn(),
  mockIsMac: vi.fn(() => false),
  mockUseAuth: vi.fn(() => ({ account: { email: "user@example.com" } })),
}));

// ─── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  useTimeAge: () => ({ timeAge: mockTimeAge }),
  fromLocal: mockFromLocal,
  toLocal: mockToLocal,
  isMac: mockIsMac,
}));

vi.mock("../SearchResult", () => ({
  SearchResult: ({
    show,
    items,
    recent,
    onClose,
    onClearRecent,
    onRecentClick,
    searching,
  }: {
    show: boolean;
    items: Array<{ path: string; name: string; onClick?: () => void }>;
    recent: Array<{ path: string; name: string }>;
    onClose: () => void;
    onClearRecent: () => void;
    onRecentClick: (item: { path: string; name: string }) => void;
    searching: string;
  }) =>
    show ? (
      <div data-testid="search-result" data-searching={searching}>
        {items.map((item) => (
          <button
            key={item.path}
            data-testid={`result-item-${item.path}`}
            data-search-focusable="true"
            onClick={item.onClick}
          >
            {item.name}
          </button>
        ))}
        {recent.map((r) => (
          <button
            key={r.path}
            data-testid={`recent-item-${r.path}`}
            data-search-focusable="true"
            onClick={() => onRecentClick(r)}
          >
            {r.name}
          </button>
        ))}
        <button data-testid="clear-recent" onClick={onClearRecent} />
        <button data-testid="close-results" onClick={onClose} />
      </div>
    ) : null,
}));

vi.mock("../SearchInput", async () => {
  const { forwardRef } = await vi.importActual<typeof import("react")>("react");
  type MockSearchInputProps = {
    searching: string;
    setSearching: (v: string) => void;
    onClick: () => void;
  };

  const SearchInput = forwardRef<HTMLInputElement, MockSearchInputProps>(
    ({ searching, setSearching, onClick }, ref) => (
      <input
        ref={ref}
        data-testid="search-input"
        value={searching}
        onClick={onClick}
        onChange={(e) => setSearching(e.target.value)}
        readOnly={false}
      />
    ),
  );
  SearchInput.displayName = "MockSearchInput";

  return { SearchInput };
});

vi.mock("../../../views/sitemap", () => ({
  getFeatureFilteredSitemap: () => [],
  flattenSitemap: () => [
    { key: "home", path: "/", name: "Home", role: undefined },
    {
      key: "transactions",
      path: "/transactions",
      name: "Transactions",
      role: undefined,
    },
    { key: "accounts", path: "/accounts", name: "Accounts", role: undefined },
  ],
}));

vi.mock("providers", () => ({
  useFeatureFlags: () => ({
    isFeatureEnabled: () => true,
  }),
}));

vi.mock("string-similarity-js", () => ({
  stringSimilarity: vi.fn((a: string, b: string) => {
    const al = a.toLowerCase();
    const bl = b.toLowerCase();
    if (al === bl) return 1;
    if (bl.includes(al) || al.includes(bl)) return 0.8;
    return 0;
  }),
}));

vi.mock("../../../config", () => ({
  config: { recentSearches: "test-recent-searches" },
}));

import { SearchWrapper } from "../SearchWrapper";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderSearchWrapper(props = {}) {
  return render(
    <MemoryRouter>
      <SearchWrapper {...props} />
    </MemoryRouter>,
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("SearchWrapper", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockFromLocal.mockReturnValue(null);
    mockNavigate.mockReset();
    mockToLocal.mockReset();
    mockUseAuth.mockReset().mockReturnValue({
      account: { email: "user@example.com" },
    });
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  describe("debounce", () => {
    it("does not show results immediately when typing", () => {
      renderSearchWrapper();
      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "home" },
      });
      // Before debounce fires, results panel still closed (showResults=false still)
      // But onClick opens it – here we only type without clicking first
      expect(screen.queryByTestId("search-result")).toBeNull();
    });

    it("shows results after 300ms debounce when value is non-empty", async () => {
      renderSearchWrapper();
      // First click to show the results panel
      fireEvent.click(screen.getByTestId("search-input"));
      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "home" },
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByTestId("search-result")).toBeInTheDocument();
    });

    it("hides results after debounce when search is empty", async () => {
      renderSearchWrapper();
      fireEvent.click(screen.getByTestId("search-input"));
      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "" },
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.queryByTestId("search-result")).toBeNull();
    });
  });

  describe("show/hide results", () => {
    it("shows result panel when input is clicked", () => {
      renderSearchWrapper();
      fireEvent.click(screen.getByTestId("search-input"));
      expect(screen.getByTestId("search-result")).toBeInTheDocument();
    });

    it("hides result panel when onClose is triggered", () => {
      renderSearchWrapper();
      fireEvent.click(screen.getByTestId("search-input"));
      expect(screen.getByTestId("search-result")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("close-results"));
      expect(screen.queryByTestId("search-result")).toBeNull();
    });
  });

  describe("recent searches", () => {
    it("loads recent searches from localStorage on mount", () => {
      const stored = JSON.stringify([
        { path: "/accounts", name: "Accounts", type: "page", time: "1h ago" },
      ]);
      mockFromLocal.mockReturnValueOnce(stored);

      renderSearchWrapper();
      fireEvent.click(screen.getByTestId("search-input"));

      expect(screen.getByTestId("recent-item-/accounts")).toBeInTheDocument();
    });

    it("saves route to recent when a result is clicked", async () => {
      renderSearchWrapper();

      fireEvent.click(screen.getByTestId("search-input"));
      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "home" },
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByTestId("result-item-/")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("result-item-/"));

      expect(mockToLocal).toHaveBeenCalledWith(
        "test-recent-searches",
        expect.arrayContaining([expect.objectContaining({ path: "/" })]),
      );
    });

    it("navigates to the route when a result is clicked", async () => {
      renderSearchWrapper();

      fireEvent.click(screen.getByTestId("search-input"));
      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "home" },
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByTestId("result-item-/")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("result-item-/"));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });

    it("closes the modal when a result is clicked", async () => {
      const onNavigate = vi.fn();
      renderSearchWrapper({ isModal: true, onNavigate });

      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "home" },
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      fireEvent.click(screen.getByTestId("result-item-/"));

      expect(onNavigate).toHaveBeenCalledOnce();
    });

    it("caps recent list at 4 entries", async () => {
      const existing = Array.from({ length: 4 }, (_, i) => ({
        path: `/page-${i}`,
        name: `Page ${i}`,
        type: "page",
        time: "1h ago",
      }));
      mockFromLocal.mockReturnValueOnce(JSON.stringify(existing));

      renderSearchWrapper();
      fireEvent.click(screen.getByTestId("search-input"));
      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "home" },
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByTestId("result-item-/")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("result-item-/"));

      const saved = mockToLocal.mock.calls.at(-1)?.[1] as unknown[];
      expect(saved).toHaveLength(4);
    });

    it("deduplicates an already-visited route in recent list", async () => {
      const existing = [
        { path: "/", name: "Home", type: "page", time: "1h ago" },
      ];
      mockFromLocal.mockReturnValueOnce(JSON.stringify(existing));

      renderSearchWrapper();
      fireEvent.click(screen.getByTestId("search-input"));
      fireEvent.change(screen.getByTestId("search-input"), {
        target: { value: "home" },
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(screen.getByTestId("result-item-/")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("result-item-/"));

      const saved = mockToLocal.mock.calls.at(-1)?.[1] as Array<{
        path: string;
      }>;
      expect(saved.filter((r) => r.path === "/")).toHaveLength(1);
    });

    it("clears recent list when onClearRecent is triggered", () => {
      const stored = JSON.stringify([
        { path: "/accounts", name: "Accounts", type: "page" },
      ]);
      mockFromLocal.mockReturnValueOnce(stored);

      renderSearchWrapper();
      fireEvent.click(screen.getByTestId("search-input"));
      fireEvent.click(screen.getByTestId("clear-recent"));

      expect(mockToLocal).toHaveBeenCalledWith("test-recent-searches", "");
    });

    it("closes the modal when a recent search is clicked", () => {
      const onNavigate = vi.fn();
      mockFromLocal.mockReturnValueOnce(
        JSON.stringify([{ path: "/accounts", name: "Accounts", type: "page" }]),
      );

      renderSearchWrapper({ isModal: true, onNavigate });
      fireEvent.click(screen.getByTestId("search-input"));
      fireEvent.click(screen.getByTestId("recent-item-/accounts"));

      expect(onNavigate).toHaveBeenCalledOnce();
    });
  });

  describe("keyboard shortcut", () => {
    it("calls isMac on Ctrl+Shift+F", () => {
      mockIsMac.mockReturnValue(false);
      renderSearchWrapper({ isModal: false });

      fireEvent.keyDown(window, {
        key: "f",
        ctrlKey: true,
        shiftKey: true,
      });

      expect(mockIsMac).toHaveBeenCalled();
    });
  });

  describe("keyboard navigation", () => {
    it("moves focus between the input and results with arrow keys", async () => {
      renderSearchWrapper();
      const input = screen.getByTestId("search-input");

      fireEvent.click(input);
      fireEvent.change(input, { target: { value: "home" } });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      const result = screen.getByTestId("result-item-/");

      input.focus();
      fireEvent.keyDown(input, { key: "ArrowDown" });
      expect(result).toHaveFocus();

      fireEvent.keyDown(result, { key: "ArrowDown" });
      expect(input).toHaveFocus();

      fireEvent.keyDown(input, { key: "ArrowUp" });
      expect(result).toHaveFocus();
    });
  });
});
