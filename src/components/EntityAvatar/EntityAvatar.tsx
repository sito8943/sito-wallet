import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { classNames } from "@sito/dashboard-app";

// components
import { ProviderPhoto } from "../ProviderPhoto";

// constants
import {
  ENTITY_AVATAR_SHAPE_CLASSNAME,
  ENTITY_AVATAR_SIZE_CLASSNAME,
} from "./constants";

// utils
import { normalizePhoto } from "./utils";

// types
import type { EntityAvatarPropsType } from "./types";

import "./styles.css";

/**
 * Photo of an entity (product, seller, goal, provider…) in a fixed frame.
 * Falls back to an icon when there is no photo or it fails to load, so the
 * frame never shows a broken image and the row height stays the same.
 */
export function EntityAvatar(props: EntityAvatarPropsType) {
  const {
    photo,
    alt = "",
    size = "md",
    shape = "rounded",
    fallbackIcon = faImage,
    fallback,
    badge,
    className,
    imageClassName,
  } = props;

  const parsedPhoto = normalizePhoto(photo);
  // Keyed by photo so a new photo gets a fresh attempt.
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);
  const showPhoto = !!parsedPhoto && failedPhoto !== parsedPhoto;

  if (!showPhoto && fallback) return fallback;

  return (
    <span
      className={classNames(
        "entity-avatar",
        ENTITY_AVATAR_SIZE_CLASSNAME[size],
        ENTITY_AVATAR_SHAPE_CLASSNAME[shape],
        !showPhoto && "entity-avatar--fallback",
        className,
      )}
    >
      {showPhoto ? (
        <>
          <ProviderPhoto
            className={classNames("entity-avatar-image", imageClassName)}
            photo={parsedPhoto}
            alt={alt}
            onError={() => setFailedPhoto(parsedPhoto)}
          />
          {badge}
        </>
      ) : (
        <FontAwesomeIcon icon={fallbackIcon} aria-hidden="true" />
      )}
    </span>
  );
}
