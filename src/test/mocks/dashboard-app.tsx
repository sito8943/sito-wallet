/**
 * Shared factory for mocking @sito/dashboard-app.
 * Import and spread inside vi.mock() factory functions.
 */
import { vi } from "vitest";
import { ReactNode } from "react";

export const mockUseAuth = vi.fn(() => ({
  account: { id: 1, email: "test@example.com" },
  isInGuestMode: vi.fn(() => false),
}));

export const mockUseTranslation = vi.fn(() => ({
  t: (key: string, opts?: Record<string, unknown>) =>
    (opts?.defaultValue as string) ?? key,
}));

export const mockFromLocal = vi.fn(() => null);
export const mockToLocal = vi.fn();
export const mockIsMac = vi.fn(() => false);
export const mockUseTimeAge = vi.fn(() => ({
  timeAge: vi.fn(() => "just now"),
}));
export const mockUseNotification = vi.fn(() => ({
  showErrorNotification: vi.fn(),
  showSuccessNotification: vi.fn(),
}));
export const mockUseTableOptions = vi.fn(() => ({
  sortingBy: "date",
  sortingOrder: "desc" as const,
  currentPage: 1,
  pageSize: 10,
  filters: {},
}));
export const mockUsePostForm = vi.fn(() => ({
  control: {},
  isLoading: false,
  onSubmit: vi.fn(),
  handleSubmit: vi.fn(),
  reset: vi.fn(),
}));
export const mockQueryClient = {
  invalidateQueries: vi.fn(),
  refetchQueries: vi.fn(),
};
export const mockUseImportAction = vi.fn(({ onClick }: { onClick: () => void }) => ({
  action: () => ({ id: "import", onClick }),
}));

// Simple stub components
export const Dialog = ({
  children,
  open,
}: {
  children: ReactNode;
  open: boolean;
}) => (open ? <div data-testid="dialog">{children}</div> : null);

export const DialogActions = ({
  onPrimaryClick,
  onCancel,
  primaryText,
  cancelText,
}: {
  onPrimaryClick?: () => void;
  onCancel?: () => void;
  primaryText?: string;
  cancelText?: string;
}) => (
  <div>
    <button data-testid="btn-primary" onClick={onPrimaryClick}>
      {primaryText ?? "OK"}
    </button>
    <button data-testid="btn-cancel" onClick={onCancel}>
      {cancelText ?? "Cancel"}
    </button>
  </div>
);

export const FormDialog = ({
  children,
  open,
}: {
  children: ReactNode;
  open: boolean;
}) => (open ? <div data-testid="form-dialog">{children}</div> : null);

export const Notification = () => <div data-testid="notification" />;
export const Error = ({ error }: { error: Error }) => (
  <div data-testid="error-boundary">{error.message}</div>
);
export const ToTop = () => <div data-testid="to-top" />;
export const Onboarding = ({ steps }: { steps: string[] }) => (
  <div data-testid="onboarding" data-steps={steps.join(",")} />
);
export const Loading = ({ className }: { className?: string }) => (
  <div data-testid="loading" className={className} />
);
export const IconButton = ({
  onClick,
  disabled,
  className,
}: {
  onClick?: () => void;
  disabled?: boolean;
  icon?: unknown;
  className?: string;
}) => (
  <button
    data-testid="icon-button"
    onClick={onClick}
    disabled={disabled}
    className={className}
  />
);
export const TextInput = ({
  value,
  onChange,
  label,
  required,
  disabled,
  ...rest
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  [k: string]: unknown;
}) => (
  <input
    data-testid={`text-input-${label}`}
    value={value ?? ""}
    onChange={onChange}
    aria-label={label}
    required={required}
    disabled={disabled}
    {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
  />
);
export const ParagraphInput = ({
  value,
  onChange,
  label,
  disabled,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label?: string;
  disabled?: boolean;
}) => (
  <textarea
    data-testid={`paragraph-input-${label}`}
    value={value ?? ""}
    onChange={onChange}
    aria-label={label}
    disabled={disabled}
  />
);
export const SelectInput = ({
  value,
  onChange,
  label,
  options,
  children,
}: {
  value?: unknown;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label?: string;
  options?: Array<{ id: number; name: string }>;
  children?: ReactNode;
}) => (
  <div>
    <select
      data-testid={`select-input-${label}`}
      value={value as string | number | undefined}
      onChange={onChange}
      aria-label={label}
    >
      {options?.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
    {children}
  </div>
);
export const AutocompleteInput = ({
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
    data-testid={`autocomplete-input-${label}`}
    value={(value as { id: number } | undefined)?.id ?? ""}
    onChange={(e) => {
      const opt = options?.find((o) => o.id === Number(e.target.value));
      onChange?.(opt ?? null);
    }}
    aria-label={label}
    disabled={disabled}
  >
    <option value="">-- select --</option>
    {options?.map((o) => (
      <option key={o.id} value={o.id}>
        {o.name}
      </option>
    ))}
  </select>
);

export const ConfigProvider = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);
export const TableOptionsProvider = ({
  children,
}: {
  children: ReactNode;
}) => <>{children}</>;
export const Page = ({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) => (
  <div data-testid="page" data-title={title}>
    {children}
  </div>
);

export const enumToKeyValueArray = (enumObj: object) =>
  Object.entries(enumObj)
    .filter(([, v]) => typeof v === "number")
    .map(([key, value]) => ({ key, value }));

export const ValidationError = class ValidationError extends Error {
  fields?: Record<string, string>;
};

export const useDeleteDialog = vi.fn(() => ({
  action: vi.fn(() => ({ id: "delete", onClick: vi.fn() })),
}));
export const useRestoreDialog = vi.fn(() => ({
  action: vi.fn(() => ({ id: "restore", onClick: vi.fn() })),
}));
export const useExportActionMutate = vi.fn(() => ({
  action: vi.fn(() => ({ id: "export", onClick: vi.fn() })),
}));
export const useImportDialog = vi.fn(() => ({
  open: false,
  handleClose: vi.fn(),
  handleSubmit: vi.fn(),
  isLoading: false,
  fileProcessor: vi.fn(),
  onFileProcessed: vi.fn(),
  onOverrideChange: vi.fn(),
  action: () => ({ id: "import", onClick: vi.fn() }),
}));

export const ImportDialog = ({
  open,
}: {
  open?: boolean;
}) =>
  open ? <div data-testid="import-dialog" /> : null;

export const ConfirmationDialog = ({
  open,
}: {
  open?: boolean;
}) =>
  open ? <div data-testid="confirmation-dialog" /> : null;

export const TabsLayout = ({
  tabs,
  defaultTab,
}: {
  tabs: Array<{ id: number; label: string; content: ReactNode }>;
  defaultTab?: number;
  className?: string;
  tabsContainerClassName?: string;
}) => (
  <div data-testid="tabs-layout">
    {tabs.map((tab) => (
      <div
        key={tab.id}
        data-testid={`tab-${tab.id}`}
        data-active={tab.id === defaultTab}
      >
        {tab.label}
      </div>
    ))}
  </div>
);

export const Empty = ({
  message,
}: {
  message: string;
  iconProps?: unknown;
  action?: unknown;
}) => <div data-testid="empty-state">{message}</div>;

export const GlobalActions = { Add: "add" };
