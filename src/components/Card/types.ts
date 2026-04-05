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
  "aria-label"?: string;
  onClick?: () => void;
  deleted: boolean;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelection?: () => void;
  onLongPressSelection?: () => void;
};

export type ItemCardTitlePropsType = {
  children: ReactNode;
  deleted?: boolean;
  className?: string;
};
