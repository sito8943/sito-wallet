import { BaseClient } from "@sito/dashboard-app";

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
  }
}
