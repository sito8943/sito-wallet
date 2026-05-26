import AccountClient from "./AccountClient";
import CurrencyClient from "./CurrencyClient";
import TransactionClient from "./TransactionClient";
import TransactionCategoryClient from "./TransactionCategoryClient";
import DashboardClient from "./DashboardClient";
import ProfileClient from "./ProfileClient";
import FeatureFlagClient from "./FeatureFlagClient";
import SubscriptionProviderClient from "./SubscriptionProviderClient";
import SubscriptionClient from "./SubscriptionClient";
import UserClient from "./UserClient";
import UserEntityConfigClient from "./UserEntityConfigClient";
import { AuthApiClient, type WalletAuthApiClient } from "./AuthApiClient";
// @sito/dashboard-app
import {
  IManager,
} from "@sito/dashboard-app";

// config
import { config } from "../../config";

export class Manager extends IManager {
  accounts: AccountClient = new AccountClient();
  currencies: CurrencyClient = new CurrencyClient();
  transactions: TransactionClient = new TransactionClient();
  transactionCategories: TransactionCategoryClient =
    new TransactionCategoryClient();
  dashboard: DashboardClient = new DashboardClient();
  profiles: ProfileClient = new ProfileClient();
  featureFlags: FeatureFlagClient = new FeatureFlagClient();
  subscriptionProviders: SubscriptionProviderClient =
    new SubscriptionProviderClient();
  subscriptions: SubscriptionClient = new SubscriptionClient();
  users: UserClient = new UserClient();
  userEntityConfigs: UserEntityConfigClient = new UserEntityConfigClient();
  authApi: WalletAuthApiClient = new AuthApiClient(
    config.apiUrl,
    config.auth.user,
    {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    },
    {
      endpoints: {
        confirmEmailFallback: "auth/email/confirm/verify",
      },
    },
  );

  constructor() {
    super(config.apiUrl, config.auth.user, {
      rememberKey: config.auth.remember,
      refreshTokenKey: config.auth.refreshTokenKey,
      accessTokenExpiresAtKey: config.auth.accessTokenExpiresAtKey,
    });
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

  /**
   * @returns profile
   */
  get Profiles(): ProfileClient {
    return this.profiles;
  }

  /**
   * @returns app feature flags client
   */
  get FeatureFlags(): FeatureFlagClient {
    return this.featureFlags;
  }

  get SubscriptionProviders(): SubscriptionProviderClient {
    return this.subscriptionProviders;
  }

  get Subscriptions(): SubscriptionClient {
    return this.subscriptions;
  }

  get Users(): UserClient {
    return this.users;
  }

  get UserEntityConfigs(): UserEntityConfigClient {
    return this.userEntityConfigs;
  }

  get AuthApi(): WalletAuthApiClient {
    return this.authApi;
  }
}
