import {
  formatForDatetimeLocal,
  TransactionDto,
  TransactionType,
  UpdateTransactionDto,
} from "lib";
import { TransactionFormType } from "../types";

export const formToDto = ({
  account,
  category,
  ...data
}: TransactionFormType): UpdateTransactionDto => {
  return {
    ...data,
    accountId: account?.id ?? 0,
    categoryId: category?.id ?? 0,
  };
};

export const dtoToForm = (dto: TransactionDto): TransactionFormType => ({
  ...dto,
  accountId: dto.account?.id ?? 0,
  categoryId: dto.category?.id ?? 0,
  date: formatForDatetimeLocal(dto.date),
});

export const emptyTransaction: TransactionFormType = {
  id: 0,
  name: "",
  description: "",
  type: TransactionType.In,
  account: null,
  category: null,
  amount: 0,
  date: formatForDatetimeLocal(),
};
