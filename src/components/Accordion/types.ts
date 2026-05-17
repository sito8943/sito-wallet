import type { ReactNode } from "react";

export type AccordionPropsType = {
  open: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};
