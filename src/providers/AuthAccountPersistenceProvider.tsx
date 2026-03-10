import { useEffect } from "react";
import { useAuth } from "@sito/dashboard-app";

// lib
import { persistPublicSessionAccount } from "lib";

// types
import { BasicProviderPropTypes } from "./types";

export const AuthAccountPersistenceProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const { account } = useAuth();

  useEffect(() => {
    if (!account?.id || !account?.token) return;

    persistPublicSessionAccount(account);
  }, [account]);

  return <>{children}</>;
};
