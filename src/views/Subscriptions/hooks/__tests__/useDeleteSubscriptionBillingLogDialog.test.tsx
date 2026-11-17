import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { NotificationProvider, TranslationProvider } from "@sito/dashboard-app";

const { mockDeleteBillingLog } = vi.hoisted(() => ({
  mockDeleteBillingLog: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("providers", () => ({
  useManager: () => ({
    Subscriptions: { deleteBillingLog: mockDeleteBillingLog },
  }),
}));

vi.mock("hooks", () => ({
  AccountsQueryKeys: { all: () => ({ queryKey: ["accounts"] }) },
  SubscriptionsQueryKeys: { all: () => ({ queryKey: ["subscriptions"] }) },
  TransactionsQueryKeys: { all: () => ({ queryKey: ["transactions"] }) },
}));

import { useDeleteSubscriptionBillingLogDialog } from "../useDeleteSubscriptionBillingLogDialog";

const setup = (subscriptionId: number | null = 5) => {
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
  return renderHook(
    () => useDeleteSubscriptionBillingLogDialog(subscriptionId),
    { wrapper },
  );
};

describe("useDeleteSubscriptionBillingLogDialog", () => {
  beforeEach(() => {
    mockDeleteBillingLog.mockReset();
  });

  it("asks for confirmation before deleting the billing log", async () => {
    mockDeleteBillingLog.mockResolvedValue(1);
    const { result } = setup();

    expect(result.current.title).toBe(
      "_pages:subscriptions.actions.deleteBillingLog.confirmTitle",
    );

    await act(() => result.current.onClick(12));
    expect(result.current.open).toBe(true);
    expect(mockDeleteBillingLog).not.toHaveBeenCalled();

    act(() => result.current.handleSubmit());

    await waitFor(() => expect(result.current.open).toBe(false));
    expect(mockDeleteBillingLog).toHaveBeenCalledWith(5, 12);
  });

  it("does not delete when the dialog is dismissed", async () => {
    const { result } = setup();

    await act(() => result.current.onClick(12));
    act(() => result.current.handleClose());

    expect(result.current.open).toBe(false);
    expect(mockDeleteBillingLog).not.toHaveBeenCalled();
  });
});
