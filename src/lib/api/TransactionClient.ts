import BaseClient from "./BaseClient";

// enum
import { Tables } from "./types";

// types
import {
  CommonTransactionDto,
  TransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto,
  AddTransactionDto,
  TransactionTypeResumeDto,
  Methods,
  TransactionType,
} from "lib";

export default class TransactionClient extends BaseClient<
  TransactionDto,
  CommonTransactionDto,
  AddTransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto
> {
  /**
   */
  constructor() {
    super(Tables.Transactions);
  }

  async getTypeResume(
    transactionType: TransactionType,
    userId: number
  ): Promise<TransactionTypeResumeDto> {
    return await this.api.doQuery<TransactionTypeResumeDto>(
      `${Tables.Transactions}/type-resume?type=${transactionType}&userId=${userId}`,
      Methods.GET,
      null,
      {
        ...this.api.defaultTokenAdquierer(),
      }
    );
  }
}
