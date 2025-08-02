import { Action } from "@sito/dashboard";
import { BaseEntityDto } from "lib";
import { ReactNode } from "react";

export type ActionsPropsType<TRow extends BaseEntityDto> = {
  actions: ActionPropsType<TRow>[];
};

export interface ActionPropsType<TRow extends BaseEntityDto>
  extends Action<TRow> {
  children?: ReactNode;
}
