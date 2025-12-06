import { BaseClient } from "@sito/dashboard-app";
import { SupabaseAPIClient } from "./SupabaseAPIClient";

// enum
import { Tables } from "./types";

// types
import {
  CommonTransactionCategoryDto,
  TransactionCategoryDto,
  UpdateTransactionCategoryDto,
  FilterTransactionCategoryDto,
  AddTransactionCategoryDto,
} from "lib";

// config
import { config } from "../../config";

export default class TransactionCategoryClient extends BaseClient<
  Tables,
  TransactionCategoryDto,
  CommonTransactionCategoryDto,
  AddTransactionCategoryDto,
  UpdateTransactionCategoryDto,
  FilterTransactionCategoryDto
> {
  /**
   */
  constructor() {
    super(Tables.TransactionCategories, config.apiUrl, config.auth.user);
    this.api = new SupabaseAPIClient(config.apiUrl, config.auth.user, true) as unknown as typeof this.api;
  }
}
