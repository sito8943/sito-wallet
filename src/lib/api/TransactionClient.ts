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
  TransactionWeeklySpentDto,
  FilterWeeklyTransactionDto,
  ImportPreviewTransactionDto,
  ImportDto,
  parseJSONFile,
} from "lib";

// utils
import { config } from "../../config";

export default class TransactionClient extends BaseClient<
  Tables,
  TransactionDto,
  CommonTransactionDto,
  AddTransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto,
  ImportPreviewTransactionDto
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

  async weekly(
    filters: FilterWeeklyTransactionDto
  ): Promise<TransactionWeeklySpentDto> {
    const builtUrl = parseQueries<
      TransactionWeeklySpentDto,
      FilterTransactionDto
    >(`${Tables.Transactions}/weekly`, undefined, filters);

    return await this.api.doQuery<TransactionWeeklySpentDto>(
      builtUrl,
      Methods.GET,
      null,
      {
        ...this.api.defaultTokenAcquirer(),
      }
    );
  }

  async processImport(
    file: File,
    override?: boolean
  ): Promise<ImportPreviewTransactionDto[]> {
    const items = await parseJSONFile<TransactionDto>(file);
    return await this.api.doQuery<ImportPreviewTransactionDto[]>(
      `${this.table}/import/process${override ? `?override=true` : ""}`,
      Methods.POST,
      items,
      {
        ...this.api.defaultTokenAcquirer(),
      }
    );
  }

  async import(data: ImportDto<ImportPreviewTransactionDto>): Promise<number> {
    return await this.api.post(`${this.table}/import`, data);
  }
}
