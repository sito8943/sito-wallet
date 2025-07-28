import { AccountDto, UpdateAccountDto } from "lib";
import { AccountFormType } from "../types";

export const formToDto = ({
  id,
  name,
  description,
}: AccountFormType): UpdateAccountDto => ({
  id,
  name,
  description,
});

export const dtoToForm = (dto: AccountDto): AccountFormType => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
});

export const emptyAccount: AccountFormType = {
  id: 0,
  name: "",
  description: "",
};
