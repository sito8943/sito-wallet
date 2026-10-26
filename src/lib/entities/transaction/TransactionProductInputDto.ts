export interface TransactionProductInputDto {
  productId?: number;
  /** Without `productId`: the backend reuses a product with this name or creates it. */
  productName?: string;
  quantity?: number;
  unitPrice: number;
}
