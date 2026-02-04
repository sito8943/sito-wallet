import { BaseInputPropsType } from "@sito/dashboard";
import { HTMLProps, ReactNode } from "react";

export interface FileInputPropsType
  extends Omit<HTMLProps<HTMLInputElement>, "value">,
    Omit<BaseInputPropsType, "value" | "label"> {
  iconClassName?: string;
  multiple?: boolean;
  children?: ReactNode;
  label: string;
  onClear?: () => void;
}
