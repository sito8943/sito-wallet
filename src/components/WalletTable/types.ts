import { TablePropsType } from "@sito/dashboard";

// lib
import { BaseEntityDto } from "lib";

export type WalletTablePropsType<TRow extends BaseEntityDto> =
  TablePropsType<TRow>;
