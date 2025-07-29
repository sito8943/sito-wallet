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

  const logUser = useCallback((data: SessionDto) => {
    setAccount(data);
    //TODO Save token on cookie
    toLocal(config.user, data);
  }, []);

  const logoutUser = useCallback(() => {
    setAccount({} as SessionDto);
    //TODO Remove token from cookie
    removeFromLocal(config.user);
  }, []);

  const logUserFromLocal = useCallback(async () => {
    /* try {
      const result = await manager.Auth.getSession();
      if (result.token) {
        const loggedUser = fromLocal(config.user, "object");
        if (loggedUser) setAccount(loggedUser);
      } else logoutUser();
    } catch (err) {
      console.error(err);
      logoutUser();
    } */
    const loggedUser = fromLocal(config.user, "object");
    if (loggedUser) setAccount(loggedUser);
  }, [logoutUser, manager.Auth]);

  const value = { account, logUser, logoutUser, logUserFromLocal };

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
