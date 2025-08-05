// transaction
import {
  useAddTransaction,
  UseAddTransactionActionDialog,
} from "../../Transactions";

// hooks
import { useAddTransactionAction } from "./useAddTransactionAction";

// lib
import { TransactionCategoryDto } from "lib";

export function useAddTransactionDialog(): UseAddTransactionActionDialog<TransactionCategoryDto> {
  const { onClick, ...rest } = useAddTransaction();

  const { action } = useAddTransactionAction({
    onClick: (account) => {
      onClick();
      if (rest.setValue)
        rest.setValue("account", account as TransactionCategoryDto);
    },
  });

  return {
    action,
    onClick,
    ...rest,
  };
}
