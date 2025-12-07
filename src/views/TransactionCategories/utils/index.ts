import {
  TransactionCategoryDto,
  TransactionType,
  UpdateTransactionCategoryDto,
} from "lib";
import { TransactionCategoryFormType } from "../types";

export const formToDto = ({
  id,
  name,
  description,
  type,
  userId,
}: TransactionCategoryFormType): UpdateTransactionCategoryDto => {
  return {
    id,
    name,
    description,
    type: type,
    userId: userId,
  };
};

export const dtoToForm = (
  dto: TransactionCategoryDto
): TransactionCategoryFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
});

export const addEmptyTransactionCategory: Omit<
  TransactionCategoryFormType,
  "id"
> = {
  name: "",
  description: "",
  type: TransactionType.In,
  userId: 0,
  initial: false,
};

export const emptyTransactionCategory: TransactionCategoryFormType = {
  id: 0,
  name: "",
  description: "",
  type: TransactionType.In,
  userId: 0,
  initial: false,
};
