import loadable from "@loadable/component";

// layouts
import { View, Auth } from "./layouts";
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";
import { useFeatureFlags } from "providers";
import { AppRoutes } from "lib";

// auth
const SignUp = loadable(() =>
  import("views/Auth/SignUp").then((module) => ({
    default: module.SignUp,
  })),
);
const SignIn = loadable(() =>
  import("views/Auth/SignIn").then((module) => ({
    default: module.SignIn,
  })),
);
const SignOut = loadable(() =>
  import("views/Auth/SignOut").then((module) => ({
    default: module.SignOut,
  })),
);
const UpdatePassword = loadable(() =>
  import("views/Auth/UpdatePassword").then((module) => ({
    default: module.UpdatePassword,
  })),
);
const Recovery = loadable(() =>
  import("views/Auth/Recovery").then((module) => ({
    default: module.Recovery,
  })),
);
// view
const Home = loadable(() =>
  import("views/Home/Home").then((module) => ({
    default: module.Home,
  })),
);
const NotFound = loadable(() =>
  import("views/NotFound").then((module) => ({
    default: module.NotFound,
  })),
);
const TransactionCategories = loadable(() =>
  import("views/TransactionCategories/TransactionCategories").then(
    (module) => ({
      default: module.TransactionCategories,
    }),
  ),
);
const Subscriptions = loadable(() =>
  import("views/Subscriptions/Subscriptions").then((module) => ({
    default: module.Subscriptions,
  })),
);
const SubscriptionEditor = loadable(() =>
  import("views/Subscriptions/SubscriptionEditor").then((module) => ({
    default: module.SubscriptionEditor,
  })),
);
const SubscriptionProviders = loadable(() =>
  import("views/SubscriptionProviders/SubscriptionProviders").then(
    (module) => ({
      default: module.SubscriptionProviders,
    }),
  ),
);
const Transactions = loadable(() =>
  import("views/Transactions/Transactions").then((module) => ({
    default: module.Transactions,
  })),
);
const Accounts = loadable(() =>
  import("views/Accounts/Accounts").then((module) => ({
    default: module.Accounts,
  })),
);
const Currencies = loadable(() =>
  import("views/Currencies/Currencies").then((module) => ({
    default: module.Currencies,
  })),
);
const Profile = loadable(() =>
  import("views/Profile/Profile").then((module) => ({
    default: module.Profile,
  })),
);
const FeatureUnavailable = loadable(() =>
  import("views/FeatureUnavailable").then((module) => ({
    default: module.FeatureUnavailable,
  })),
);
// Info
const About = loadable(() =>
  import("views/Info/About").then((module) => ({
    default: module.About,
  })),
);
const CookiesPolicy = loadable(() =>
  import("views/Info/CookiesPolicy").then((module) => ({
    default: module.CookiesPolicy,
  })),
);
const PrivacyPolicy = loadable(() =>
  import("views/Info/PrivacyPolicy").then((module) => ({
    default: module.PrivacyPolicy,
  })),
);
const TermsAndConditions = loadable(() =>
  import("views/Info/TermsAndConditions").then((module) => ({
    default: module.TermsAndConditions,
  })),
);

export const Routes = () => {
  const { isFeatureEnabled } = useFeatureFlags();

  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route path={AppRoutes.authRoot} element={<Auth />}>
          <Route path={AppRoutes.signIn} element={<SignIn />} />
          <Route path={AppRoutes.signUp} element={<SignUp />} />
          <Route path={AppRoutes.updatePassword} element={<UpdatePassword />} />
          <Route path={AppRoutes.recovery} element={<Recovery />} />
          <Route path={AppRoutes.authNotFound} element={<NotFound />} />
        </Route>
        <Route path={AppRoutes.signOut} element={<SignOut />} />
        <Route path={AppRoutes.home} element={<View />}>
          <Route index element={<Home />} />
          <Route
            path={AppRoutes.transactions}
            element={
              isFeatureEnabled("transactionsEnabled") ? (
                <Transactions />
              ) : (
                <FeatureUnavailable module="transactions" />
              )
            }
          />
          <Route
            path={AppRoutes.transactionCategories}
            element={
              isFeatureEnabled("transactionCategoriesEnabled") ? (
                <TransactionCategories />
              ) : (
                <FeatureUnavailable module="transactionCategories" />
              )
            }
          />
          <Route
            path={AppRoutes.subscriptions}
            element={
              isFeatureEnabled("subscriptionsEnabled") ? (
                <Subscriptions />
              ) : (
                <FeatureUnavailable module="subscriptions" />
              )
            }
          />
          <Route
            path={AppRoutes.subscriptionNew}
            element={
              isFeatureEnabled("subscriptionsEnabled") ? (
                <SubscriptionEditor />
              ) : (
                <FeatureUnavailable module="subscriptions" />
              )
            }
          />
          <Route
            path={AppRoutes.subscriptionEdit}
            element={
              isFeatureEnabled("subscriptionsEnabled") ? (
                <SubscriptionEditor />
              ) : (
                <FeatureUnavailable module="subscriptions" />
              )
            }
          />
          <Route
            path={AppRoutes.subscriptionProviders}
            element={
              isFeatureEnabled("subscriptionsEnabled") ? (
                <SubscriptionProviders />
              ) : (
                <FeatureUnavailable module="subscriptions" />
              )
            }
          />
          <Route
            path={AppRoutes.accounts}
            element={
              isFeatureEnabled("accountsEnabled") ? (
                <Accounts />
              ) : (
                <FeatureUnavailable module="accounts" />
              )
            }
          />
          <Route
            path={AppRoutes.currencies}
            element={
              isFeatureEnabled("currenciesEnabled") ? (
                <Currencies />
              ) : (
                <FeatureUnavailable module="currencies" />
              )
            }
          />
          <Route path={AppRoutes.profile} element={<Profile />} />
          <Route path={AppRoutes.about} element={<About />} />
          <Route path={AppRoutes.cookiesPolicy} element={<CookiesPolicy />} />
          <Route path={AppRoutes.privacyPolicy} element={<PrivacyPolicy />} />
          <Route
            path={AppRoutes.termsAndConditions}
            element={<TermsAndConditions />}
          />
          <Route path={AppRoutes.notFound} element={<NotFound />} />
        </Route>
      </ReactRoutes>
    </BrowserRouter>
  );
};
