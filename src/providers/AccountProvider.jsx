/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useState, useContext, useCallback } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// providers
import { useAppApiClient } from "./AppApiProvider";

// utils
import { toLocal, fromLocal, removeFromLocal } from "../utils/local";

// config
import config from "../config";

const AccountContext = createContext();

/**
 * Account Provider
 * @param {object} props - provider props
 * @returns Provider
 */
const AccountProvider = (props) => {
  const { children } = props;

  const appApiClient = useAppApiClient();

  const [account, setAccount] = useState({});

  const logUser = useCallback((data) => {
    setAccount(data);
    toLocal(config.user, data);
  }, []);

  const logoutUser = useCallback(() => {
    setAccount({});
    removeFromLocal(config.user);
    appApiClient.User.logout();
  }, [appApiClient.User]);

  const logUserFromLocal = useCallback(async () => {
    try {
      const response = await appApiClient.User.getSession();
      if (response.error) {
        const loggedUser = fromLocal(config.user, "object");
        setAccount(loggedUser);
      }
      if (response.data?.user !== null) {
        const loggedUser = fromLocal(config.user, "object");

        if (loggedUser) {
          const request = await appApiClient.User.fetchUserSettings(
            loggedUser.user.id
          );
          const appUser = await request.json();

          if (appUser) setAccount({ ...loggedUser, appUser });
          else setAccount(loggedUser);
        } else throw Error(401);
      } else logoutUser();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      logoutUser();
    }
  }, [logoutUser, appApiClient.User]);

  const value = { account, logUser, logoutUser, logUserFromLocal };
  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

AccountProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useAccount hook
 * @returns function hook
 */
const useAccount = () => {
  const context = useContext(AccountContext);
  if (context === undefined)
    throw new Error("accountContext must be used within a Provider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { AccountProvider, useAccount };
