import { faFileInvoice, faRepeat } from "@fortawesome/free-solid-svg-icons";

import { EntityName, UserEntityConfigKey } from "lib";

import type { OnboardingEntityOptionType } from "./types";

export const ONBOARDING_ENTITY_OPTIONS: OnboardingEntityOptionType[] = [
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
    descriptionKey:
      "_pages:onboarding.entities.cards.subscriptions.description",
  },
];
