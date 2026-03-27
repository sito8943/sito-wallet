import loadable from "@loadable/component";

// layouts
import { View, Auth } from "./layouts";
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";
import { useFeatureFlags } from "providers";

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
        <Route path="/auth/" element={<Auth />}>
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/auth/update-password" element={<UpdatePassword />} />
          <Route path="/auth/recovery" element={<Recovery />} />
          <Route path="/auth/*" element={<NotFound />} />
        </Route>
        <Route path="/sign-out" element={<SignOut />} />
        <Route path="/" element={<View />}>
          <Route index element={<Home />} />
          <Route
            path="/transactions"
            element={
              isFeatureEnabled("transactionsEnabled") ? (
                <Transactions />
              ) : (
                <FeatureUnavailable module="transactions" />
              )
            }
          />
          <Route
            path="/transaction-categories"
            element={
              isFeatureEnabled("transactionCategoriesEnabled") ? (
                <TransactionCategories />
              ) : (
                <FeatureUnavailable module="transactionCategories" />
              )
            }
          />
          <Route
            path="/accounts"
            element={
              isFeatureEnabled("accountsEnabled") ? (
                <Accounts />
              ) : (
                <FeatureUnavailable module="accounts" />
              )
            }
          />
          <Route
            path="/currencies"
            element={
              isFeatureEnabled("currenciesEnabled") ? (
                <Currencies />
              ) : (
                <FeatureUnavailable module="currencies" />
              )
            }
          />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </ReactRoutes>
    </BrowserRouter>
  );
};
