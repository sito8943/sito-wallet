import { ReactNode } from "react";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// lib
import { BaseEntityDto } from "lib";

export type ItemCardPropsType<TEntity extends BaseEntityDto> = {
  children: ReactNode;
  containerClassName?: string;
  actions: Action<TEntity>[];
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
