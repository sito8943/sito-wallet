import type { AccountDto, AddAccountDto, UpdateAccountDto } from "lib";
import { AccountType } from "lib";
import type { AccountFormType } from "./types";

// bankName only applies to Card accounts; strip it otherwise and drop empty
// selections so we never persist a blank brand.
const normalizeBankName = (
  type: AccountType,
  bankName?: string,
): string | undefined => {
  if (type !== AccountType.Card) return undefined;
  const trimmed = bankName?.trim();
  return trimmed ? trimmed : undefined;
};

export const formToUpdateDto = ({
  currency,
  userId,
  bankName,
  ...rest
}: AccountFormType): UpdateAccountDto => {
  return {
    ...rest,
    bankName: normalizeBankName(rest.type, bankName),
    currencyId: currency?.id ?? 0,
    userId: userId,
  };
};

export const formToAddDto = ({
  currency,
  userId,
  bankName,
  ...rest
}: AccountFormType): AddAccountDto => {
  return {
    ...rest,
    bankName: normalizeBankName(rest.type, bankName),
    currencyId: currency?.id ?? 0,
    userId: userId,
  };
};

export const dtoToForm = (dto: AccountDto): AccountFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
});

export const addEmptyAccount: Omit<AccountFormType, "if"> = {
  name: "",
  balance: 0,
  description: "",
  type: AccountType.Physical,
  bankName: "",
  currency: null,
  userId: 0,
};

export const emptyAccount: AccountFormType = {
  id: 0,
  name: "",
  balance: 0,
  description: "",
  type: AccountType.Physical,
  bankName: "",
  currency: null,
  userId: 0,
};
