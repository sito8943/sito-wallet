import { JSX } from "react";

// lib
import { BaseEntityDto } from "lib";

export type PrettyGridPropsType<TDto extends BaseEntityDto> = {
  renderComponent: (item: TDto) => JSX.Element;
  emptyMessage?: string;
  data?: TDto[];
  loading?: boolean;
};
