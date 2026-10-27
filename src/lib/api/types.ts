export enum Tables {
  Accounts = "accounts",
  Currencies = "currencies",
  Transactions = "transactions",
  TransactionCategories = "transaction-categories",
  SubscriptionProviders = "subscription-providers",
  Products = "products",
  PurchaseProviders = "purchase-providers",
  Subscriptions = "subscriptions",
  Debts = "debts",
  Notifications = "notifications",
  UserDashboardConfig = "user-dashboard-config",
  Profiles = "profiles",
  Users = "users",
}

export enum TablesCamelCase {
  Accounts = "accounts",
  Currencies = "currencies",
  Transactions = "transactions",
  TransactionCategories = "transactionCategories",
  SubscriptionProviders = "subscriptionProviders",
  Products = "products",
  PurchaseProviders = "purchaseProviders",
  Subscriptions = "subscriptions",
  Debts = "debts",
  Notifications = "notifications",
  UserDashboardConfig = "userDashboardConfig",
  Profiles = "profiles",
  Users = "users",
}

export enum EntityName {
  Account = "account",
  Currency = "currency",
  Transaction = "transaction",
  TransactionCategory = "transactionCategory",
  SubscriptionProvider = "subscriptionProvider",
  Product = "product",
  PurchaseProvider = "purchaseProvider",
  Subscription = "subscription",
  Debt = "debt",
  Notification = "notification",
  UserDashboardConfig = "userDashboardConfig",
  Profile = "profile",
  User = "user",
}

export type PhotoUploadRequestOptions = {
  headers?: HeadersInit;
  credentials?: RequestCredentials;
};

export type PhotoUploadRequestConfig = HeadersInit | PhotoUploadRequestOptions;
