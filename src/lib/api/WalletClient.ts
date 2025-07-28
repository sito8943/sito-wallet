import BaseClient from "./BaseClient";

// enum
import { Tables } from "./types";

// types
import {
  CommonWalletDto,
  WalletDto,
  UpdateWalletDto,
  FilterWalletDto,
  AddWalletDto,
} from "lib";

export default class WalletClient extends BaseClient<
  WalletDto,
  CommonWalletDto,
  AddWalletDto,
  UpdateWalletDto,
  FilterWalletDto
> {
  /**
   */
  constructor() {
    super(Tables.Wallets);
  }
}
