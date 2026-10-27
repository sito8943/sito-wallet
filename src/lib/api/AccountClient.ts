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
import { parseJSONFile } from "lib";

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
    super(Tables.Accounts, config.apiUrl, config.auth.user, true, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
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

    const builtUrl = `${this.table}/${filters.accountId}/balance-history?${searchParams.toString()}`;

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
    const searchParams = new URLSearchParams({ horizon: filters.horizon });

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
    const searchParams = new URLSearchParams({ month: filters.month });

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
