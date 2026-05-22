import { useState } from "react";
import { ManagerProvider } from "@sito/dashboard-app";

import type { BasicProviderPropTypes } from "./types";

import { Manager } from "lib";

export const SWManagerProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const [manager] = useState(() => new Manager());

  return <ManagerProvider manager={manager}>{children}</ManagerProvider>;
};
