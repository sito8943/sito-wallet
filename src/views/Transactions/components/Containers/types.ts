import { Dispatch, SetStateAction } from "react";

// @sito/dashboard-app
import { Action } from "@sito/dashboard";
import { UseActionDialog } from "@sito/dashboard-app";

// lib
import { CommonTransactionCategoryDto, TransactionDto } from "lib";

// types
import { TransactionFormType } from "../../types";

export type TransactionContainerPropsType = {
  accountId: number;
  categories: CommonTransactionCategoryDto[];
  getActions: (record: TransactionDto) => Action<TransactionDto>[];
  editAction: UseActionDialog<TransactionDto, TransactionFormType>;
  showFilters?: boolean;
  setShowFilters?: Dispatch<SetStateAction<boolean>>;
};
