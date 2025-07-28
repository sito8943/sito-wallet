import AccountClient from "./AccountClient";

export class Manager {
  accounts: AccountClient = new AccountClient();

  constructor() {}

  /**
   * @returns accounts
   */
  get Accounts(): AccountClient {
    return this.accounts;
  }
}
