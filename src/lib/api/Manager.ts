import AccountClient from "./AccountClient";
import AuthClient from "./AuthClient";

export class Manager {
  accounts: AccountClient = new AccountClient();
  auth: AuthClient = new AuthClient();

  constructor() {}

  /**
   * @returns accounts
   */
  get Accounts(): AccountClient {
    return this.accounts;
  }

  /**
   * @returns auth
   */
  get Auth(): AuthClient {
    return this.auth;
  }
}
