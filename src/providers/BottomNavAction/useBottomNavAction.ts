import { useContext, useEffect } from "react";
import { BottomNavActionContext } from "./BottomNavActionContext";

/**
 * Returns the current bottom nav action context.
 */
export const useBottomNavAction = () => {
  const ctx = useContext(BottomNavActionContext);
  if (!ctx)
    throw new Error(
      "useBottomNavAction must be used within BottomNavActionProvider",
    );
  return ctx;
};

/**
 * Registers an "add" action for the bottom navigation.
 * Automatically clears the action on unmount.
 */
export const useRegisterBottomNavAdd = (action: () => void) => {
  const { setOnAdd } = useBottomNavAction();

  useEffect(() => {
    setOnAdd(action);
    return () => setOnAdd(null);
  }, [action, setOnAdd]);
};
