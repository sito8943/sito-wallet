import type { ReceiptDraftProductDto } from "./ReceiptDraftProductDto";

/**
 * Transaction draft read from a receipt photo (`POST receipts/scan`). Nothing
 * is stored: it only pre-fills the form.
 */
export interface ReceiptDraftDto {
  /** Parser that read it; `generic` when the store wasn't recognized. */
  parser: string;
  providerName: string | null;
  /** ISO date (`yyyy-MM-dd`). */
  date: string | null;
  total: number | null;
  products: ReceiptDraftProductDto[];
  productsTotal: number | null;
  /** Whether the lines add up to the total; null when either is missing. */
  matchesTotal: boolean | null;
  /** Raw OCR text. */
  text: string;
}
