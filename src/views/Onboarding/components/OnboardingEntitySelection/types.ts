import type { CSSProperties } from "react";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import type { EntityName, UserEntityConfigKey } from "lib";

export type OnboardingEntityCardStyle = CSSProperties & {
  "--onboarding-entity-delay": string;
};

export type OnboardingEntityOptionType = {
  key: UserEntityConfigKey;
  entityName: EntityName;
  icon: IconDefinition;
  descriptionKey: string;
};

export interface OnboardingEntitySelectionPropsType {
  selectedEntityKeys: UserEntityConfigKey[];
  onToggleEntity: (entityKey: UserEntityConfigKey) => void;
}
