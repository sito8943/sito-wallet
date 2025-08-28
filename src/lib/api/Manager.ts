import AccountClient from "./AccountClient";
import AuthClient from "./AuthClient";
import CurrencyClient from "./CurrencyClient";
import TransactionClient from "./TransactionClient";
import TransactionCategoryClient from "./TransactionCategoryClient";
import DashboardClient from "./DashboardClient";

export class Manager {
  accounts: AccountClient = new AccountClient();
  currencies: CurrencyClient = new CurrencyClient();
  transactions: TransactionClient = new TransactionClient();
  transactionCategories: TransactionCategoryClient =
    new TransactionCategoryClient();
  auth: AuthClient = new AuthClient();
  dashboard: DashboardClient = new DashboardClient();

  constructor() {}

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
   * @returns auth
   */
  get Auth(): AuthClient {
    return this.auth;
  }

  /**
   * @returns dashboard
   */
  get Dashboard(): DashboardClient {
    return this.dashboard;
  }
}
