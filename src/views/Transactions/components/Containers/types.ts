import type { Dispatch, SetStateAction } from "react";

// @sito/dashboard-app
import type { UseActionDialog, ActionType } from "@sito/dashboard-app";

// lib
import type { CommonTransactionCategoryDto, TransactionDto } from "lib";

// types
import type { TransactionFormType } from "../../types";

export type TransactionContainerPropsType = {
  accountId: number;
  categories: CommonTransactionCategoryDto[];
  getActions: (record: TransactionDto) => ActionType<TransactionDto>[];
  editAction: UseActionDialog<TransactionDto, TransactionFormType>;
  hideDeletedEntities?: boolean;
  showFilters?: boolean;
  setShowFilters?: Dispatch<SetStateAction<boolean>>;
  onCategoryClick?: (id: number) => void;
};
