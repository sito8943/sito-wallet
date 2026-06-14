import type { CommonCurrencyDto } from "lib";

export type TypeResumePropsType = {
  accountId: number;
  currency: CommonCurrencyDto | null;
};

export interface AccountCardTheme {
  // Solid color or CSS gradient applied as the card background.
  background: string;
  text: string;
  subtleText: string;
  // Derived contrast tokens for controls layered on the brand background.
  // overlay: hover/translucent fill; chipBg/chipText: semantic chip pill.
  overlay: string;
  chipBg: string;
  chipText: string;
}
