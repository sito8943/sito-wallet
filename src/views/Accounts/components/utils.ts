import { faCreditCard, faMoneyBill } from "@fortawesome/free-solid-svg-icons";

// lib
import { ACCOUNT_BANK_NAME } from "lib";

// types
import type { AccountCardTheme } from "./types";

export const icons = {
  0: faMoneyBill,
  1: faCreditCard,
};

// Per-bank brand palette for the account card. Ported from SitoWallet native
// (light variants only — the web wallet has no dark theme). `background` may be
// a solid color or a CSS gradient; brand color is domain data, so literals here
// are the documented exception to the "no raw colors" rule. `isDark` flags a
// dark brand surface (light foreground), used to derive contrast tokens for the
// controls (chips / action icons) layered on top.
interface BankPalette {
  background: string;
  text: string;
  subtleText: string;
  isDark: boolean;
}

const bankPalettes: Record<string, BankPalette> = {
  [ACCOUNT_BANK_NAME.IMAGIN]: {
    background: "linear-gradient(135deg, #2ce8d3 0%, #0b544d 70%)",
    text: "#ffffff",
    subtleText: "rgba(255, 255, 255, 0.8)",
    isDark: true,
  },
  [ACCOUNT_BANK_NAME.CAIXA]: {
    background: "linear-gradient(135deg, #2f84ff 0%, #0a3d91 70%)",
    text: "#ffffff",
    subtleText: "#dbeafe",
    isDark: true,
  },
  [ACCOUNT_BANK_NAME.REVOLUT]: {
    background: "linear-gradient(135deg, #f53288 0%, #182764 70%)",
    text: "#f8fafc",
    subtleText: "#b9c3d9",
    isDark: true,
  },
  [ACCOUNT_BANK_NAME.BANDEC]: {
    background: "#b91c1c",
    text: "#ffffff",
    subtleText: "rgba(255, 255, 255, 0.82)",
    isDark: true,
  },
  [ACCOUNT_BANK_NAME.BPA]: {
    background: "#d7e8cf",
    text: "#1f3a24",
    subtleText: "#222222",
    isDark: false,
  },
  [ACCOUNT_BANK_NAME.BANCO_METROPOLITANO]: {
    background: "#d9e9d0",
    text: "#222222",
    subtleText: "#222222",
    isDark: false,
  },
};

export const getAccountCardTheme = (
  bankName?: string,
): AccountCardTheme | undefined => {
  const palette = bankName ? bankPalettes[bankName] : undefined;
  if (!palette) return undefined;

  // Contrast tokens are derived from the surface darkness so chips/icons stay
  // legible on either a dark or a light brand background.
  return {
    background: palette.background,
    text: palette.text,
    subtleText: palette.subtleText,
    overlay: palette.isDark
      ? "rgba(255, 255, 255, 0.16)"
      : "rgba(0, 0, 0, 0.07)",
    chipBg: palette.isDark
      ? "rgba(255, 255, 255, 0.18)"
      : "rgba(0, 0, 0, 0.07)",
    chipText: palette.text,
  };
};
