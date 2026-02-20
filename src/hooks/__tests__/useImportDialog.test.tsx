import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// ─── Hoisted mocks ─────────────────────────────────────────────────────────────
const { mockQueryClientInvalidate, mockMutationFn, mockImportActionClick } =
  vi.hoisted(() => ({
    mockQueryClientInvalidate: vi.fn(),
    mockMutationFn: vi.fn(),
    mockImportActionClick: vi.fn(),
  }));

// ─── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("@sito/dashboard-app", () => ({
  useTranslation: () => ({
    t: (k: string, o?: Record<string, unknown>) =>
      (o?.defaultValue as string) ?? k,
  }),
  useImportAction: ({ onClick }: { onClick: () => void }) => {
    // Store reference to the onClick so tests can trigger it
    mockImportActionClick.mockImplementation(onClick);
    return {
      action: () => ({ id: "import", onClick }),
    };
  },
  queryClient: {
    invalidateQueries: mockQueryClientInvalidate,
  },
  ValidationError: class extends Error {},
  BaseEntityDto: class {},
  ActionType: class {},
}));

vi.mock("lib", () => ({
  ImportDto: class {},
  ImportPreviewDto: class {},
}));

vi.mock("../../components/Dialog/ImportDialog", () => ({
  ImportDialogPropsType: class {},
}));

import { useImportDialog } from "../useImportDialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestPreview {
  id: string;
  name: string;
}

interface TestEntity {
  id: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

function buildProps(overrides = {}) {
  return {
    queryKey: ["test-entities"] as const,
    entity: "transactions" as const,
    mutationFn: mockMutationFn,
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useImportDialog", () => {
  beforeEach(() => {
    mockMutationFn.mockReset();
    mockQueryClientInvalidate.mockReset();
    mockImportActionClick.mockReset();
  });

  describe("initial state", () => {
    it("dialog is closed by default", () => {
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );
      expect(result.current.open).toBe(false);
    });

    it("isLoading is false initially", () => {
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );
      expect(result.current.isLoading).toBe(false);
    });

    it("returns an action function", () => {
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );
      expect(typeof result.current.action).toBe("function");
    });
  });

  describe("dialog open/close", () => {
    it("dialog opens when action onClick is called", () => {
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.action().onClick?.();
      });

      expect(result.current.open).toBe(true);
    });

    it("dialog closes when handleClose is called", () => {
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.action().onClick?.();
      });
      expect(result.current.open).toBe(true);

      act(() => {
        result.current.handleClose();
      });
      expect(result.current.open).toBe(false);
    });

    it("resets items on handleClose so handleSubmit is a no-op", async () => {
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.onFileProcessed([{ id: "1", name: "Test" }]);
      });

      act(() => {
        result.current.handleClose();
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockMutationFn).not.toHaveBeenCalled();
    });
  });

  describe("file processing flow", () => {
    it("onOverrideChange updates override flag passed to mutationFn", async () => {
      mockMutationFn.mockResolvedValue(1);
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.onFileProcessed([{ id: "1", name: "A" }]);
        result.current.onOverrideChange(true);
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockMutationFn).toHaveBeenCalledWith(
        expect.objectContaining({ override: true })
      );
    });
  });

  describe("handleSubmit (mutation flow)", () => {
    it("does nothing when items are empty", async () => {
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockMutationFn).not.toHaveBeenCalled();
    });

    it("calls mutationFn with items when handleSubmit is triggered", async () => {
      mockMutationFn.mockResolvedValue(1);
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.onFileProcessed([{ id: "1", name: "Test" }]);
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(mockMutationFn).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [{ id: "1", name: "Test" }],
        })
      );
    });

    it("invalidates queries after successful mutation", async () => {
      mockMutationFn.mockResolvedValue(1);
      const { result } = renderHook(
        () =>
          useImportDialog<TestEntity, TestPreview>(
            buildProps({ queryKey: ["test-entities"] })
          ),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.onFileProcessed([{ id: "1", name: "A" }]);
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      await waitFor(() => {
        expect(mockQueryClientInvalidate).toHaveBeenCalledWith({
          queryKey: ["test-entities"],
        });
      });
    });

    it("closes dialog and resets items after successful mutation", async () => {
      mockMutationFn.mockResolvedValue(1);
      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.action().onClick?.();
        result.current.onFileProcessed([{ id: "1", name: "A" }]);
      });

      expect(result.current.open).toBe(true);

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(result.current.open).toBe(false);
    });

    it("handles mutation error gracefully", async () => {
      mockMutationFn.mockRejectedValue(new Error("Import failed"));
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(
        () => useImportDialog<TestEntity, TestPreview>(buildProps()),
        { wrapper: makeWrapper() }
      );

      act(() => {
        result.current.action().onClick?.();
        result.current.onFileProcessed([{ id: "1", name: "A" }]);
      });

      await act(async () => {
        await result.current.handleSubmit();
      });

      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe("fileProcessor and renderCustomPreview passthrough", () => {
    it("exposes fileProcessor prop unchanged", () => {
      const fileProcessor = vi.fn();
      const { result } = renderHook(
        () =>
          useImportDialog<TestEntity, TestPreview>(
            buildProps({ fileProcessor })
          ),
        { wrapper: makeWrapper() }
      );
      expect(result.current.fileProcessor).toBe(fileProcessor);
    });

    it("exposes renderCustomPreview prop unchanged", () => {
      const renderCustomPreview = vi.fn(() => null);
      const { result } = renderHook(
        () =>
          useImportDialog<TestEntity, TestPreview>(
            buildProps({ renderCustomPreview })
          ),
        { wrapper: makeWrapper() }
      );
      expect(result.current.renderCustomPreview).toBe(renderCustomPreview);
    });
  });
});
