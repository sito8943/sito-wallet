import { ReactNode } from "react";

export type AccordionPropsType = {
  open?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};
