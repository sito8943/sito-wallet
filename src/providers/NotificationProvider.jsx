/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-constructed-context-values */
import { createContext, useState, useContext, useCallback } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

const NotificationContext = createContext();

/**
 * Notification Provider
 * @param {object} props - provider props
 * @returns Provider
 */
const NotificationProvider = (props) => {
  const { children } = props;
  const [notification, setNotification] = useState("");
  const [params, setParams] = useState({});
  const [state, setState] = useState("good");

  /**
   *
   * @param {string} string string to parse
   * @param  {...string} params array of params
   */
  const setNotificationFunction = useCallback((string, params, state = "") => {
    setNotification(string);
    setParams(params);
    setState(state);
  }, []);

  const value = { notification, setNotification: setNotificationFunction, params, state };
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * useNotification hook
 * @returns function hook
 */
const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) throw new Error("notificationContext must be used within a Provider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { NotificationProvider, useNotification };
