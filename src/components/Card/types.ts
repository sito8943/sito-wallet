import { ReactNode } from "react";

// @sito/dashboard-app
import { BaseEntityDto, ActionType } from "@sito/dashboard-app";

export type ItemCardPropsType<TEntity extends BaseEntityDto> = {
  children: ReactNode;
  containerClassName?: string;
  actions: ActionType<TEntity>[];
  title: string | ReactNode;
  className?: string;
  name: string;
  onClick?: () => void;
  deleted: boolean;
};

export type ItemCardTitlePropsType = {
  children: ReactNode;
  deleted?: boolean;
};
