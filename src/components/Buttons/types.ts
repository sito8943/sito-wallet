import { ButtonHTMLAttributes } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export type ButtonBaseProps = {
  variant?: "text" | "submit" | "outlined";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "success"
    | "info";
};

export interface IconButtonPropsType
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    ButtonBaseProps {
  icon: IconDefinition;
  iconClassName?: string;
}

export interface ButtonPropsType
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color">,
    ButtonBaseProps {}
