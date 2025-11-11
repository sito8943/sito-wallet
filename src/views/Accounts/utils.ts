import { AccountDto, AccountType, AddAccountDto, UpdateAccountDto } from "lib";
import { AccountFormType } from "./types";

export const formToUpdateDto = ({
  currency,
  userId,
  ...rest
}: AccountFormType): UpdateAccountDto => {
  return {
    ...rest,
    currencyId: currency?.id ?? 0,
    userId: userId,
  };
};

export const formToAddDto = ({
  currency,
  userId,
  ...rest
}: AccountFormType): AddAccountDto => {
  return {
    ...rest,
    currencyId: currency?.id ?? 0,
    userId: userId,
  };
};

export const dtoToForm = (dto: AccountDto): AccountFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
});

export const emptyAccount: AccountFormType = {
  id: 0,
  name: "",
  balance: 0,
  description: "",
  type: AccountType.Physical,
  currency: null,
  userId: 0,
};
