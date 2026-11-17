import type { SyntheticEvent } from "react";

export const stopPropagation = (event: SyntheticEvent) =>
  event.stopPropagation();
