import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface ChipPropsType
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  text?: string;
  children?: ReactNode;
  icon?: IconProp;
  iconClassName?: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark"
    | "none";
}

export interface DeleteChipPropsType extends ChipPropsType {
  onDelete: () => void;
}
