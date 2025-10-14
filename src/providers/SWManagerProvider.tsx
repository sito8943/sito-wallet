import { ManagerProvider } from "@sito/dashboard-app";

// manager
import { BasicProviderPropTypes } from "./types";

// lib
import { Manager } from "lib";

/**
 * Manager Provider
 * @param props - provider props
 * @returns  React component
 */
export const SWManagerProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const manager = new Manager();

  return <ManagerProvider manager={manager}>{children}</ManagerProvider>;
};
