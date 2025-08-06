// lib
import { BaseEntityDto } from "lib";

// types
import { ActionPropsType } from "./types";

export function Action<TEntity extends BaseEntityDto>(
  props: ActionPropsType<TEntity>
) {
  const {
    id,
    hidden = false,
    disabled = false,
    showText = false,
    icon,
    tooltip,
    onClick,
    children,
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
      {icon} {showText && tooltip}
      {children}
    </button>
  ) : null;
}
