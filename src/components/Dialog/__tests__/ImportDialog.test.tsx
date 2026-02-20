import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";

// ─── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("@sito/dashboard-app", () => ({
  useTranslation: () => ({
    t: (k: string, o?: Record<string, unknown>) =>
      (o?.defaultValue as string) ?? k,
  }),
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogActions: ({
    onPrimaryClick,
    onCancel,
  }: {
    onPrimaryClick?: () => void;
    onCancel?: () => void;
  }) => (
    <div>
      <button data-testid="btn-ok" onClick={onPrimaryClick}>
        OK
      </button>
      <button data-testid="btn-cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

// The FileInput mock: calls onChange with a real event, or exposes onFilePick
// We will call the onChange directly by invoking the stored callback
let storedOnChange: ((file: File | null) => void) | null = null;
let storedOnClear: (() => void) | null = null;

vi.mock("../../FileInput/FileInput", () => ({
  FileInput: ({
    onChange: rawOnChange,
    onClear,
  }: {
    onChange: (e: { target: { files: File[] | null } }) => void;
    onClear: () => void;
    label?: string;
  }) => {
    storedOnChange = (file: File | null) =>
      rawOnChange({ target: { files: file ? [file] : null } });
    storedOnClear = onClear;
    return (
      <div>
        <span data-testid="file-input-stub" />
        <button
          data-testid="clear-file"
          onClick={() => {
            storedOnClear?.();
          }}
        >
          Clear
        </button>
      </div>
    );
  },
}));

vi.mock("../ImportDialog/Loading", () => ({
  ImportDialogLoading: () => (
    <div data-testid="import-loading">Loading…</div>
  ),
}));

vi.mock("../ImportDialog/Error", () => ({
  ImportDialogError: ({ message }: { message?: string }) =>
    message ? (
      <div data-testid="import-error">{message}</div>
    ) : null,
}));

vi.mock("../ImportDialog/Preview", () => ({
  ImportDialogPreview: ({
    items,
  }: {
    items: Array<{ id: string; name?: string }>;
  }) => (
    <div data-testid="import-preview">
      {items.map((it) => (
        <div key={it.id} data-testid={`preview-item-${it.id}`}>
          {it.name ?? it.id}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("lib", () => ({
  ImportPreviewDto: class {},
}));

import { ImportDialog } from "../ImportDialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PreviewItem {
  id: string;
  name: string;
}

function makeFile(name = "test.json") {
  return new File(["[]"], name, { type: "application/json" });
}

function buildProps(overrides = {}) {
  return {
    open: true,
    handleClose: vi.fn(),
    handleSubmit: vi.fn(),
    ...overrides,
  };
}

/** Simulates picking a file via the FileInput stub */
function pickFile(file: File) {
  act(() => {
    storedOnChange?.(file);
  });
}

function clearFile() {
  act(() => {
    storedOnClear?.();
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ImportDialog", () => {
  beforeEach(() => {
    storedOnChange = null;
    storedOnClear = null;
  });

  describe("dialog visibility", () => {
    it("renders when open=true", () => {
      render(<ImportDialog {...buildProps()} />);
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    it("does not render when open=false", () => {
      render(<ImportDialog {...buildProps({ open: false })} />);
      expect(screen.queryByTestId("dialog")).toBeNull();
    });
  });

  describe("file processing", () => {
    it("calls fileProcessor after a file is selected", async () => {
      const fileProcessor = vi
        .fn()
        .mockResolvedValue([{ id: "1", name: "A" }] as PreviewItem[]);

      render(<ImportDialog {...buildProps({ fileProcessor })} />);

      const file = makeFile();
      pickFile(file);

      await waitFor(() => expect(fileProcessor).toHaveBeenCalledWith(file, expect.any(Object)));
    });

    it("shows processing state while fileProcessor is running", async () => {
      let resolve!: (items: PreviewItem[]) => void;
      const fileProcessor = vi.fn(
        () => new Promise<PreviewItem[]>((r) => { resolve = r; })
      );

      render(<ImportDialog {...buildProps({ fileProcessor })} />);

      const file = makeFile();
      pickFile(file);

      await waitFor(() =>
        expect(screen.getByTestId("import-loading")).toBeInTheDocument()
      );

      await act(async () => {
        resolve([{ id: "1", name: "A" }]);
      });

      await waitFor(() =>
        expect(screen.queryByTestId("import-loading")).toBeNull()
      );
    });

    it("shows preview items after successful file processing", async () => {
      const items: PreviewItem[] = [
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ];
      const fileProcessor = vi.fn().mockResolvedValue(items);

      render(<ImportDialog {...buildProps({ fileProcessor })} />);

      pickFile(makeFile());

      await waitFor(() =>
        expect(screen.getByTestId("import-preview")).toBeInTheDocument()
      );
      expect(screen.getByTestId("preview-item-1")).toBeInTheDocument();
    });

    it("shows error when fileProcessor throws", async () => {
      const fileProcessor = vi
        .fn()
        .mockRejectedValue(new Error("Invalid file format"));

      render(<ImportDialog {...buildProps({ fileProcessor })} />);

      pickFile(makeFile());

      await waitFor(() =>
        expect(screen.getByTestId("import-error")).toBeInTheDocument()
      );
      expect(screen.getByTestId("import-error")).toHaveTextContent(
        "Invalid file format"
      );
    });

    it("calls onFileProcessed with parsed items", async () => {
      const items: PreviewItem[] = [{ id: "1", name: "A" }];
      const onFileProcessed = vi.fn();
      const fileProcessor = vi.fn().mockResolvedValue(items);

      render(
        <ImportDialog {...buildProps({ fileProcessor, onFileProcessed })} />
      );

      pickFile(makeFile());

      await waitFor(() =>
        expect(onFileProcessed).toHaveBeenCalledWith(items)
      );
    });
  });

  describe("override checkbox", () => {
    it("calls onOverrideChange when checkbox is toggled", () => {
      const onOverrideChange = vi.fn();
      render(<ImportDialog {...buildProps({ onOverrideChange })} />);

      fireEvent.click(screen.getByRole("checkbox"));
      expect(onOverrideChange).toHaveBeenCalledWith(true);
    });

    it("passes override=true to fileProcessor when checkbox is checked first", async () => {
      const fileProcessor = vi
        .fn()
        .mockResolvedValue([{ id: "1", name: "A" }]);
      render(<ImportDialog {...buildProps({ fileProcessor })} />);

      // Check override first
      fireEvent.click(screen.getByRole("checkbox"));

      // Then pick file – fileProcessor is called with override:true
      pickFile(makeFile());

      await waitFor(() =>
        expect(fileProcessor).toHaveBeenCalledWith(
          expect.any(File),
          { override: true }
        )
      );
    });
  });

  describe("submit", () => {
    it("calls handleSubmit when items exist and OK is clicked", async () => {
      const handleSubmit = vi.fn();
      const fileProcessor = vi
        .fn()
        .mockResolvedValue([{ id: "1", name: "A" }]);

      render(<ImportDialog {...buildProps({ handleSubmit, fileProcessor })} />);

      pickFile(makeFile());

      await waitFor(() => screen.getByTestId("import-preview"));

      fireEvent.click(screen.getByTestId("btn-ok"));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("does NOT call handleSubmit when no items and fileProcessor is set", () => {
      const handleSubmit = vi.fn();
      const fileProcessor = vi.fn();

      render(<ImportDialog {...buildProps({ handleSubmit, fileProcessor })} />);

      fireEvent.click(screen.getByTestId("btn-ok"));
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("calls handleSubmit immediately when no fileProcessor is provided", () => {
      const handleSubmit = vi.fn();
      render(<ImportDialog {...buildProps({ handleSubmit })} />);

      fireEvent.click(screen.getByTestId("btn-ok"));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("calls handleClose when Cancel is clicked", () => {
      const handleClose = vi.fn();
      render(<ImportDialog {...buildProps({ handleClose })} />);

      fireEvent.click(screen.getByTestId("btn-cancel"));
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("reset on close", () => {
    it("resets preview when onClear is triggered", async () => {
      const fileProcessor = vi
        .fn()
        .mockResolvedValue([{ id: "1", name: "A" }]);
      render(<ImportDialog {...buildProps({ fileProcessor })} />);

      pickFile(makeFile());
      await waitFor(() => screen.getByTestId("import-preview"));

      clearFile();
      expect(screen.queryByTestId("import-preview")).toBeNull();
    });
  });

  describe("custom preview", () => {
    it("uses renderCustomPreview instead of default preview when provided", async () => {
      const items: PreviewItem[] = [{ id: "1", name: "Custom" }];
      const fileProcessor = vi.fn().mockResolvedValue(items);
      const renderCustomPreview = vi.fn((i: PreviewItem[] | null) =>
        i ? <div data-testid="custom-preview">custom</div> : null
      );

      render(
        <ImportDialog
          {...buildProps({ fileProcessor, renderCustomPreview })}
        />
      );

      pickFile(makeFile());

      await waitFor(() => screen.getByTestId("custom-preview"));
      expect(screen.queryByTestId("import-preview")).toBeNull();
    });
  });
});
