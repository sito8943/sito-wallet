// components
import { BaseEntityDto } from "lib";
import { Action } from "./Action";

// types
import { ActionsPropsType } from "./types.ts";

export function Actions<TRow extends BaseEntityDto>(
  props: ActionsPropsType<TRow>
) {
  const { actions = [] } = props;
  return (
    <ul className="flex w-full items-center justify-end gap-1">
      {actions?.map((action) => (
        <li key={action.id ?? action.tooltip}>
          <Action {...action}>{action.children}</Action>
        </li>
      ))}
    </ul>
  );
}

export default Actions;
