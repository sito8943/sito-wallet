import { faGhost } from "@fortawesome/free-solid-svg-icons";

import { UserEntityConfigKey } from "lib";
import { type OnboardingSetupStepKey } from "./types";

/**
 * Sentinel icon assigned to the library's "start as guest" action so the button
 * can be reliably targeted and hidden via CSS (`svg[data-icon="ghost"]`). The
 * wallet onboarding intentionally exposes no guest mode — see styles.css.
 */
export const GUEST_ACTION_SENTINEL_ICON = faGhost;

export const ENTITY_STEP_ORDER: Array<{
  entityKey: UserEntityConfigKey;
  stepKey: OnboardingSetupStepKey;
  required?: boolean;
  titleKey: string;
  bodyKey: string;
}> = [
  {
    entityKey: UserEntityConfigKey.Currencies,
    required: true,
    stepKey: "currencies",
    titleKey: "_pages:onboarding.currencies.title",
    bodyKey: "_pages:onboarding.currencies.body",
  },
  {
    entityKey: UserEntityConfigKey.Accounts,
    stepKey: "accounts",
    required: true,
    titleKey: "_pages:onboarding.accounts.title",
    bodyKey: "_pages:onboarding.accounts.body",
  },
  {
    entityKey: UserEntityConfigKey.Transactions,
    stepKey: "transactions",
    titleKey: "_pages:onboarding.transactions.title",
    bodyKey: "_pages:onboarding.transactions.body",
  },
  {
    entityKey: UserEntityConfigKey.Subscriptions,
    stepKey: "subscriptions",
    titleKey: "_pages:onboarding.subscriptions.title",
    bodyKey: "_pages:onboarding.subscriptions.body",
  },
];
