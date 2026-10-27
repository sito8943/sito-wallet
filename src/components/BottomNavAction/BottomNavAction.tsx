// providers
import { useRegisterBottomNavAction } from "providers";

// types
import type { BottomNavActionPropsType } from "./types";

/**
 * Registers the bottom-nav center action while mounted; renders nothing.
 * The slot is global and registering `null` clears it, so views that pick
 * between actions mount the one they want instead of registering `null`.
 */
export function BottomNavAction(props: BottomNavActionPropsType) {
  useRegisterBottomNavAction(props.action);
  return null;
}
