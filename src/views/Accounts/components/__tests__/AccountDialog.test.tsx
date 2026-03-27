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
  FormDialog: ({
    children,
    open,
  }: {
    children: React.ReactNode;
    open: boolean;
  }) => (open ? <div data-testid="form-dialog">{children}</div> : null),
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
  }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
  }) => (
    <textarea
      data-testid={`paragraph-input-${label}`}
      value={value ?? ""}
      onChange={onChange}
      aria-label={label}
      disabled={disabled}
    />
  ),
  SelectInput: ({
    value,
    onChange,
    label,
    options,
    children,
    disabled,
  }: {
    value?: unknown;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    label?: string;
    options?: Array<{ id: number; name: string }>;
    children?: React.ReactNode;
    disabled?: boolean;
  }) => (
    <div>
      <select
        data-testid={`select-${label}`}
        value={(value as string | number | undefined) ?? ""}
        onChange={onChange}
        aria-label={label}
        disabled={disabled}
      >
        {options?.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      {children}
    </div>
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
  enumToKeyValueArray: (enumObj: object) =>
    Object.entries(enumObj)
      .filter(([, v]) => typeof v === "number")
      .map(([key, value]) => ({ key, value })),
  Option: class {},
}));

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));
vi.mock("@fortawesome/free-solid-svg-icons", () => ({
  faWallet: "wallet",
  faCreditCard: "credit-card",
  faPiggyBank: "piggy-bank",
}));

const mockCurrenciesCommon = vi.fn(() => ({
  data: [{ id: 1, name: "Euro", symbol: "€" }],
  isLoading: false,
}));

vi.mock("hooks", () => ({
  useCurrenciesCommon: () => mockCurrenciesCommon(),
}));

vi.mock("lib", () => ({
  Tables: { Accounts: "accounts" },
  AccountType: { Debit: 0, Credit: 1, Savings: 2 },
}));

vi.mock("../utils", () => ({
  icons: { 0: "wallet", 1: "credit-card", 2: "piggy-bank" },
}));

import {
  AccountForm,
  AddAccountDialog,
  EditAccountDialog,
} from "../AccountDialog";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

function AccountFormWrapper({
  open,
  setValue: externalSetValue,
  isLoading = false,
}: {
  open: boolean;
  setValue?: ReturnType<typeof useForm>["setValue"];
  isLoading?: boolean;
}) {
  const form = useForm({
    defaultValues: {
      id: undefined,
      userId: 0,
      name: "",
      balance: "",
      type: 0,
      currency: null,
      description: "",
    },
  });
  return (
    <AccountForm
      open={open}
      control={form.control}
      setValue={externalSetValue ?? form.setValue}
      isLoading={isLoading}
    />
  );
}

function AddAccountWrapper({ open }: { open: boolean }) {
  const form = useForm({
    defaultValues: {
      id: undefined,
      userId: 0,
      name: "",
      balance: "",
      type: 0,
      currency: null,
      description: "",
    },
  });
  return (
    <AddAccountDialog
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

function EditAccountWrapper({ open }: { open: boolean }) {
  const form = useForm({
    defaultValues: {
      id: 1,
      userId: 99,
      name: "My Wallet",
      balance: undefined,
      type: 0,
      currency: { id: 1, name: "Euro" },
      description: "",
    },
  });
  return (
    <EditAccountDialog
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

describe("AccountForm", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 99, email: "test@example.com" },
    });
    mockCurrenciesCommon.mockReturnValue({
      data: [{ id: 1, name: "Euro", symbol: "€" }],
      isLoading: false,
    });
  });

  it("auto-sets userId from account when form opens", () => {
    const setValue = vi.fn();

    const { rerender } = render(
      <AccountFormWrapper open={false} setValue={setValue} />,
      { wrapper: makeWrapper() },
    );

    rerender(<AccountFormWrapper open={true} setValue={setValue} />);

    expect(setValue).toHaveBeenCalledWith("userId", 99);
  });

  it("sets userId to 0 when account.id is undefined", () => {
    mockUseAuth.mockReturnValue({ account: { id: undefined } });
    const setValue = vi.fn();

    render(<AccountFormWrapper open={true} setValue={setValue} />, {
      wrapper: makeWrapper(),
    });

    expect(setValue).toHaveBeenCalledWith("userId", 0);
  });

  it("does not set userId when account is null", () => {
    mockUseAuth.mockReturnValue({ account: null });
    const setValue = vi.fn();

    render(<AccountFormWrapper open={true} setValue={setValue} />, {
      wrapper: makeWrapper(),
    });

    expect(setValue).not.toHaveBeenCalled();
  });
});

describe("AddAccountDialog", () => {
  it("renders when open=true", () => {
    render(<AddAccountWrapper open={true} />, { wrapper: makeWrapper() });
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument();
  });

  it("does not render when open=false", () => {
    render(<AddAccountWrapper open={false} />, { wrapper: makeWrapper() });
    expect(screen.queryByTestId("form-dialog")).toBeNull();
  });
});

describe("EditAccountDialog", () => {
  it("renders when open=true", () => {
    render(<EditAccountWrapper open={true} />, { wrapper: makeWrapper() });
    expect(screen.getByTestId("form-dialog")).toBeInTheDocument();
  });

  it("does not render when open=false", () => {
    render(<EditAccountWrapper open={false} />, { wrapper: makeWrapper() });
    expect(screen.queryByTestId("form-dialog")).toBeNull();
  });
});
