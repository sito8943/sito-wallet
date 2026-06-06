import loadable from "@loadable/component";
import { defineRouteComponents } from "@sito/dashboard-app";

export const routeComponents = defineRouteComponents({
  SignUp: loadable(() =>
    import("views/Auth/SignUp").then((module) => ({
      default: module.SignUp,
    })),
  ),
  SignIn: loadable(() =>
    import("views/Auth/SignIn").then((module) => ({
      default: module.SignIn,
    })),
  ),
  SignOut: loadable(() =>
    import("views/Auth/SignOut").then((module) => ({
      default: module.SignOut,
    })),
  ),
  UpdatePassword: loadable(() =>
    import("views/Auth/UpdatePassword").then((module) => ({
      default: module.UpdatePassword,
    })),
  ),
  Recovery: loadable(() =>
    import("views/Auth/Recovery").then((module) => ({
      default: module.Recovery,
    })),
  ),
  SignUpSuccess: loadable(() =>
    import("views/Auth/SignUpSuccess").then((module) => ({
      default: module.SignUpSuccess,
    })),
  ),
  ConfirmEmailSuccess: loadable(() =>
    import("views/Auth/ConfirmEmailSuccess").then((module) => ({
      default: module.ConfirmEmailSuccess,
    })),
  ),
  ConfirmEmailError: loadable(() =>
    import("views/Auth/ConfirmEmailError").then((module) => ({
      default: module.ConfirmEmailError,
    })),
  ),
  Home: loadable(() =>
    import("views/Home/Home").then((module) => ({
      default: module.Home,
    })),
  ),
  NotFound: loadable(() =>
    import("views/NotFound").then((module) => ({
      default: module.NotFound,
    })),
  ),
  TransactionCategories: loadable(() =>
    import("views/TransactionCategories/TransactionCategories").then(
      (module) => ({
        default: module.TransactionCategories,
      }),
    ),
  ),
  Subscriptions: loadable(() =>
    import("views/Subscriptions/Subscriptions").then((module) => ({
      default: module.Subscriptions,
    })),
  ),
  Notifications: loadable(() =>
    import("views/Notifications/Notifications").then((module) => ({
      default: module.Notifications,
    })),
  ),
  SubscriptionEditor: loadable(() =>
    import("views/Subscriptions/SubscriptionEditor").then((module) => ({
      default: module.SubscriptionEditor,
    })),
  ),
  SubscriptionProviders: loadable(() =>
    import("views/SubscriptionProviders/SubscriptionProviders").then(
      (module) => ({
        default: module.SubscriptionProviders,
      }),
    ),
  ),
  Debts: loadable(() =>
    import("views/Debts/Debts").then((module) => ({
      default: module.Debts,
    })),
  ),
  DebtEditor: loadable(() =>
    import("views/Debts/DebtEditor").then((module) => ({
      default: module.DebtEditor,
    })),
  ),
  Transactions: loadable(() =>
    import("views/Transactions/Transactions").then((module) => ({
      default: module.Transactions,
    })),
  ),
  Accounts: loadable(() =>
    import("views/Accounts/Accounts").then((module) => ({
      default: module.Accounts,
    })),
  ),
  Currencies: loadable(() =>
    import("views/Currencies/Currencies").then((module) => ({
      default: module.Currencies,
    })),
  ),
  Profile: loadable(() =>
    import("views/Profile/Profile").then((module) => ({
      default: module.Profile,
    })),
  ),
  Users: loadable(() =>
    import("views/Users/Users").then((module) => ({
      default: module.Users,
    })),
  ),
  FeatureUnavailable: loadable(() =>
    import("views/FeatureUnavailable").then((module) => ({
      default: module.FeatureUnavailable,
    })),
  ),
  About: loadable(() =>
    import("views/Info/About").then((module) => ({
      default: module.About,
    })),
  ),
  CookiesPolicy: loadable(() =>
    import("views/Info/CookiesPolicy").then((module) => ({
      default: module.CookiesPolicy,
    })),
  ),
  PrivacyPolicy: loadable(() =>
    import("views/Info/PrivacyPolicy").then((module) => ({
      default: module.PrivacyPolicy,
    })),
  ),
  TermsAndConditions: loadable(() =>
    import("views/Info/TermsAndConditions").then((module) => ({
      default: module.TermsAndConditions,
    })),
  ),
});
