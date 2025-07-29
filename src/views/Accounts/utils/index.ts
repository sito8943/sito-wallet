import { AccountDto, AccountType, UpdateAccountDto } from "lib";
import { AccountFormType } from "../types";

export const formToDto = ({
  id,
  name,
  description,
  type,
  currency,
}: AccountFormType): UpdateAccountDto => {
  return {
    id,
    name,
    description,
    type: type,
    currencyId: currency?.id ?? 0,
  };
};

export const dtoToForm = (dto: AccountDto): AccountFormType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  type: dto.type,
  currency: dto.currency,
});

export const emptyAccount: AccountFormType = {
  id: 0,
  name: "",
  description: "",
  type: AccountType.Physical,
  currency: null,
};
