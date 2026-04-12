import { ActionType } from "@sito/dashboard-app";

import { TransactionDto, TransactionType } from "lib";

import { WeeklyTransactionsScopeType } from "../../utils";

export type WeeklyTransactionsDialogPropsType = {
  open: boolean;
  onClose: () => void;
  accountId?: number | null;
  type: TransactionType;
  title: string;
  weekScope?: WeeklyTransactionsScopeType;
  getActions: (record: TransactionDto) => ActionType<TransactionDto>[];
  onTransactionClick: (id: number) => void;
};
