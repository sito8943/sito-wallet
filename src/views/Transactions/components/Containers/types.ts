import { Action } from "@sito/dashboard";

// hooks
import { UseActionDialog } from "hooks";

// lib
import { CommonAccountDto, TransactionDto } from "lib";

// types
import { TransactionFormType } from "../../types";

export type TransactionContainerPropsType = {
  accountId: number;
  accounts: CommonAccountDto[];
  getActions: (record: TransactionDto) => Action<TransactionDto>[];
  editAction: UseActionDialog<TransactionDto, TransactionFormType>;
};
