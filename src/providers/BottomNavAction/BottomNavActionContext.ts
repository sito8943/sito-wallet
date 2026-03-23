import { createContext } from "react";

export type BottomNavActionContextType = {
  onAdd: (() => void) | null;
  setOnAdd: (action: (() => void) | null) => void;
};

export const BottomNavActionContext =
  createContext<BottomNavActionContextType | null>(null);
