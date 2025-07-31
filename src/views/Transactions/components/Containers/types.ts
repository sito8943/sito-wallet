import { Action } from "@sito/dashboard";

// hooks
import { UseActionDialog } from "hooks";

// lib
import { CommonAccountDto, TransactionDto } from "lib";

// types
import { TransactionFormType } from "../../types";
import { Dispatch, SetStateAction } from "react";

export type TransactionContainerPropsType = {
  accountId: number;
  accounts: CommonAccountDto[];
  getActions: (record: TransactionDto) => Action<TransactionDto>[];
  editAction: UseActionDialog<TransactionDto, TransactionFormType>;
  showFilters?: boolean;
  setShowFilters?: Dispatch<SetStateAction<boolean>>;
};
