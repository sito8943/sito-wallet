import { BaseClient, Methods, parseQueries } from "@sito/dashboard-app";

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
  FilterTransactionTypeResumeDto,
} from "lib";

// utils
import { config } from "../../config";

export default class TransactionClient extends BaseClient<
  Tables,
  TransactionDto,
  CommonTransactionDto,
  AddTransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto
> {
  /**
   */
  constructor() {
    super(Tables.Transactions, config.apiUrl, config.auth.user);
  }

  async getTypeResume(
    filters: FilterTransactionTypeResumeDto
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
        ...this.api.defaultTokenAcquirer(),
      }
    );
  }
}
