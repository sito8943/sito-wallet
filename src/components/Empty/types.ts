import { DetailedHTMLProps, HTMLAttributes } from "react";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

// @sito-dashboard
import { Action, BaseDto } from "@sito/dashboard";

export type EmptyPropsType<TRow extends BaseDto>  = {
  message?: string;
  messageProps?: DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>,
  action?: Action<TRow>
  iconProps?: FontAwesomeIconProps;
};
