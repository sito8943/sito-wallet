import type { CSSProperties, ReactNode } from "react";

// @sito/dashboard-app
import type { BaseEntityDto, ActionType } from "@sito/dashboard-app";

export type ItemCardPropsType<TEntity extends BaseEntityDto> = {
  children: ReactNode;
  containerClassName?: string;
  // Inline style applied to the outer card shell (e.g. branded backgrounds).
  containerStyle?: CSSProperties;
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
  swipeDeleteOpen?: boolean;
  onSwipeDelete?: () => void;
};

export type ItemCardTitlePropsType = {
  children: ReactNode;
  deleted?: boolean;
  className?: string;
};
