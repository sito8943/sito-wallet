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
      {
        ...this.api.defaultTokenAcquirer(),
      },
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
      {
        ...this.api.defaultTokenAcquirer(),
      },
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
