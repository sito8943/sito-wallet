import { BaseClient, Methods } from "@sito/dashboard-app";

// enum
import { BalanceHistoryGranularity } from "lib";

// enum
import { Tables } from "./types";

// types
import type {
  CommonAccountDto,
  AccountDto,
  UpdateAccountDto,
  FilterAccountDto,
  AddAccountDto,
  ImportPreviewAccountDto,
  AdjustBalanceDto,
  TransactionDto,
  ImportDto,
  BalanceHistoryDto,
  FilterBalanceHistoryDto,
  GetAccountByIdQueryDto,
  SavingsProjectionDto,
  SavingsProjectionDailyDto,
  FilterSavingsProjectionDto,
  FilterSavingsProjectionDailyDto,
} from "lib";
import { appendSavingsDepositParams, parseJSONFile } from "lib";

// config
import { config } from "../../config";

export default class AccountClient extends BaseClient<
  Tables,
  AccountDto,
  CommonAccountDto,
  AddAccountDto,
  UpdateAccountDto,
  FilterAccountDto,
  ImportPreviewAccountDto
> {
  /**
   */
  constructor() {
    super(
      Tables.Accounts,
      config.apiUrl,
      config.auth.user,
      true,
      config.auth.clientConfig,
    );
  }

  async getById(
    id: number,
    query: GetAccountByIdQueryDto = {},
  ): Promise<AccountDto> {
    const searchParams = new URLSearchParams();

    if (query.includePendingDebts) {
      searchParams.set("includePendingDebts", "true");
    }
    if (query.includeLastTransactions) {
      searchParams.set("includeLastTransactions", "true");
    }

    const queryString = searchParams.toString();
    const builtUrl = `${this.table}/${id}${queryString ? `?${queryString}` : ""}`;

    return await this.api.doQuery<AccountDto>(
      builtUrl,
      Methods.GET,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  async sync(accountId: number): Promise<number> {
    return await this.api.patch(`${this.table}/${accountId}/sync`, undefined);
  }

  async balanceHistory(
    filters: FilterBalanceHistoryDto,
  ): Promise<BalanceHistoryDto> {
    const searchParams = new URLSearchParams({
      from: filters.from,
      to: filters.to,
      granularity: filters.granularity ?? BalanceHistoryGranularity.Day,
    });

    if (filters.userId) {
      searchParams.set("userId", String(filters.userId));
    }

    const [firstAccountId] = filters.accountIds;
    if (filters.accountIds.length > 1) {
      searchParams.set("accountIds", filters.accountIds.join(","));
    }

    const builtUrl =
      filters.accountIds.length > 1
        ? `${this.table}/balance-history?${searchParams.toString()}`
        : `${this.table}/${firstAccountId}/balance-history?${searchParams.toString()}`;

    return await this.api.doQuery<BalanceHistoryDto>(
      builtUrl,
      Methods.GET,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  async savingsProjection(
    filters: FilterSavingsProjectionDto,
  ): Promise<SavingsProjectionDto> {
    const searchParams = appendSavingsDepositParams(
      new URLSearchParams({ horizon: filters.horizon }),
      filters,
    );

    const builtUrl = `${this.table}/${filters.accountId}/savings-projection?${searchParams.toString()}`;

    return await this.api.doQuery<SavingsProjectionDto>(
      builtUrl,
      Methods.GET,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  async savingsProjectionDaily(
    filters: FilterSavingsProjectionDailyDto,
  ): Promise<SavingsProjectionDailyDto> {
    const searchParams = appendSavingsDepositParams(
      new URLSearchParams({ month: filters.month }),
      filters,
    );

    const builtUrl = `${this.table}/${filters.accountId}/savings-projection/daily?${searchParams.toString()}`;

    return await this.api.doQuery<SavingsProjectionDailyDto>(
      builtUrl,
      Methods.GET,
      undefined,
      this.api.defaultTokenAcquirer(),
    );
  }

  async processImport(
    file: File,
    override?: boolean,
  ): Promise<ImportPreviewAccountDto[]> {
    const items = await parseJSONFile<AccountDto>(file);
    return await this.api.doQuery<ImportPreviewAccountDto[]>(
      `${this.table}/import/process${override ? `?override=true` : ""}`,
      Methods.POST,
      items,
      this.api.defaultTokenAcquirer(),
    );
  }

  async adjustBalance(
    accountId: number,
    data: AdjustBalanceDto,
  ): Promise<TransactionDto> {
    return await this.api.patch(
      `${this.table}/${accountId}/adjust-balance`,
      data,
    );
  }

  async import(data: ImportDto<ImportPreviewAccountDto>): Promise<number> {
    return await this.api.post(`${this.table}/import`, data);
  }
}
