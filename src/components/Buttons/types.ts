import { ButtonHTMLAttributes } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface IconButtonPropsType
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconDefinition;
}
