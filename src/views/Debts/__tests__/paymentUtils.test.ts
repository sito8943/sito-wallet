import { describe, expect, it } from "vitest";

import type { DebtPaymentDto } from "lib";

import {
  debtPaymentDtoToForm,
  debtPaymentFormToUpdateDto,
} from "../utils";

const payment = {
  id: 12,
  debtId: 4,
  amount: 25.5,
  paidAt: "2026-08-08T12:30:00",
  note: "First payment",
} as DebtPaymentDto;

describe("debt payment edit helpers", () => {
  it("hydrates the edit form without changing the transaction link", () => {
    expect(debtPaymentDtoToForm(payment)).toEqual({
      debtId: 4,
      amount: "25.5",
      paidAt: "2026-08-08T12:30",
      note: "First payment",
      autoCreateTransaction: false,
      account: null,
      category: null,
    });
  });

  it("maps editable fields and preserves the payment identity", () => {
    expect(
      debtPaymentFormToUpdateDto(
        {
          debtId: 4,
          amount: "20.25",
          paidAt: "2026-08-09T09:15",
          note: "  Corrected payment  ",
          autoCreateTransaction: false,
          account: null,
          category: null,
        },
        payment,
      ),
    ).toEqual({
      id: 12,
      debtId: 4,
      amount: 20.25,
      paidAt: "2026-08-09T09:15",
      note: "Corrected payment",
    });
  });
});
