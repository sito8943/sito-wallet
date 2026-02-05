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
  ImportPreviewTransactionCategoryDto,
} from "lib";

// config
import { config } from "../../config";

export default class TransactionCategoryClient extends BaseClient<
  Tables,
  TransactionCategoryDto,
  CommonTransactionCategoryDto,
  AddTransactionCategoryDto,
  UpdateTransactionCategoryDto,
  FilterTransactionCategoryDto,
  ImportPreviewTransactionCategoryDto
> {
  /**
   */
  constructor() {
    super(Tables.TransactionCategories, config.apiUrl, config.auth.user);
  }
}
