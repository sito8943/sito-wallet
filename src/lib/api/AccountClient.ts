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
}
