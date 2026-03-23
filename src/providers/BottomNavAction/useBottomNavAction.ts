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
 * Registers an action for the bottom navigation center button.
 * Automatically clears the action on unmount.
 */
export const useRegisterBottomNavAction = (action: () => void) => {
  const { setOnAction } = useBottomNavAction();

  useEffect(() => {
    setOnAction(action);
    return () => setOnAction(null);
  }, [action, setOnAction]);
};
