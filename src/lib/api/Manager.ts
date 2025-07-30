import AccountClient from "./AccountClient";
import AuthClient from "./AuthClient";
import CurrencyClient from "./CurrencyClient";
import TransactionClient from "./TransactionClient";

export class Manager {
  accounts: AccountClient = new AccountClient();
  currencies: CurrencyClient = new CurrencyClient();
  transactions: TransactionClient = new TransactionClient();
  auth: AuthClient = new AuthClient();

  constructor() {}

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
}
