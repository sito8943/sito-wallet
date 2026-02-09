import { BaseClient, Methods } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// types
import {
  CommonAccountDto,
  AccountDto,
  UpdateAccountDto,
  FilterAccountDto,
  AddAccountDto,
  ImportPreviewAccountDto,
  ImportDto,
  parseJSONFile,
} from "lib";

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
    super(Tables.Accounts, config.apiUrl, config.auth.user);
  }

  async sync(accountId: number): Promise<number> {
    return await this.api.patch(`${this.table}/${accountId}/sync`, undefined);
  }

  async processImport(
    file: File,
    override?: boolean
  ): Promise<ImportPreviewAccountDto[]> {
    const items = await parseJSONFile<AccountDto>(file);
    return await this.api.doQuery<ImportPreviewAccountDto[]>(
      `${this.table}/import/process${override ? `?override=true` : ""}`,
      Methods.POST,
      items,
      {
        ...this.api.defaultTokenAcquirer(),
      }
    );
  }

  async import(data: ImportDto<ImportPreviewAccountDto>): Promise<number> {
    return await this.api.post(`${this.table}/import`, data);
  }
}
