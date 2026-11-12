import type { Location } from "react-router-dom";

/** Full in-app URL of a location: "/oauth/consent?request=abc". */
export const getLocationPath = (
  location: Pick<Location, "pathname" | "search" | "hash">,
): string => `${location.pathname}${location.search}${location.hash}`;
