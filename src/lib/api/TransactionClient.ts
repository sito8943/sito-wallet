import BaseClient from "./BaseClient";

// enum
import { Tables } from "./types";

// types
import {
  CommonTransactionDto,
  TransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto,
  AddTransactionDto,
} from "lib";

export default class TransactionClient extends BaseClient<
  TransactionDto,
  CommonTransactionDto,
  AddTransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto
> {
  /**
   */
  constructor() {
    super(Tables.Transactions);
  }
}
