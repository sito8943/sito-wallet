// lib
import { isExternalPhoto } from "lib";

// components
import { Image } from "../Image";

// types
import type { ProviderPhotoPropsType } from "./types";

/**
 * External URLs load as a plain image (no auth header sent to third parties);
 * uploaded files go through the API with the session token.
 */
export function ProviderPhoto(props: ProviderPhotoPropsType) {
  const { photo, className, alt = "" } = props;

  if (!photo) return null;

  if (isExternalPhoto(photo))
    return <img className={className} src={photo} alt={alt} />;

  return <Image className={className} endpoint={photo} alt={alt} />;
}
