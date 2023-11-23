/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useReducer, useContext } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

import { saveUser } from "../utils/auth";

const UserContext = createContext();

const userReducer = (userState, action) => {
  const { type } = action;
  switch (type) {
    case "init-log": {
      const { initial } = action;
      userState.initial = initial;
      saveUser(userState);
      return userState;
    }
    case "init-bills": {
      const { bills } = action;
      userState.bills = bills;
      saveUser(userState);
      return userState;
    }
    case "add-bill": {
      const { bills } = action;
      saveUser({ ...userState, bills });
      return { ...userState, bills };
    }
    case "init-balances": {
      const { balances } = action;
      userState.balances = balances;
      saveUser(userState);
      return userState;
    }
    case "logged-out":
      return {};
    case "logged-in": {
      const { user, photo, cached, account } = action;
      return { user, photo, cached, account };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const UserProvider = ({ children }) => {
  const [userState, setUserState] = useReducer(userReducer, {});

  const value = { userState, setUserState };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// hooks
const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined)
    throw new Error("userContext must be used within a Provider");
  return context;
};

export { UserProvider, useUser };
