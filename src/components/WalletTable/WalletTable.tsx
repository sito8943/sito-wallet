import { BaseEntityDto } from "@sito/dashboard-app";
import { Table, useTableOptions } from "@sito/dashboard";

// types
import { WalletTablePropsType } from "./types";

// lib
import { useEffect } from "react";

export const WalletTable = <TRow extends BaseEntityDto>(
  props: WalletTablePropsType<TRow>
) => {
  const { setTotal } = useTableOptions();

  useEffect(() => {
    setTotal(props.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.total]);

  return <Table {...props} />;
};
