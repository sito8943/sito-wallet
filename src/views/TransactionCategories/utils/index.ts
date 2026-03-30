import {
  TransactionCategoryDto,
  TransactionType,
  UpdateTransactionCategoryDto,
} from "lib";
import { TransactionCategoryFormType } from "../types";

export const DEFAULT_TRANSACTION_CATEGORY_COLOR = "#0d0d0d";

export const normalizeTransactionCategoryColor = (
  value?: string | null,
): string => {
  if (typeof value !== "string") return DEFAULT_TRANSACTION_CATEGORY_COLOR;

  const parsed = value.trim();

  return /^#([0-9A-Fa-f]{6})$/.test(parsed)
    ? parsed.toLowerCase()
    : DEFAULT_TRANSACTION_CATEGORY_COLOR;
};

export const formToDto = ({
  id,
  name,
  description,
  color,
  type,
  userId,
}: TransactionCategoryFormType): UpdateTransactionCategoryDto => {
  return {
    id,
    name,
    description,
    color: normalizeTransactionCategoryColor(color),
    type: type,
    userId: userId,
  };
};

export const dtoToForm = (
  dto: TransactionCategoryDto,
): TransactionCategoryFormType => ({
  ...dto,
  color: normalizeTransactionCategoryColor(dto.color),
  userId: dto.user?.id ?? 0,
});

export const addEmptyTransactionCategory: Omit<
  TransactionCategoryFormType,
  "id"
> = {
  name: "",
  description: "",
  color: DEFAULT_TRANSACTION_CATEGORY_COLOR,
  type: TransactionType.In,
  userId: 0,
  auto: false,
};

export const emptyTransactionCategory: TransactionCategoryFormType = {
  id: 0,
  name: "",
  description: "",
  color: DEFAULT_TRANSACTION_CATEGORY_COLOR,
  type: TransactionType.In,
  userId: 0,
  auto: false,
};
