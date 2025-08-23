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
} from "lib";

// utils
import { parseQueries } from "./utils";

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
    filters: FilterTransactionDto
  ): Promise<TransactionTypeResumeDto> {
    const builtUrl = parseQueries<
      TransactionTypeResumeDto,
      FilterTransactionDto
    >(`${Tables.Transactions}/type-resume`, undefined, filters);

    return await this.api.doQuery<TransactionTypeResumeDto>(
      builtUrl,
      Methods.GET,
      null,
      {
        ...this.api.defaultTokenAdquierer(),
      }
    );
  }
}
