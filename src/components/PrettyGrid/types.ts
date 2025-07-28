import { JSX } from "react";

// lib
import { BaseEntityDto } from "lib";

export type PrettyGridPropsType<TDto extends BaseEntityDto> = {
  emptyMessage?: string;
  data?: TDto[];
  renderComponent: (item: TDto) => JSX.Element;
};
