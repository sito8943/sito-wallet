import { IManager } from "@sito/dashboard-app";

// offline clients
import {
  AccountIndexedDBClient,
  CurrencyIndexedDBClient,
  TransactionIndexedDBClient,
  TransactionCategoryIndexedDBClient,
  DashboardIndexedDBClient,
  ProfileIndexedDBClient
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
    super("", config.auth.user);
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
}
