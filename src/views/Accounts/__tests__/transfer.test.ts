import { describe, expect, it } from "vitest";

import type { AccountDto, CommonAccountDto } from "lib";

import { getEligibleTransferAccounts, transferFormToDto } from "../utils";

const sourceAccount = {
  id: 1,
  name: "Main",
  balance: 100,
  currency: { id: 10, name: "EUR", symbol: "€" },
} as AccountDto;

describe("account transfer helpers", () => {
  it("only returns other accounts with the same currency", () => {
    const accounts = [
      sourceAccount,
      {
        id: 2,
        name: "Savings",
        currency: { id: 10, name: "EUR", symbol: "€" },
      },
      {
        id: 3,
        name: "Dollar account",
        currency: { id: 11, name: "USD", symbol: "$" },
      },
    ] as CommonAccountDto[];

    expect(getEligibleTransferAccounts(accounts, sourceAccount)).toEqual([
      accounts[1],
    ]);
  });

  it("maps the selected accounts and normalized values to the API payload", () => {
    const destinationAccount = {
      id: 2,
      name: "Savings",
      currency: { id: 10, name: "EUR", symbol: "€" },
    } as CommonAccountDto;

    expect(
      transferFormToDto(
        {
          destinationAccount,
          amount: "25.50",
          date: "2026-06-22T12:08",
          description: "  Savings  ",
        },
        sourceAccount,
      ),
    ).toEqual({
      sourceAccountId: 1,
      destinationAccountId: 2,
      amount: 25.5,
      date: "2026-06-22T12:08",
      description: "Savings",
    });
  });
});
