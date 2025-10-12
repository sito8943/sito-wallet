// lib
import { BaseEntityDto } from "lib";

// types
import { ActionPropsType } from "./types";

export function Action<TEntity extends BaseEntityDto>(
  props: ActionPropsType<TEntity>
) {
  const {
    id,
    icon,
    tooltip,
    onClick,
    children,
    hidden = false,
    disabled = false,
    showText = false,
    showTooltips = true,
  } = props;

  return !hidden ? (
    <button
      id={id}
      className={`action ${showText ? "text-action" : "icon-action"}`}
      disabled={disabled}
      onClick={() => onClick()}
      aria-disabled={disabled}
      data-tooltip-id="tooltip"
      data-tooltip-content={showTooltips ? tooltip : ""}
    >
      {icon} {showText && tooltip}
      {children}
    </button>
  ) : null;
}
