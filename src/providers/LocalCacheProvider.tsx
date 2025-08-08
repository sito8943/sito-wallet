/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from "react";

// config
import { config } from "../config.ts";

// types
import {
  BasicProviderPropTypes,
  LocalCacheProviderContextType,
  FileDataType,
} from "./types.ts";

// lib
import {
  AccountDto,
  BaseEntityDto,
  CurrencyDto,
  fromLocal,
  Tables,
  toLocal,
  TransactionCategoryDto,
  TransactionDto,
} from "lib";

const LocalCacheContext = createContext({} as LocalCacheProviderContextType);

const LocalCacheProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const [data, setData] = useState<FileDataType>({
    [Tables.Accounts]: [] as AccountDto[],
    [Tables.Currencies]: [] as CurrencyDto[],
    [Tables.TransactionCategories]: [] as TransactionCategoryDto[],
    [Tables.Transactions]: [] as TransactionDto[],
  });

  const inCache = useCallback(
    (key: Tables) => {
      return data[key];
    },
    [data]
  );

  const updateCache = useCallback(
    <T = BaseEntityDto,>(key: Tables, value: T[]) => {
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
    <T = BaseEntityDto,>(key: Tables): T[] | null => {
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

const useLocalCache = () => {
  const context = useContext(LocalCacheContext);

  if (context === undefined)
    throw new Error("configContext must be used within a Provider");
  return context;
};

export { LocalCacheProvider, useLocalCache };
