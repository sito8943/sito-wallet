import { describe, expect, it } from "vitest";

import { DebtDirection } from "lib";

import type { DebtFormType } from "../types";
import { debtFormToLoanTransactionValues, isOutgoingLoan } from "../utils";

const form = (overrides: Partial<DebtFormType> = {}): DebtFormType => ({
  id: 0,
  counterpartyName: "Juan",
  counterpartyContact: "",
  title: "Préstamo mayo",
  description: "",
  direction: DebtDirection.Receivable,
  originalAmount: "150.5",
  currency: null,
  issuedAt: "2026-11-18T10:30",
  dueAt: "",
  ...overrides,
});

describe("isOutgoingLoan", () => {
  it("is true for money the user lends out", () => {
    expect(isOutgoingLoan(form())).toBe(true);
  });

  it("is false for money the user owes", () => {
    expect(isOutgoingLoan(form({ direction: DebtDirection.Payable }))).toBe(
      false,
    );
  });
});

describe("debtFormToLoanTransactionValues", () => {
  it("prefills amount, date and description, leaving account and category to pick", () => {
    expect(
      debtFormToLoanTransactionValues(form(), "Préstamo a Juan"),
    ).toMatchObject({
      amount: 150.5,
      date: "2026-11-18T10:30",
      description: "Préstamo a Juan",
      account: null,
      categories: [],
    });
  });
});
