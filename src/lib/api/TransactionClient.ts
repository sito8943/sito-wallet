import BaseClient from "./BaseClient";

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

export default class TransactionCategoryClient extends BaseClient<
  TransactionCategoryDto,
  CommonTransactionCategoryDto,
  AddTransactionCategoryDto,
  UpdateTransactionCategoryDto,
  FilterTransactionCategoryDto
> {
  /**
   */
  constructor() {
    super(Tables.TransactionCategories);
  }
}
