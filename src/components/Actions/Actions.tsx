// lib
import { BaseEntityDto } from "@sito/dashboard-app";

// components
import { Action } from "./Action";

// types
import { ActionsContainerPropsType } from "./types.ts";

// styles
import "./styles.css";

export function Actions<TRow extends BaseEntityDto>(
  props: ActionsContainerPropsType<TRow>
) {
  const {
    actions = [],
    className = "",
    showTooltips = true,
    showActionTexts = false,
  } = props;
  return (
    <ul className={`actions-container ${className}`}>
      {actions?.map((action) => (
        <li key={action.id}>
          <Action
            showTooltips={showTooltips}
            showText={showActionTexts}
            {...action}
          >
            {action.children}
          </Action>
        </li>
      ))}
    </ul>
  );
}
