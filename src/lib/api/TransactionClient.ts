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
  TransactionTypeGroupedDto,
  FilterTransactionGroupedByTypeDto,
  TransactionWeeklySpentDto,
  FilterWeeklyTransactionDto,
  ImportPreviewTransactionDto,
  ImportDto,
  parseJSONFile,
  AssignTransactionAccountDto,
  AssignTransactionCategoryDto,
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
  private buildGroupedByTypeFilters(
    filters?: string,
    date?: FilterTransactionGroupedByTypeDto["date"],
  ): string | undefined {
    const values: string[] = [];

    if (filters) {
      values.push(filters);
    }

    if (date?.start) {
      values.push(`date>=${date.start}`);
    }

    if (date?.end) {
      values.push(`date<=${date.end}`);
    }

    return values.length ? values.join(",") : undefined;
  }

  /**
   */
  constructor() {
    super(Tables.Transactions, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
  }

  async getTypeResume(
    filters: FilterTransactionTypeResumeDto,
  ): Promise<TransactionTypeResumeDto> {
    const builtUrl = parseQueries<
      TransactionTypeResumeDto,
      FilterTransactionDto
    >(`${Tables.Transactions}/type-resume`, undefined, filters);

    return await this.api.doQuery<TransactionTypeResumeDto>(
      builtUrl,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async getGroupedByType(
    filters: FilterTransactionGroupedByTypeDto,
  ): Promise<TransactionTypeGroupedDto> {
    const builtUrl = parseQueries<
      TransactionTypeGroupedDto,
      FilterTransactionGroupedByTypeDto
    >(`${Tables.Transactions}/grouped-by-type`, undefined, {
      accountId: filters.accountId,
      userId: filters.userId,
      filters: this.buildGroupedByTypeFilters(filters.filters, filters.date),
    });
    return await this.api.doQuery<TransactionTypeGroupedDto>(
      builtUrl,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async weekly(
    filters: FilterWeeklyTransactionDto,
  ): Promise<TransactionWeeklySpentDto> {
    const builtUrl = parseQueries<
      TransactionWeeklySpentDto,
      FilterTransactionDto
    >(`${Tables.Transactions}/weekly`, undefined, filters);

    return await this.api.doQuery<TransactionWeeklySpentDto>(
      builtUrl,
      Methods.GET,
      undefined,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async processImport(
    file: File,
    override?: boolean,
  ): Promise<ImportPreviewTransactionDto[]> {
    const items = await parseJSONFile<TransactionDto>(file);
    return await this.api.doQuery<ImportPreviewTransactionDto[]>(
      `${this.table}/import/process${override ? `?override=true` : ""}`,
      Methods.POST,
      items,
      {
        ...this.api.defaultTokenAcquirer(),
      },
    );
  }

  async import(data: ImportDto<ImportPreviewTransactionDto>): Promise<number> {
    return await this.api.post(`${this.table}/import`, data);
  }

  async assignAccount(data: AssignTransactionAccountDto): Promise<number> {
    return await this.api.patch(`${this.table}/assign-account`, data);
  }

  async assignCategory(data: AssignTransactionCategoryDto): Promise<number> {
    return await this.api.patch(`${this.table}/assign-category`, data);
  }
}
