/** Product line read from a receipt; `name` is the text as printed. */
export interface ReceiptDraftProductDto {
  name: string;
  quantity: number | null;
  unitPrice: number;
}
