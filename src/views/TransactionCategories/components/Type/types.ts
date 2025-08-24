import { TransactionType } from "lib";

export type TypePropsType = {
  type: TransactionType;
  filled?: boolean;
  noText?: boolean;
  className?: string;
};
