import type { EntityAvatarShape, EntityAvatarSize } from "./types";

export const ENTITY_AVATAR_SIZE_CLASSNAME: Record<EntityAvatarSize, string> = {
  xs: "entity-avatar--xs",
  sm: "entity-avatar--sm",
  md: "entity-avatar--md",
  lg: "entity-avatar--lg",
};

export const ENTITY_AVATAR_SHAPE_CLASSNAME: Record<EntityAvatarShape, string> =
  {
    rounded: "entity-avatar--rounded",
    circle: "entity-avatar--circle",
  };
