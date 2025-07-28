import { Action as ActionType } from "@sito/dashboard";

// lib
import { BaseEntityDto } from "lib";

export function Action<TEntity extends BaseEntityDto>(
  props: ActionType<TEntity>
) {
  const {
    id,
    hidden = false,
    disabled = false,
    icon,
    tooltip,
    onClick,
  } = props;

  return !hidden ? (
    <button
      id={id}
      className="action"
      disabled={disabled}
      onClick={() => onClick()}
      aria-disabled={disabled}
      data-tooltip-id="tooltip"
      data-tooltip-content={tooltip}
    >
      {icon}
    </button>
  ) : null;
}
