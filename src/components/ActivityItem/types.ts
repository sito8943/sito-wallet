import type { ReactNode } from "react";

export type ActivityItemPropsType = {
  /** Main value of the entry (e.g. the formatted amount). */
  amount: ReactNode;
  /** Secondary line (e.g. "Paid at: …"). */
  meta: ReactNode;
  note?: string | null;
  /** Buttons shown beside the entry (edit, delete…). */
  actions?: ReactNode;
  /** Makes the entry a button (e.g. open its transaction). */
  onClick?: () => void;
  "aria-label"?: string;
};
