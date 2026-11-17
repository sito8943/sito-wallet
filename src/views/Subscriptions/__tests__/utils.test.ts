import { describe, expect, it } from "vitest";

import type { CommonPurchaseProviderDto, SubscriptionDto } from "lib";

import {
  emptySubscriptionForm,
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

  it("sends null on update when the purchase provider is cleared", () => {
    const form = {
      ...subscriptionDtoToForm(subscription),
      purchaseProvider: null,
    };

    expect(subscriptionFormToUpdateDto(form)).toMatchObject({
      id: 3,
      purchaseProviderId: null,
    });
  });
});
