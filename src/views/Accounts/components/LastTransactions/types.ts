import { CommonCurrencyDto, TransactionDto } from "lib";

export type LastTransactionsPropsType = {
  accountId: number;
  currency: CommonCurrencyDto | null;
};

export interface TransactionPropsType extends TransactionDto {
  currency: CommonCurrencyDto | null;
}
