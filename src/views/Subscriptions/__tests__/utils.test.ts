import { describe, expect, it } from "vitest";

import type {
  CommonPurchaseProviderDto,
  SubscriptionBillingLogDto,
  SubscriptionDto,
} from "lib";

import {
  emptySubscriptionForm,
  isValidPickedRenewalDate,
  subscriptionBillingLogFormToUpdateDto,
  subscriptionDtoToForm,
  subscriptionFormToCreateDto,
  subscriptionFormToUpdateDto,
} from "../utils";

const purchaseProvider = {
  id: 7,
  name: "Landlord",
  updatedAt: new Date(),
} as CommonPurchaseProviderDto;

const subscription = {
  id: 3,
  name: "Rent",
  amount: 500,
  provider: null,
  account: null,
  currency: null,
  billingFrequency: 1,
  billingUnit: "MONTH",
  status: "ACTIVE",
  autoCreateTransaction: false,
  purchaseProvider,
} as SubscriptionDto;

describe("subscription purchase provider mapping", () => {
  it("loads the purchase provider from the dto", () => {
    expect(subscriptionDtoToForm(subscription).purchaseProvider).toEqual(
      purchaseProvider,
    );
  });

  it("defaults to null when the dto has no purchase provider", () => {
    const form = subscriptionDtoToForm({
      ...subscription,
      purchaseProvider: undefined,
    });

    expect(form.purchaseProvider).toBeNull();
    expect(emptySubscriptionForm.purchaseProvider).toBeNull();
  });

  it("sends the purchase provider id on create", () => {
    const form = subscriptionDtoToForm(subscription);

    expect(subscriptionFormToCreateDto(form).purchaseProviderId).toBe(7);
  });

  it("sends 0 on update when the purchase provider is cleared", () => {
    const form = {
      ...subscriptionDtoToForm(subscription),
      purchaseProvider: null,
    };

    expect(subscriptionFormToUpdateDto(form)).toMatchObject({
      id: 3,
      purchaseProviderId: 0,
    });
  });
});

describe("isValidPickedRenewalDate", () => {
  const now = new Date(2026, 10, 27, 10, 0);

  it("accepts an empty or unchanged date, even when it is past", () => {
    expect(isValidPickedRenewalDate("", "2026-11-17T10:00", now)).toBe(true);
    expect(
      isValidPickedRenewalDate("2026-11-17T10:00", "2026-11-17T10:00", now),
    ).toBe(true);
  });

  it("accepts a changed future date and rejects a changed past one", () => {
    expect(
      isValidPickedRenewalDate("2026-11-28T09:00", "2026-11-17T10:00", now),
    ).toBe(true);
    expect(
      isValidPickedRenewalDate("2026-11-27T09:00", "2026-11-17T10:00", now),
    ).toBe(false);
  });
});

describe("subscriptionBillingLogFormToUpdateDto", () => {
  it("builds the PATCH payload with ids, amount and currency", () => {
    expect(
      subscriptionBillingLogFormToUpdateDto(
        {
          subscriptionId: 7,
          amount: "21.5",
          paidAt: "2026-11-27T09:00",
          currency: { id: 3, name: "EUR", symbol: "€" },
          note: " ",
          autoCreateTransaction: false,
        },
        { id: 11 } as SubscriptionBillingLogDto,
      ),
    ).toEqual({
      id: 11,
      subscriptionId: 7,
      amount: 21.5,
      paidAt: "2026-11-27T09:00",
      currencyId: 3,
      note: "",
    });
  });
});
