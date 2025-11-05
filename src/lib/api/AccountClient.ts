import { BaseClient } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// types
import {
  CommonAccountDto,
  AccountDto,
  UpdateAccountDto,
  FilterAccountDto,
  AddAccountDto,
} from "lib";

// config
import { config } from "../../config";

export default class AccountClient extends BaseClient<
  Tables,
  AccountDto,
  CommonAccountDto,
  AddAccountDto,
  UpdateAccountDto,
  FilterAccountDto
> {
  /**
   */
  constructor() {
    super(Tables.Accounts, config.apiUrl, config.auth.user);
  }

  async sync(accountId: number): Promise<number> {
    return await this.api.patch(`${this.table}/${accountId}/sync`, undefined);
  }
}
