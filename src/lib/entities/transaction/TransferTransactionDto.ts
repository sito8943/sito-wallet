export interface TransferTransactionDto {
  sourceAccountId: number;
  destinationAccountId: number;
  amount: number;
  date: string;
  description?: string;
}

export interface TransferTransactionResponseDto {
  outgoingTransactionId: number;
  incomingTransactionId: number;
}
