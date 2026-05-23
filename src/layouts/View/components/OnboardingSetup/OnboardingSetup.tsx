// components
import { AccountsSetup } from "./AccountsSetup";
import { CurrenciesSetup } from "./CurrenciesSetup";
import { SubscriptionsSetup } from "./SubscriptionsSetup";
import { TransactionsSetup } from "./TransactionsSetup";

// types
import type { OnboardingSetupPropsType } from "./types";

// styles
import "./styles.css";

export function OnboardingSetup(props: OnboardingSetupPropsType) {
  const { stepKey } = props;

  if (stepKey === "currencies") return <CurrenciesSetup />;
  if (stepKey === "accounts") return <AccountsSetup />;
  if (stepKey === "subscriptions") return <SubscriptionsSetup />;
  return <TransactionsSetup />;
}
