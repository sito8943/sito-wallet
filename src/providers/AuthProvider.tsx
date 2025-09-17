import { createContext, useCallback, useContext, useState } from "react";

// type
import { AuthProviderContextType, BasicProviderPropTypes } from "./types";

// providers
import { useManager } from "./ManagerProvider";

// lib
import { toLocal, removeFromLocal, fromLocal, SessionDto } from "lib";

// config
import { config } from "../config";

const AuthContext = createContext({} as AuthProviderContextType);

/**
 * Auth Provider
 * @param props - provider props
 * @returns  React component
 */
const AuthProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const manager = useManager();

  const [account, setAccount] = useState<SessionDto>({} as SessionDto);

  const isInGuestMode = useCallback(() => {
    return !!fromLocal(config.guestMode, "number");
  }, []);

  const setGuestMode = useCallback((value: boolean) => {
    toLocal(config.guestMode, value);
  }, []);

  const logUser = useCallback((data: SessionDto) => {
    if (data) {
      setAccount(data);
      removeFromLocal(config.guestMode);
      toLocal(config.user, data.token);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await manager.Auth.logout();
    } catch (err) {
      console.error(err);
    }
    setAccount({} as SessionDto);
    removeFromLocal(config.user);
  }, [manager.Auth]);

  const logUserFromLocal = useCallback(async () => {
    try {
      const authDto = await manager.Auth.getSession();
      logUser(authDto);
    } catch (err) {
      console.error(err);
      logoutUser();
    }
  }, [logUser, logoutUser, manager.Auth]);

  const value = {
    account,
    logUser,
    logoutUser,
    logUserFromLocal,
    isInGuestMode,
    setGuestMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook
 * @returns Provider
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("authContext must be used within a Provider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
