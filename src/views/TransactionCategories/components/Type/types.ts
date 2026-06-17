import type { TransactionType } from "lib";

export type TypePropsType = {
  type: TransactionType;
  filled?: boolean;
  noText?: boolean;
  className?: string;
  contentClassName?: string;
  iconClassName?: string;
  textClassName?: string;
};
