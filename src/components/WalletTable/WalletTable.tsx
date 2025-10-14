import { Table, useTableOptions } from "@sito/dashboard";

// types
import { WalletTablePropsType } from "./types";

// lib
import { BaseEntityDto } from "@sito/dashboard-app";
import { useEffect } from "react";

export const WalletTable = <TRow extends BaseEntityDto>(
  props: WalletTablePropsType<TRow>
) => {
  const { setTotal } = useTableOptions();

  useEffect(() => {
    setTotal(props.total);
  }, [props.total, setTotal]);

  return <Table {...props} />;
};
