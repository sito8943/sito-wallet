import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { NotificationProvider, TranslationProvider } from "@sito/dashboard-app";

const { mockDeletePayment } = vi.hoisted(() => ({
  mockDeletePayment: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("providers", () => ({
  useManager: () => ({ Debts: { deletePayment: mockDeletePayment } }),
}));

vi.mock("hooks", () => ({
  AccountsQueryKeys: { all: () => ({ queryKey: ["accounts"] }) },
  DebtsQueryKeys: { all: () => ({ queryKey: ["debts"] }) },
}));

import { useDeleteDebtPaymentDialog } from "../useDeleteDebtPaymentDialog";

const setup = (debtId: number | null = 3) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <TranslationProvider t={(key: string) => key} language="en">
        <NotificationProvider>{children}</NotificationProvider>
      </TranslationProvider>
    </QueryClientProvider>
  );
  return renderHook(() => useDeleteDebtPaymentDialog(debtId), { wrapper });
};

describe("useDeleteDebtPaymentDialog", () => {
  beforeEach(() => {
    mockDeletePayment.mockReset();
  });

  it("asks for confirmation before deleting the payment", async () => {
    mockDeletePayment.mockResolvedValue(undefined);
    const { result } = setup();

    expect(result.current.title).toBe(
      "_pages:debts.actions.deletePayment.confirmTitle",
    );

    await act(() => result.current.onClick(11));
    expect(result.current.open).toBe(true);
    expect(mockDeletePayment).not.toHaveBeenCalled();

    act(() => result.current.handleSubmit());

    await waitFor(() => expect(result.current.open).toBe(false));
    expect(mockDeletePayment).toHaveBeenCalledWith(3, 11);
  });

  it("does not delete when the dialog is dismissed", async () => {
    const { result } = setup();

    await act(() => result.current.onClick(11));
    act(() => result.current.handleClose());

    expect(result.current.open).toBe(false);
    expect(mockDeletePayment).not.toHaveBeenCalled();
  });
});
