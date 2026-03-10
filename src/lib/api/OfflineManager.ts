import { IManager } from "@sito/dashboard-app";
import { OfflineAuthClient } from "./OfflineAuthClient";

// offline clients
import {
  AccountIndexedDBClient,
  CurrencyIndexedDBClient,
  TransactionIndexedDBClient,
  TransactionCategoryIndexedDBClient,
  DashboardIndexedDBClient,
  ProfileIndexedDBClient,
  clearOfflineIndexedDatabases,
} from "./offline";

// config
import { config } from "../../config";

export class OfflineManager extends IManager {
  accounts: AccountIndexedDBClient = new AccountIndexedDBClient();
  currencies: CurrencyIndexedDBClient = new CurrencyIndexedDBClient();
  transactions: TransactionIndexedDBClient = new TransactionIndexedDBClient();
  transactionCategories: TransactionCategoryIndexedDBClient =
    new TransactionCategoryIndexedDBClient();
  dashboard: DashboardIndexedDBClient = new DashboardIndexedDBClient();
  profiles: ProfileIndexedDBClient = new ProfileIndexedDBClient();

  constructor() {
    const authConfig = {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    };

    super("", config.auth.user, authConfig);
    this.auth = new OfflineAuthClient(config.auth.user, authConfig);
  }

  get TransactionCategories(): TransactionCategoryIndexedDBClient {
    return this.transactionCategories;
  }

  get Transactions(): TransactionIndexedDBClient {
    return this.transactions;
  }

  get Accounts(): AccountIndexedDBClient {
    return this.accounts;
  }

  get Currencies(): CurrencyIndexedDBClient {
    return this.currencies;
  }

  get Dashboard(): DashboardIndexedDBClient {
    return this.dashboard;
  }

  get Profiles(): ProfileIndexedDBClient {
    return this.profiles;
  }

  async clearIndexedDatabases(): Promise<void> {
    this.accounts.close();
    this.currencies.close();
    this.transactions.close();
    this.transactionCategories.close();
    this.dashboard.close();
    this.profiles.close();

    await clearOfflineIndexedDatabases();
  }
}
