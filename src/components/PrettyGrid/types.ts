import { JSX, ReactNode } from "react";

// lib
import { BaseEntityDto } from "@sito/dashboard-app";

export type PrettyGridPropsType<TDto extends BaseEntityDto> = {
  renderComponent: (item: TDto) => JSX.Element;
  emptyMessage?: string;
  emptyComponent?: ReactNode;
  data?: TDto[];
  loading?: boolean;
};
