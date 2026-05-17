import type { ActionType } from "@sito/dashboard-app";

import type { TransactionDto, TransactionType } from "lib";

import type { WeeklyTransactionsScopeType } from "../../utils";

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
