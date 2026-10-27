import type { CommonProductDto } from "lib";

export interface TransactionProductDto {
  id: number;
  product: CommonProductDto | null;
  quantity: number;
  unitPrice: number;
}
