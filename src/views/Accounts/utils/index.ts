import { AccountDto, AccountType, UpdateAccountDto } from "lib";
import { AccountFormType } from "../types";

export const formToDto = ({
  id,
  name,
  description,
  type,
}: AccountFormType): UpdateAccountDto => ({
  id,
  name,
  description,
  type: type,
});

export const dtoToForm = (dto: AccountDto): AccountFormType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  type: dto.type,
});

export const emptyAccount: AccountFormType = {
  id: 0,
  name: "",
  description: "",
  type: AccountType.Physical,
};
