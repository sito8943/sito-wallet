import { Table } from "@sito/dashboard";

// types
import { WalletTablePropsType } from "./types";

// lib
import { BaseEntityDto } from "lib";

export const WalletTable = <TRow extends BaseEntityDto>(
  props: WalletTablePropsType<TRow>
) => {
  return <Table {...props} />;
};
