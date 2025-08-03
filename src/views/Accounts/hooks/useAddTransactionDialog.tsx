// transaction
import {
  useAddTransaction,
  UseAddTransactionActionDialog,
} from "../../Transactions";

// hooks
import { useAddTransactionAction } from "./useAddTransactionAction";

// lib
import { AccountDto } from "lib";

export function useAddTransactionDialog(): UseAddTransactionActionDialog {
  const { onClick, ...rest } = useAddTransaction();

  const { action } = useAddTransactionAction({
    onClick: (account) => {
      onClick();
      if (rest.setValue) rest.setValue("account", account as AccountDto);
    },
  });

  return {
    action,
    onClick,
    lockAccount: true,
    ...rest,
  };
}
