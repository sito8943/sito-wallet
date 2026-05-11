import type { BaseDto } from "@sito/dashboard-app";

import type { ActionsDropdownActions } from "./types";

export const getActionsSignature = <TRow extends BaseDto>(
  actions: ActionsDropdownActions<TRow> | undefined,
): string => {
  if (!actions?.length) return "";

  return actions
    .map(
      (action) =>
        `${action.id}|${action.tooltip}|${action.disabled ? "1" : "0"}|${
          action.hidden ? "1" : "0"
        }`,
    )
    .join(";");
};
