import { TransactionDto, TransactionType, UpdateTransactionDto } from "lib";
import { TransactionFormType } from "../types";

export const formToDto = ({
  account,
  ...data
}: TransactionFormType): UpdateTransactionDto => {
  return {
    ...data,
    accountId: account?.id ?? 0,
  };
};

export const dtoToForm = (dto: TransactionDto): TransactionFormType => ({
  ...dto,
  accountId: dto.account?.id ?? 0,
});

export const emptyTransaction: TransactionFormType = {
  id: 0,
  name: "",
  description: "",
  type: TransactionType.In,
  account: null,
  amount: 0,
};
