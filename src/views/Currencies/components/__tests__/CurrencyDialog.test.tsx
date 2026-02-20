import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// ─── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: "en" },
  }),
}));

const mockUseAuth = vi.fn(() => ({
  account: { id: 99, email: "test@example.com" },
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  TextInput: ({
    value,
    onChange,
    label,
    required,
    disabled,
    name,
    maxLength,
    ...rest
  }: React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    maxLength?: number;
  }) => (
    <input
      data-testid={`text-input-${label ?? name}`}
      value={value ?? ""}
      onChange={onChange}
      aria-label={label}
      required={required}
      disabled={disabled}
      name={name}
      maxLength={maxLength}
      {...rest}
    />
  ),
  ParagraphInput: ({
    value,
    onChange,
    label,
    disabled,
    maxLength,
  }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    maxLength?: number;
  }) => (
    <textarea
      data-testid={`paragraph-input-${label}`}
      value={value ?? ""}
      onChange={onChange}
      aria-label={label}
      disabled={disabled}
      maxLength={maxLength}
    />
  ),
  FormDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) =>
    open ? (
      <div data-testid="form-dialog">
        {children}
        <button type="submit" data-testid="form-submit">
          Submit
        </button>
      </div>
    ) : null,
}));

vi.mock("lib", () => ({
  Tables: { Currencies: "currencies" },
}));

import {
  CurrencyForm,
  AddCurrencyDialog,
  EditCurrencyDialog,
} from "../CurrencyDialog";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

/** Wrapper that provides a real useForm() control to CurrencyForm */
function CurrencyFormWrapper({
  open,
  setValue: externalSetValue,
  isLoading = false,
}: {
  open: boolean;
  setValue?: ReturnType<typeof useForm>["setValue"];
  isLoading?: boolean;
}) {
  const form = useForm({
    defaultValues: { id: undefined, userId: 0, name: "", symbol: "", description: "" },
  });
  return (
    <CurrencyForm
      open={open}
      control={form.control}
      setValue={externalSetValue ?? form.setValue}
      isLoading={isLoading}
    />
  );
}

/** Wrapper that provides a real useForm() control to AddCurrencyDialog */
function AddCurrencyWrapper({ open }: { open: boolean }) {
  const form = useForm({
    defaultValues: { id: undefined, userId: 0, name: "", symbol: "", description: "" },
  });
  return (
    <AddCurrencyDialog
      open={open}
      control={form.control}
      setValue={form.setValue}
      isLoading={false}
      handleClose={vi.fn()}
      onSubmit={vi.fn()}
      handleSubmit={form.handleSubmit as unknown as () => void}
    />
  );
}

function EditCurrencyWrapper({ open }: { open: boolean }) {
  const form = useForm({
    defaultValues: { id: 1, userId: 99, name: "Euro", symbol: "€", description: "" },
  });
  return (
    <EditCurrencyDialog
      open={open}
      control={form.control}
      setValue={form.setValue}
      isLoading={false}
      handleClose={vi.fn()}
      onSubmit={vi.fn()}
      handleSubmit={form.handleSubmit as unknown as () => void}
    />
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("CurrencyForm", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 99, email: "test@example.com" },
    });
  });

  it("auto-sets userId from account when dialog opens", () => {
    const setValue = vi.fn();
    const { rerender } = render(
      <CurrencyFormWrapper open={false} setValue={setValue} />,
      { wrapper: makeWrapper() }
    );

    rerender(<CurrencyFormWrapper open={true} setValue={setValue} />);

    expect(setValue).toHaveBeenCalledWith("userId", 99);
  });

  it("sets userId to 0 when account.id is undefined", () => {
    mockUseAuth.mockReturnValue({ account: { id: undefined } });
    const setValue = vi.fn();

    render(<CurrencyFormWrapper open={true} setValue={setValue} />, {
      wrapper: makeWrapper(),
    });

    expect(setValue).toHaveBeenCalledWith("userId", 0);
  });

  it("does not set userId when account is null", () => {
    mockUseAuth.mockReturnValue({ account: null });
    const setValue = vi.fn();

    render(<CurrencyFormWrapper open={true} setValue={setValue} />, {
      wrapper: makeWrapper(),
    });

    expect(setValue).not.toHaveBeenCalled();
  });
});

describe("AddCurrencyDialog", () => {
  it("renders form when open=true", () => {
    render(<AddCurrencyWrapper open={true} />, { wrapper: makeWrapper() });
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument();
  });

  it("does not render when open=false", () => {
    render(<AddCurrencyWrapper open={false} />, { wrapper: makeWrapper() });
    expect(screen.queryByTestId("form-dialog")).toBeNull();
  });
});

describe("EditCurrencyDialog", () => {
  it("renders form when open=true", () => {
    render(<EditCurrencyWrapper open={true} />, { wrapper: makeWrapper() });
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument();
  });

  it("does not render when open=false", () => {
    render(<EditCurrencyWrapper open={false} />, { wrapper: makeWrapper() });
    expect(screen.queryByTestId("form-dialog")).toBeNull();
  });
});
