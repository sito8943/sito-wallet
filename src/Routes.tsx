// layouts
import { View, Auth } from "./layouts";
import { Routes as ReactRoutes, Route } from "react-router-dom";
import { useAuth } from "@sito/dashboard-app";
import { useFeatureFlags } from "providers";
import { AppRoutes, isAdminSession } from "lib";
import { routeComponents } from "./views/routes";

export const Routes = () => {
  const { isFeatureEnabled } = useFeatureFlags();
  const { account } = useAuth();
  const canAccessUsers = isAdminSession(account);
  const {
    SignUp,
    SignIn,
    SignOut,
    UpdatePassword,
    Recovery,
    SignUpSuccess,
    ConfirmEmailSuccess,
    ConfirmEmailError,
    Home,
    Onboarding,
    Notifications,
    NotFound,
    TransactionCategories,
    Subscriptions,
    SubscriptionEditor,
    SubscriptionProviders,
    Debts,
    DebtEditor,
    Transactions,
    Accounts,
    Currencies,
    Profile,
    Users,
    FeatureUnavailable,
    About,
    CookiesPolicy,
    PrivacyPolicy,
    TermsAndConditions,
  } = routeComponents;

  return (
    <ReactRoutes>
      <Route path={AppRoutes.authRoot} element={<Auth />}>
        <Route path={AppRoutes.signIn} element={<SignIn />} />
        <Route path={AppRoutes.signUp} element={<SignUp />} />
        <Route path={AppRoutes.signUpSuccess} element={<SignUpSuccess />} />
        <Route path={AppRoutes.resetPassword} element={<UpdatePassword />} />
        <Route path={AppRoutes.updatePassword} element={<UpdatePassword />} />
        <Route path={AppRoutes.recovery} element={<Recovery />} />
        <Route
          path={AppRoutes.confirmEmailSuccess}
          element={<ConfirmEmailSuccess />}
        />
        <Route
          path={AppRoutes.confirmEmailError}
          element={<ConfirmEmailError />}
        />
        <Route path={AppRoutes.authNotFound} element={<NotFound />} />
      </Route>
      <Route path={AppRoutes.signOut} element={<SignOut />} />
      <Route path={AppRoutes.onboarding} element={<Onboarding />} />
      <Route path={AppRoutes.home} element={<View />}>
        <Route index element={<Home />} />
        <Route path={AppRoutes.notifications} element={<Notifications />} />
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
          path={AppRoutes.debts}
          element={
            isFeatureEnabled("debtsEnabled") ? (
              <Debts />
            ) : (
              <FeatureUnavailable module="debts" />
            )
          }
        />
        <Route
          path={AppRoutes.debtNew}
          element={
            isFeatureEnabled("debtsEnabled") ? (
              <DebtEditor />
            ) : (
              <FeatureUnavailable module="debts" />
            )
          }
        />
        <Route
          path={AppRoutes.debtEdit}
          element={
            isFeatureEnabled("debtsEnabled") ? (
              <DebtEditor />
            ) : (
              <FeatureUnavailable module="debts" />
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
        <Route
          path={AppRoutes.users}
          element={canAccessUsers ? <Users /> : <NotFound />}
        />
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
  );
};
