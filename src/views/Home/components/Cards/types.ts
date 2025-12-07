import {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  TransactionType,
} from "lib";
import { ReactNode } from "react";

export type ActiveFiltersPropsType = {
  accounts?: CommonAccountDto[];
  clearAccounts: () => void;
  categories?: CommonTransactionCategoryDto[];
  clearCategories: () => void;
  startDate?: string;
  endDate?: string;
  clearDate: () => void;
  type: TransactionType;
};

export type BaseCardPropsType = {
  className?: string;
  children: ReactNode;
};
