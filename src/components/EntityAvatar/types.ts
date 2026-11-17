import type { ReactNode } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

/**
 * - `xs` (24px): inline next to a name in rows (subscriptions, renewals).
 * - `sm` (32px): dense lists and table cells (compact transaction rows).
 * - `md` (40px): leading photo of list cards (catalog, goals, providers).
 * - `lg` (44px): transaction rows, same footprint as the type icon.
 */
export type EntityAvatarSize = "xs" | "sm" | "md" | "lg";

export type EntityAvatarShape = "rounded" | "circle";

export type EntityAvatarPropsType = {
  photo?: string | null;
  alt?: string;
  size?: EntityAvatarSize;
  shape?: EntityAvatarShape;
  /**
   * Icon shown in the frame when there is no photo or it fails to load.
   * Defaults to a generic image icon.
   */
  fallbackIcon?: IconDefinition;
  /** Replaces the whole framed fallback (e.g. the transaction type icon). */
  fallback?: ReactNode;
  /** Overlay shown only on top of a loaded photo (e.g. a corner badge). */
  badge?: ReactNode;
  className?: string;
  imageClassName?: string;
};
