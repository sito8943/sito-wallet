// transaction
import { TransactionFormType, useAddTransaction } from "../../Transactions";

// hooks
import { UseActionDialog } from "hooks";
import { useAddTransactionAction } from "./useAddTransactionAction";

// lib
import { AccountDto } from "lib";

export function useAddTransactionDialog(): UseActionDialog<
  AccountDto,
  TransactionFormType
> {
  const { onClick, ...rest } = useAddTransaction();

  const { action } = useAddTransactionAction({
    onClick,
  });

  return {
    action,
    onClick,
    ...rest,
  };
}
