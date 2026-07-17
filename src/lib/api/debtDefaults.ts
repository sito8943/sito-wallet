import { DebtStatus, type FilterDebtDto } from "../entities/debt";

export const defaultDebtsListFilters: FilterDebtDto = {
  softDeleteScope: "ACTIVE",
  status: [DebtStatus.Open, DebtStatus.PartiallyPaid],
};
