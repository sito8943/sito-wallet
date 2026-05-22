import {
  faCoins,
  faCreditCard,
  faFileInvoice,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";

import { EntityName, UserEntityConfigKey } from "lib";

import type { OnboardingEntityOptionType } from "./types";

export const ONBOARDING_ENTITY_OPTIONS: OnboardingEntityOptionType[] = [
  {
    key: UserEntityConfigKey.Currencies,
    entityName: EntityName.Currency,
    icon: faCoins,
    descriptionKey: "_pages:onboarding.entities.cards.currencies.description",
  },
  {
    key: UserEntityConfigKey.Accounts,
    entityName: EntityName.Account,
    icon: faCreditCard,
    descriptionKey: "_pages:onboarding.entities.cards.accounts.description",
  },
  {
    key: UserEntityConfigKey.Transactions,
    entityName: EntityName.Transaction,
    icon: faFileInvoice,
    descriptionKey: "_pages:onboarding.entities.cards.transactions.description",
  },
  {
    key: UserEntityConfigKey.Subscriptions,
    entityName: EntityName.Subscription,
    icon: faRepeat,
    descriptionKey: "_pages:onboarding.entities.cards.subscriptions.description",
  },
];
