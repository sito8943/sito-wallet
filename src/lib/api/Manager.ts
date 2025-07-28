import AccountClient from "./AccountClient";
import AuthClient from "./AuthClient";
import CurrencyClient from "./CurrencyClient";

export class Manager {
  accounts: AccountClient = new AccountClient();
  currencies: CurrencyClient = new CurrencyClient();
  auth: AuthClient = new AuthClient();

  constructor() {}

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
