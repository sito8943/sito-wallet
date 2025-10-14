import { TablePropsType } from "@sito/dashboard";

// lib
import { BaseEntityDto } from "@sito/dashboard-app";

export type WalletTablePropsType<TRow extends BaseEntityDto> =
  TablePropsType<TRow> & {
    total: number;
  };
