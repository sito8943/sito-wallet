import BaseClient from "./BaseClient";

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

export default class AccountClient extends BaseClient<
  AccountDto,
  CommonAccountDto,
  AddAccountDto,
  UpdateAccountDto,
  FilterAccountDto
> {
  /**
   */
  constructor() {
    super(Tables.Accounts);
  }

  async sync(accountId: number): Promise<number> {
    return await this.api.patch(`${this.table}/${accountId}/sync`, undefined);
  }
}
