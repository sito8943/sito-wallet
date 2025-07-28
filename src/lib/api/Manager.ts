import WalletClient from "./WalletClient";

export class Manager {
  wallets: WalletClient = new WalletClient();

  constructor() {}

  /**
   * @returns wallets
   */
  get Wallets(): WalletClient {
    return this.wallets;
  }
}
