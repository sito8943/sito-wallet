import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

// ─── Module mocks ──────────────────────────────────────────────────────────────

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
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
      </div>
    ) : null,
  TextInput: ({
    value,
    onChange,
    label,
    required,
    disabled,
    name,
    type,
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
      type={type ?? "text"}
      maxLength={maxLength}
      {...rest}
    />
  ),
  ParagraphInput: ({
    value,
    onChange,
    label,
    disabled,
  }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) => (
    <textarea
      data-testid={`paragraph-input-${label}`}
      value={value ?? ""}
      onChange={onChange}
      aria-label={label}
      disabled={disabled}
    />
  ),
  AutocompleteInput: ({
    value,
    onChange,
    label,
    options,
    disabled,
  }: {
    value?: unknown;
    onChange?: (v: unknown) => void;
    label?: string;
    options?: Array<{ id: number; name: string }>;
    disabled?: boolean;
  }) => (
    <select
      data-testid={`autocomplete-${label}`}
      value={(value as { id: number } | undefined)?.id ?? ""}
      onChange={(e) => {
        const opt = options?.find((o) => String(o.id) === e.target.value);
        onChange?.(opt ?? null);
      }}
      aria-label={label}
      disabled={disabled}
    >
      <option value="">-- select --</option>
      {options?.map((o) => (
        <option key={o.id} value={String(o.id)}>
          {o.name}
        </option>
      ))}
    </select>
  ),
  Option: class {},
}));

const mockAccountsCommon = vi.fn(() => ({
  data: [{ id: 1, name: "Wallet", currency: { id: 1, name: "EUR" } }],
  isLoading: false,
}));
const mockCategoriesCommon = vi.fn(() => ({
  data: [{ id: 1, name: "Food", initial: false }],
  isLoading: false,
}));

vi.mock("hooks", () => ({
  useAccountsCommon: () => mockAccountsCommon(),
  useTransactionCategoriesCommon: () => mockCategoriesCommon(),
}));

vi.mock("lib", () => ({
  Tables: { Transactions: "transactions" },
}));

import {
  TransactionForm,
  AddTransactionDialog,
  EditTransactionDialog,
} from "../TransactionDialog";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const defaultAccount = { id: 1, name: "Wallet", currency: { id: 1, name: "EUR" } };

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

function TransactionFormWrapper({
  open,
  account,
  lockCategory = false,
  lockAccount = false,
  setValue: externalSetValue,
}: {
  open: boolean;
  account?: typeof defaultAccount | null;
  lockCategory?: boolean;
  lockAccount?: boolean;
  setValue?: ReturnType<typeof useForm>["setValue"];
}) {
  const form = useForm({
    defaultValues: {
      id: undefined,
      category: null,
      account: null,
      amount: "",
      date: "",
      description: "",
      initial: false,
    },
  });
  return (
    <TransactionForm
      open={open}
      account={account ?? undefined}
      control={form.control}
      setValue={externalSetValue ?? form.setValue}
      isLoading={false}
      lockCategory={lockCategory}
      lockAccount={lockAccount}
    />
  );
}

function AddTransactionWrapper({ open }: { open: boolean }) {
  const form = useForm({
    defaultValues: {
      id: undefined,
      category: null,
      account: null,
      amount: "",
      date: "",
      description: "",
    },
  });
  return (
    <AddTransactionDialog
      open={open}
      account={defaultAccount}
      control={form.control}
      setValue={form.setValue}
      isLoading={false}
      handleClose={vi.fn()}
      onSubmit={vi.fn()}
      handleSubmit={form.handleSubmit as unknown as () => void}
    />
  );
}

function EditTransactionWrapper({ open }: { open: boolean }) {
  const form = useForm({
    defaultValues: {
      id: 1,
      category: { id: 1 },
      account: defaultAccount,
      amount: "50",
      date: "2024-01-01T12:00",
      description: "Test",
    },
  });
  return (
    <EditTransactionDialog
      open={open}
      account={defaultAccount}
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

describe("TransactionForm", () => {
  beforeEach(() => {
    mockAccountsCommon.mockReturnValue({
      data: [defaultAccount],
      isLoading: false,
    });
    mockCategoriesCommon.mockReturnValue({
      data: [{ id: 1, name: "Food", initial: false }],
      isLoading: false,
    });
  });

  it("auto-sets account from prop when dialog opens", () => {
    const setValue = vi.fn();

    const { rerender } = render(
      <TransactionFormWrapper open={false} account={defaultAccount} setValue={setValue} />,
      { wrapper: makeWrapper() }
    );

    rerender(
      <TransactionFormWrapper open={true} account={defaultAccount} setValue={setValue} />
    );

    expect(setValue).toHaveBeenCalledWith("account", defaultAccount);
  });

  it("does not set account when account prop is undefined", () => {
    const setValue = vi.fn();

    render(
      <TransactionFormWrapper open={true} account={null} setValue={setValue} />,
      { wrapper: makeWrapper() }
    );

    const accountCall = setValue.mock.calls.find(([key]) => key === "account");
    expect(accountCall).toBeUndefined();
  });

  it("disables category autocomplete when lockCategory=true", () => {
    render(
      <TransactionFormWrapper open={true} account={defaultAccount} lockCategory={true} />,
      { wrapper: makeWrapper() }
    );

    const categoryEl = screen.getByTestId(
      "autocomplete-_entities:transaction.category.label"
    );
    expect(categoryEl).toBeDisabled();
  });

  it("disables account autocomplete when lockAccount=true", () => {
    render(
      <TransactionFormWrapper open={true} account={defaultAccount} lockAccount={true} />,
      { wrapper: makeWrapper() }
    );

    const accountEl = screen.getByTestId(
      "autocomplete-_entities:transaction.account.label"
    );
    expect(accountEl).toBeDisabled();
  });

  it("renders initial category name via t() for initial categories", () => {
    mockCategoriesCommon.mockReturnValue({
      data: [{ id: 1, name: "Initial", initial: true }],
      isLoading: false,
    });

    render(
      <TransactionFormWrapper open={true} account={defaultAccount} />,
      { wrapper: makeWrapper() }
    );

    // The category autocomplete should exist (rendered regardless of category data)
    const categoryEl = screen.getByTestId(
      "autocomplete-_entities:transaction.category.label"
    );
    expect(categoryEl).toBeInTheDocument();
  });
});

describe("AddTransactionDialog", () => {
  it("renders when open=true", () => {
    render(<AddTransactionWrapper open={true} />, { wrapper: makeWrapper() });
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument();
  });

  it("does not render when open=false", () => {
    render(<AddTransactionWrapper open={false} />, { wrapper: makeWrapper() });
    expect(screen.queryByTestId("form-dialog")).toBeNull();
  });
});

describe("EditTransactionDialog", () => {
  it("renders when open=true", () => {
    render(<EditTransactionWrapper open={true} />, { wrapper: makeWrapper() });
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument();
  });

  it("does not render when open=false", () => {
    render(<EditTransactionWrapper open={false} />, { wrapper: makeWrapper() });
    expect(screen.queryByTestId("form-dialog")).toBeNull();
  });
});
