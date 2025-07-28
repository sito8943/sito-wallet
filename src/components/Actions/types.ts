import { Action } from "@sito/dashboard";
import { BaseEntityDto } from "lib";

export type ActionsPropsType<TRow extends BaseEntityDto> = {
  actions: Action<TRow>[];
};
