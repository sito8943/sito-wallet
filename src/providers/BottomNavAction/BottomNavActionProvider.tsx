import { useState, useCallback, useMemo } from "react";

// types
import type { BasicProviderPropTypes } from "../types";

// context
import {
  BottomNavActionContext,
  type BottomNavActionContextType,
} from "./BottomNavActionContext";

export const BottomNavActionProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const [onAdd, setOnAddState] = useState<(() => void) | null>(null);

  const setOnAdd = useCallback(
    (action: (() => void) | null) => setOnAddState(() => action),
    [],
  );

  const value = useMemo<BottomNavActionContextType>(
    () => ({ onAdd, setOnAdd }),
    [onAdd, setOnAdd],
  );

  return (
    <BottomNavActionContext.Provider value={value}>
      {children}
    </BottomNavActionContext.Provider>
  );
};
