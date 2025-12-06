import { BaseClient } from "@sito/dashboard-app";
import { SupabaseAPIClient } from "./SupabaseAPIClient";

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
    // Swap transport to Supabase while keeping BaseClient API
    this.api = new SupabaseAPIClient(config.apiUrl, config.auth.user, true) as unknown as typeof this.api;
  }

  async sync(accountId: number): Promise<number> {
    return await this.api.patch(`${this.table}/${accountId}/sync`, undefined);
  }
}
