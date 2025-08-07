import { ReactNode } from "react";

export type DropdownPropsType = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
};
