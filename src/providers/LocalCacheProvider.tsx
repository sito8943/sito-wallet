import { useCallback, useState } from "react";

// @sito/dashboard
import { BaseEntityDto, fromLocal, toLocal } from "@sito/dashboard-app";

// config
import { config } from "../config.ts";

// types
import {
  BasicProviderPropTypes,
  FileDataType,
} from "./types.ts";

import { LocalCacheContext } from "./LocalCacheContext";

// lib
import {
  AccountDto,
  CurrencyDto,
  Tables,
  TransactionCategoryDto,
  TransactionDto,
} from "lib";

const LocalCacheProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const [data, setData] = useState<FileDataType>({
    [Tables.Accounts]: [] as AccountDto[],
    [Tables.Currencies]: [] as CurrencyDto[],
    [Tables.TransactionCategories]: [] as TransactionCategoryDto[],
    [Tables.Transactions]: [] as TransactionDto[],
  });

  const inCache = useCallback(
    (key: string) => {
      return data[key];
    },
    [data]
  );

  const updateCache = useCallback(
    <T = BaseEntityDto,>(key: string, value: T[]) => {
      const newData = {
        ...data,
        [key]: value,
      };
      setData(
        (prevData) =>
          ({
            ...prevData,
            [key]: value,
          } as FileDataType)
      );
      toLocal(config.localCache, newData);
    },
    [data]
  );

  const loadCache = useCallback(
    <T = BaseEntityDto,>(key: string): T[] | null => {
      const content = fromLocal(config.localCache, "object");
      return content ? content[key] : null;
    },
    []
  );

  return (
    <LocalCacheContext.Provider value={{ updateCache, loadCache, inCache }}>
      {children}
    </LocalCacheContext.Provider>
  );
};

export { LocalCacheProvider };
