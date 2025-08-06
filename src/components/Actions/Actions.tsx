// lib
import { BaseEntityDto } from "lib";

// components
import { Action } from "./Action";

// types
import { ActionsContainerPropsType } from "./types.ts";

// styles
import "./styles.css";

export function Actions<TRow extends BaseEntityDto>(
  props: ActionsContainerPropsType<TRow>
) {
  const { actions = [], className = "", showActionTexts = false } = props;
  return (
    <ul className={`actions-container ${className}`}>
      {actions?.map((action) => (
        <li key={action.id ?? action.tooltip}>
          <Action showText={showActionTexts} {...action}>
            {action.children}
          </Action>
        </li>
      ))}
    </ul>
  );
}
