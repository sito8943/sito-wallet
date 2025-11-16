import { TablePropsType, BaseEntityDto } from "@sito/dashboard-app";

export type WalletTablePropsType<TRow extends BaseEntityDto> =
  TablePropsType<TRow> & {
    total: number;
  };
