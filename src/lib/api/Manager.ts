import AccountClient from "./AccountClient";
import CurrencyClient from "./CurrencyClient";
import TransactionClient from "./TransactionClient";
import TransactionCategoryClient from "./TransactionCategoryClient";
import DashboardClient from "./DashboardClient";

// @sito/dashboard-app
import { IManager } from "@sito/dashboard-app";

// config
import { config } from "../../config";

export class Manager extends IManager {
  accounts: AccountClient = new AccountClient();
  currencies: CurrencyClient = new CurrencyClient();
  transactions: TransactionClient = new TransactionClient();
  transactionCategories: TransactionCategoryClient =
    new TransactionCategoryClient();
  dashboard: DashboardClient = new DashboardClient();

  constructor() {
    super(config.apiUrl, config.auth.user);
  }

  get TransactionCategories(): TransactionCategoryClient {
    return this.transactionCategories;
  }

  /**
   * @returns transaction
   */
  get Transactions(): TransactionClient {
    return this.transactions;
  }

  /**
   * @returns accounts
   */
  get Accounts(): AccountClient {
    return this.accounts;
  }

  /**
   * @returns currencies
   */
  get Currencies(): CurrencyClient {
    return this.currencies;
  }

  /**
   * @returns dashboard
   */
  get Dashboard(): DashboardClient {
    return this.dashboard;
  }
}
