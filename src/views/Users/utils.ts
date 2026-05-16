import { AddUserDto, UpdateUserDto, UserDto } from "lib";

import { UserFormType } from "./types";

const toOptionalValue = (value: string): string | undefined => {
  const parsed = value.trim();
  return parsed.length ? parsed : undefined;
};

export const userDtoToForm = (dto: UserDto): UserFormType => ({
  id: dto.id,
  email: dto.email,
  username: dto.username,
  password: "",
  admin: !!dto.admin,
});

export const userFormToCreateDto = (form: UserFormType): AddUserDto => ({
  email: form.email.trim(),
  password: form.password,
  username: toOptionalValue(form.username),
  admin: !!form.admin,
});

export const userFormToUpdateDto = (form: UserFormType): UpdateUserDto => ({
  id: form.id,
  email: form.email.trim(),
  username: toOptionalValue(form.username),
  password: toOptionalValue(form.password),
  admin: !!form.admin,
});

export const emptyAddUserForm: Omit<UserFormType, "id"> = {
  email: "",
  username: "",
  password: "",
  admin: false,
};

export const emptyUserForm: UserFormType = {
  id: 0,
  email: "",
  username: "",
  password: "",
  admin: false,
};
