import { TransactionType } from "lib";

export type WeeklyCardProps = {
  accountId?: number | null;
  currencyName?: string;
  currencySymbol?: string;
  title: string;
  type: TransactionType;
};

export type AccountCarouselPropsType = {
  className?: string;
};
