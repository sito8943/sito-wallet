import { JSX, ReactNode } from "react";

// @sito/dashboard-app
import { BaseEntityDto } from "@sito/dashboard-app";

export type PrettyGridPropsType<TDto extends BaseEntityDto> = {
  renderComponent: (item: TDto) => JSX.Element;
  emptyMessage?: string;
  emptyComponent?: ReactNode;
  data?: TDto[];
  loading?: boolean;
  className?: string;
  itemClassName?: string;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void | Promise<void>;
  loadMoreComponent?: ReactNode;
  observerRootMargin?: string;
  observerThreshold?: number;
};
