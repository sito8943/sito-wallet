/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState, PropsWithChildren } from "react";

// base utils + types
import { fromLocal, removeFromLocal, toLocal, SessionDto } from "@sito/dashboard-app";

// manager hook (typed)
import { useManager } from "./useSWManager";

type SupabaseAuthProviderContextType = {
  account: SessionDto;
  logUser: (data: SessionDto) => void;
  logoutUser: () => Promise<void> | void;
  logUserFromLocal: () => Promise<void>;
  isInGuestMode: () => boolean;
  setGuestMode: (value: boolean) => void;
};

type SupabaseAuthProviderProps = PropsWithChildren<{
  user?: string;
  guestMode?: string;
}>;

const AuthContext = createContext({} as SupabaseAuthProviderContextType);

export const SupabaseAuthProvider = (props: SupabaseAuthProviderProps) => {
  const { children, guestMode = "guest_mode", user = "user" } = props;

  const manager = useManager();
  const [account, setAccount] = useState<SessionDto>({} as SessionDto);

  const isInGuestMode = useCallback(() => {
    return !!fromLocal(guestMode, "boolean") && (account as any)?.token === undefined;
  }, [account, guestMode]);

  const setGuestMode = useCallback((value: boolean) => {
    toLocal(guestMode, value);
  }, [guestMode]);

  const logUser = useCallback((data: SessionDto) => {
    if (!data) return;
    const token = (data as any)?.token ?? (typeof data === "string" ? (data as unknown as string) : undefined);
    setAccount(data);
    removeFromLocal(guestMode);
    if (token) toLocal(user, token);
  }, [guestMode, user]);

  const logoutUser = useCallback(async () => {
    try {
      await manager.Auth.logout();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    setAccount({} as SessionDto);
    removeFromLocal(user);
  }, [manager, user]);

  const logUserFromLocal = useCallback(async () => {
    try {
      const authDto = await manager.Auth.getSession();
      logUser(authDto as SessionDto);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      logoutUser();
    }
  }, [logUser, logoutUser, manager]);

  const value: SupabaseAuthProviderContextType = {
    account,
    logUser,
    logoutUser,
    logUserFromLocal,
    isInGuestMode,
    setGuestMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("authContext must be used within a Provider");
  return context;
};
