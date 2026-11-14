import { describe, expect, it } from "vitest";

import { GoalStatus } from "lib";

import {
  emptyGoalForm,
  getProductPrefill,
  goalDtoToForm,
  goalFormToAddDto,
  goalFormToUpdateDto,
  isAccountUsedByOtherActiveGoal,
} from "../utils";
import type { GoalFormType } from "../types";

import { bikeProduct, buildGoal, eur, savingsAccount, usd } from "./fixtures";

const form = (overrides: Partial<GoalFormType> = {}): GoalFormType => ({
  ...emptyGoalForm,
  ...overrides,
});

describe("getProductPrefill", () => {
  it("fills name, target and currency on an empty form", () => {
    expect(getProductPrefill(form(), bikeProduct)).toEqual({
      name: "Bike",
      autoName: "Bike",
      targetAmount: "499.99",
      currency: eur,
    });
  });

  it("keeps a name the user typed", () => {
    const patch = getProductPrefill(form({ name: "My bike" }), bikeProduct);

    expect(patch.name).toBeUndefined();
    expect(patch.autoName).toBeUndefined();
  });

  it("replaces the name filled from the previous product", () => {
    const patch = getProductPrefill(
      form({ name: "Helmet", autoName: "Helmet" }),
      bikeProduct,
    );

    expect(patch.name).toBe("Bike");
  });

  it("uses the receipt name when the product has no alias", () => {
    const patch = getProductPrefill(form(), { ...bikeProduct, alias: null });

    expect(patch.name).toBe("BICI MTB 29");
  });

  it("keeps a target the user typed (and its currency)", () => {
    const patch = getProductPrefill(form({ targetAmount: "300" }), bikeProduct);

    expect(patch.targetAmount).toBeUndefined();
    expect(patch.currency).toBeUndefined();
  });

  it("does not touch the currency when an account sets it", () => {
    const patch = getProductPrefill(
      form({ account: savingsAccount, currency: usd }),
      bikeProduct,
    );

    expect(patch.targetAmount).toBe("499.99");
    expect(patch.currency).toBeUndefined();
  });

  it("skips the target without a last unit price", () => {
    const patch = getProductPrefill(form(), {
      ...bikeProduct,
      lastUnitPrice: null,
      lastUnitPriceCurrency: null,
    });

    expect(patch.targetAmount).toBeUndefined();
    expect(patch.currency).toBeUndefined();
  });

  it("does nothing when the product is cleared", () => {
    expect(getProductPrefill(form({ name: "Bike" }), null)).toEqual({});
  });
});

describe("goal form mapping", () => {
  it("maps a manual goal to the create payload", () => {
    const { payload, file } = goalFormToAddDto(
      form({
        name: "  Bike ",
        description: " ",
        product: bikeProduct,
        currency: eur,
        targetAmount: "500",
        savedAmount: "",
        deadline: "2026-12-31",
      }),
    );

    expect(payload).toEqual({
      name: "Bike",
      description: null,
      productId: bikeProduct.id,
      accountId: null,
      currencyId: eur.id,
      targetAmount: 500,
      savedAmount: 0,
      deadline: "2026-12-31",
    });
    expect(file).toBeNull();
  });

  it("uses the account currency and drops the saved amount with an account", () => {
    const { payload } = goalFormToAddDto(
      form({
        name: "Trip",
        account: savingsAccount,
        currency: eur,
        targetAmount: "1000",
        savedAmount: "50",
      }),
    );

    expect(payload.accountId).toBe(savingsAccount.id);
    expect(payload.currencyId).toBe(usd.id);
    expect(payload.savedAmount).toBeNull();
    expect(payload.deadline).toBeNull();
  });

  it("only removes the goal's own photo, and not when a file replaces it", () => {
    const base = form({
      id: 3,
      name: "Bike",
      currency: eur,
      targetAmount: "1",
    });

    expect(
      goalFormToUpdateDto({ ...base, removePhoto: true, hasOwnPhoto: true })
        .removePhoto,
    ).toBe(true);
    expect(
      goalFormToUpdateDto({ ...base, removePhoto: true, hasOwnPhoto: false })
        .removePhoto,
    ).toBe(false);

    const file = new File(["x"], "bike.png", { type: "image/png" });
    const withFile = goalFormToUpdateDto({
      ...base,
      file,
      removePhoto: true,
      hasOwnPhoto: true,
    });
    expect(withFile.removePhoto).toBe(false);
    expect(withFile.file).toBe(file);
    expect(withFile.payload.id).toBe(3);
  });

  it("loads a goal into the form, keeping only its own photo", () => {
    const fromProduct = goalDtoToForm(
      buildGoal({
        product: bikeProduct,
        photo: "products/5/photo",
        hasOwnPhoto: false,
      }),
    );
    expect(fromProduct.photo).toBe("");
    expect(fromProduct.autoName).toBe("Bike");
    expect(fromProduct.targetAmount).toBe("500");
    expect(fromProduct.savedAmount).toBe("125");

    const own = goalDtoToForm(
      buildGoal({
        name: "Dream bike",
        photo: "goals/1/photo",
        hasOwnPhoto: true,
      }),
    );
    expect(own.photo).toBe("goals/1/photo");
    expect(own.autoName).toBe("");
  });

  it("leaves the saved amount empty for account goals", () => {
    expect(
      goalDtoToForm(buildGoal({ account: savingsAccount })).savedAmount,
    ).toBe("");
  });
});

describe("isAccountUsedByOtherActiveGoal", () => {
  const goals = [
    buildGoal({ id: 1, account: savingsAccount }),
    buildGoal({
      id: 2,
      account: { ...savingsAccount, id: 11 },
      status: GoalStatus.Completed,
    }),
    buildGoal({
      id: 3,
      account: { ...savingsAccount, id: 12 },
      deletedAt: new Date("2026-11-02T00:00:00Z"),
    }),
  ];

  it("warns when another active goal tracks the account", () => {
    expect(isAccountUsedByOtherActiveGoal(goals, 10, 0)).toBe(true);
  });

  it("ignores the goal being edited", () => {
    expect(isAccountUsedByOtherActiveGoal(goals, 10, 1)).toBe(false);
  });

  it("ignores completed, deleted and missing accounts", () => {
    expect(isAccountUsedByOtherActiveGoal(goals, 11, 0)).toBe(false);
    expect(isAccountUsedByOtherActiveGoal(goals, 12, 0)).toBe(false);
    expect(isAccountUsedByOtherActiveGoal(goals, null, 0)).toBe(false);
  });
});
