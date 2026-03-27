import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ─── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string, o?: Record<string, unknown>) =>
      (o?.defaultValue as string) ?? k,
  }),
}));

const mockUpdateCardTitle = vi.fn();
const mockUpdateCardConfig = vi.fn();
const mockShowErrorNotification = vi.fn();

vi.mock("providers", () => ({
  useManager: () => ({
    Dashboard: {
      updateCardTitle: mockUpdateCardTitle,
      updateCardConfig: mockUpdateCardConfig,
    },
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useNotification: () => ({
    showErrorNotification: mockShowErrorNotification,
  }),
  usePostForm: ({
    defaultValues,
    onSuccess,
    mutationFn,
  }: {
    defaultValues: Record<string, unknown>;
    onSuccess?: () => void;
    mutationFn: (d: unknown) => Promise<unknown>;
  }) => ({
    control: { _defaultValues: defaultValues },
    isLoading: false,
    onSubmit: async (data: unknown) => {
      await mutationFn(data);
      onSuccess?.();
    },
    handleSubmit: (fn: (d: unknown) => void) => () => fn(defaultValues),
    reset: vi.fn(),
  }),
  Loading: ({ className }: { className?: string }) => (
    <div data-testid="loading" className={className} />
  ),
  IconButton: ({
    onClick,
    disabled,
    className,
  }: {
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    icon?: unknown;
  }) => (
    <button
      data-testid={`icon-btn-${className?.includes("error") ? "delete" : "filter"}`}
      onClick={onClick}
      disabled={disabled}
    />
  ),
  DialogPropsType: class {},
  FormPropsType: class {},
  ValidationError: class extends Error {},
}));

vi.mock("lib", () => ({
  UpdateDashboardCardConfigDto: class {},
  UpdateDashboardCardTitleDto: class {},
}));

vi.mock("./BaseCard", () => ({
  BaseCard: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="base-card" className={className}>
      {children}
    </div>
  ),
}));

import { DashboardCard } from "../DashboardCard";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildProps(overrides = {}) {
  return {
    id: 42,
    userId: 1,
    title: "My Card",
    config: null,
    onDelete: vi.fn(),
    parseFormConfig: () => ({ period: "month" }),
    formToDto: (data: Record<string, unknown>) => ({
      id: 42,
      userId: 1,
      config: JSON.stringify(data),
    }),
    ConfigFormDialog: ({
      open,
      onSubmit,
    }: {
      open: boolean;
      onSubmit?: (d: Record<string, unknown>) => void;
    }) =>
      open ? (
        <div data-testid="config-dialog">
          <button
            data-testid="submit-config"
            onClick={() => onSubmit?.({ period: "week" })}
          >
            Save
          </button>
        </div>
      ) : null,
    ...overrides,
  };
}

function renderCard(overrides = {}) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return {
    ...render(
      <QueryClientProvider client={qc}>
        <DashboardCard {...buildProps(overrides)} />
      </QueryClientProvider>,
    ),
    qc,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("DashboardCard", () => {
  beforeEach(() => {
    mockUpdateCardTitle.mockReset().mockResolvedValue(1);
    mockUpdateCardConfig.mockReset().mockResolvedValue(1);
    mockShowErrorNotification.mockReset();
  });

  describe("title editing with debounce", () => {
    it("renders the initial title in the input", () => {
      renderCard();
      expect(screen.getByRole("textbox")).toHaveValue("My Card");
    });

    it("does NOT call updateCardTitle immediately on input", () => {
      vi.useFakeTimers();
      renderCard();
      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Updated Title" },
      });
      // Timers not advanced yet
      expect(mockUpdateCardTitle).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it("calls updateCardTitle after 500ms debounce", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      renderCard();

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Updated Title" },
      });

      await act(async () => {
        vi.advanceTimersByTime(600);
        // Let promise microtasks settle
        await Promise.resolve();
      });

      await waitFor(
        () =>
          expect(mockUpdateCardTitle).toHaveBeenCalledWith(
            expect.objectContaining({ title: "Updated Title" }),
          ),
        { timeout: 3000 },
      );

      vi.useRealTimers();
    });

    it("batches rapid keystrokes into a single call", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      renderCard();
      const input = screen.getByRole("textbox");

      ["T", "Ti", "Titl", "Title!"].forEach((v) =>
        fireEvent.change(input, { target: { value: v } }),
      );

      await act(async () => {
        vi.advanceTimersByTime(600);
        await Promise.resolve();
      });

      await waitFor(
        () => expect(mockUpdateCardTitle).toHaveBeenCalledTimes(1),
        { timeout: 3000 },
      );
      expect(mockUpdateCardTitle).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Title!" }),
      );

      vi.useRealTimers();
    });
  });

  describe("success visual feedback", () => {
    it("shows check-circle icon after title mutation succeeds", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      renderCard();

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Success Title" },
      });

      await act(async () => {
        vi.advanceTimersByTime(600);
        await Promise.resolve();
      });

      await waitFor(
        () => {
          const successIcon = document.querySelector(".text-bg-success");
          expect(successIcon).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      vi.useRealTimers();
    });

    it("removes success icon after 1200ms", async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      renderCard();

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Success Title" },
      });

      await act(async () => {
        vi.advanceTimersByTime(600);
        await Promise.resolve();
      });

      await waitFor(
        () => {
          expect(
            document.querySelector(".text-bg-success"),
          ).toBeInTheDocument();
        },
        { timeout: 3000 },
      );

      await act(async () => {
        vi.advanceTimersByTime(1300);
        await Promise.resolve();
      });

      await waitFor(
        () => {
          expect(document.querySelector(".text-bg-success")).toBeNull();
        },
        { timeout: 3000 },
      );

      vi.useRealTimers();
    });
  });

  describe("filter dialog open/close", () => {
    it("ConfigFormDialog is closed by default", () => {
      renderCard();
      expect(screen.queryByTestId("config-dialog")).toBeNull();
    });

    it("opens ConfigFormDialog when filter icon button is clicked", () => {
      renderCard();
      fireEvent.click(screen.getByTestId("icon-btn-filter"));
      expect(screen.getByTestId("config-dialog")).toBeInTheDocument();
    });

    it("closes ConfigFormDialog when filter icon button is clicked again", () => {
      renderCard();
      fireEvent.click(screen.getByTestId("icon-btn-filter"));
      expect(screen.getByTestId("config-dialog")).toBeInTheDocument();
      fireEvent.click(screen.getByTestId("icon-btn-filter"));
      expect(screen.queryByTestId("config-dialog")).toBeNull();
    });
  });

  describe("delete action", () => {
    it("calls onDelete when delete button is clicked", () => {
      const onDelete = vi.fn();
      renderCard({ onDelete });
      fireEvent.click(screen.getByTestId("icon-btn-delete"));
      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe("config submit", () => {
    it("calls updateCardConfig on config form submit", async () => {
      renderCard();

      fireEvent.click(screen.getByTestId("icon-btn-filter"));
      fireEvent.click(screen.getByTestId("submit-config"));

      await waitFor(() => expect(mockUpdateCardConfig).toHaveBeenCalled(), {
        timeout: 3000,
      });
    });

    it("closes config dialog after successful config submit", async () => {
      renderCard();

      fireEvent.click(screen.getByTestId("icon-btn-filter"));
      expect(screen.getByTestId("config-dialog")).toBeInTheDocument();

      fireEvent.click(screen.getByTestId("submit-config"));

      await waitFor(
        () => expect(screen.queryByTestId("config-dialog")).toBeNull(),
        { timeout: 3000 },
      );
    });

    it("calls onConfigSaved callback after config is saved", async () => {
      const onConfigSaved = vi.fn();
      renderCard({ onConfigSaved });

      fireEvent.click(screen.getByTestId("icon-btn-filter"));
      fireEvent.click(screen.getByTestId("submit-config"));

      await waitFor(() => expect(onConfigSaved).toHaveBeenCalledTimes(1), {
        timeout: 3000,
      });
    });
  });

  describe("loading overlay", () => {
    it("renders loading overlay when loadingOverlay=true", () => {
      renderCard({ loadingOverlay: true });
      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("does not render loading overlay by default", () => {
      renderCard();
      expect(screen.queryByTestId("loading")).toBeNull();
    });
  });

  describe("active filters", () => {
    it("calls renderActiveFilters with formConfig", () => {
      const renderActiveFilters = vi.fn(() => (
        <div data-testid="active-filters">period: month</div>
      ));

      renderCard({ renderActiveFilters });

      expect(renderActiveFilters).toHaveBeenCalledWith(
        expect.objectContaining({
          formConfig: { period: "month" },
          onSubmit: expect.any(Function),
        }),
      );
      expect(screen.getByTestId("active-filters")).toBeInTheDocument();
    });
  });
});
