import type { FieldValues } from "react-hook-form";

import type { ActionType, FormDialogPropsType } from "@sito/dashboard-app";

import type { UserDto } from "lib";

export interface UserCardPropsType extends UserDto {
  actions: ActionType<UserDto>[];
  onClick: (id: number) => void;
  selectionMode?: boolean;
  selected?: boolean;
  onSelect?: (id: number) => void;
  onLongPress?: (id: number) => void;
}

export interface UserFormType extends FieldValues {
  id: number;
  email: string;
  username: string;
  password: string;
  admin: boolean;
}

export type UserFormPropsType = FormDialogPropsType<UserFormType> & {
  isEdit?: boolean;
};

export type AddUserDialogPropsType = FormDialogPropsType<UserFormType>;

export type EditUserDialogPropsType = FormDialogPropsType<UserFormType>;
