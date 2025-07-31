import { ReactNode } from "react";
import { Action } from "@sito/dashboard";

// types
import { BaseEntityDto } from "lib";

export type PagePropsType<TRow extends BaseEntityDto> = {
  title?: string;
  children: ReactNode;
  isLoading?: boolean;
  addOptions?: Partial<Action<TRow>>;
  filterOptions?: Partial<Action<TRow>>;
  animated?: boolean;
  actions?: Action<TRow>[];
  showBack?: boolean;
  queryKey?: string[];
};
