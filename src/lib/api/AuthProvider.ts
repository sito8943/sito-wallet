import { createContext, useCallback, useContext, useState } from "react";

// type
import { AuthProviderContextType, AuthProviderPropTypes } from "./types";

// providers
import { useManager } from "./ManagerProvider";

// lib
import { toLocal, removeFromLocal, fromLocal, SessionDto } from "lib";

const AuthContext = createContext({} as AuthProviderContextType);

/**
 * Auth Provider
 * @param props - provider props
 * @returns  React component
 */
const AuthProvider = (props: AuthProviderPropTypes) => {
  const { children, guestMode = "guest_mode", user = "user" } = props;

  const manager = useManager();

  const [account, setAccount] = useState<SessionDto>({} as SessionDto);

  const isInGuestMode = useCallback(() => {
    return (
      !!fromLocal(guestMode, "boolean") && account.token === undefined
    );
  }, [account.token]);

  const setGuestMode = useCallback((value: boolean) => {
    toLocal(guestMode, value);
  }, []);

  const logUser = useCallback((data: SessionDto) => {
    if (data) {
      setAccount(data);
      removeFromLocal(guestMode);
      toLocal(user, data.token);
    }
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await manager.Auth.logout();
    } catch (err) {
      console.error(err);
    }
    setAccount({} as SessionDto);
    removeFromLocal(user);
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
