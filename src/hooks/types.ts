import type { ActionPropsType, BaseDto } from "@sito/dashboard";

export type ActionsDropdownActions<TRow extends BaseDto> =
  ActionPropsType<TRow>[];

export type ActionsDropdownAction<TRow extends BaseDto> =
  ActionsDropdownActions<TRow>[number];
