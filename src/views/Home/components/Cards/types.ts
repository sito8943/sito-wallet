import {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  TransactionType,
} from "lib";

export type ActiveFiltersPropsType = {
  accounts: CommonAccountDto[];
  clearAccounts: () => void;
  categories: CommonTransactionCategoryDto[];
  clearCategories: () => void;
  startDate: string;
  endDate: string;
  clearDate: () => void;
  type: TransactionType;
};
