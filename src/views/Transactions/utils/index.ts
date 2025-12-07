// @sito/dashboard-app
import { formatForDatetimeLocal } from "@sito/dashboard-app";

import {
  CommonAccountDto,
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
    type: data.type as TransactionType,
  };
};

export const dtoToForm = (dto: TransactionDto): TransactionFormType => ({
  ...dto,
  accountId: dto.account?.id ?? 0,
  categoryId: dto.category?.id ?? 0,
  date: formatForDatetimeLocal(dto.date),
});

export const addEmptyTransaction = (
  account: CommonAccountDto | null = null
): Omit<TransactionFormType, "id"> => ({
  initial: false,
  description: "",
  account,
  category: null,
  amount: 0,
  date: formatForDatetimeLocal(),
});

export const emptyTransaction = (
  account: CommonAccountDto | null = null
): TransactionFormType => ({
  id: 0,
  initial: false,
  description: "",
  account,
  category: null,
  amount: 0,
  date: formatForDatetimeLocal(),
});
