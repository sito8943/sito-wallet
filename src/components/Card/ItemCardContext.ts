import { createContext } from "react";

/** Lets nested `ItemCardTitle`s pick up the card's deleted state. */
export const ItemCardDeletedContext = createContext(false);
