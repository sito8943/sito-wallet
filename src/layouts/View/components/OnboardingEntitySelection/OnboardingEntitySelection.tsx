import { useTranslation } from "react-i18next";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ONBOARDING_ENTITY_OPTIONS } from "./constants";
import type {
  OnboardingEntityCardStyle,
  OnboardingEntitySelectionPropsType,
} from "./types";

import "./styles.css";

export function OnboardingEntitySelection(
  props: OnboardingEntitySelectionPropsType,
) {
  const { selectedEntityKeys, onToggleEntity } = props;

  console.log(selectedEntityKeys);

  const { t } = useTranslation();

  return (
    <div className="onboarding-entity-selection">
      {ONBOARDING_ENTITY_OPTIONS.map((option, index) => {
        const selected = selectedEntityKeys.includes(option.key);
        const style: OnboardingEntityCardStyle = {
          "--onboarding-entity-delay": `${index * 70}ms`,
        };

        console.log(selected, option.key);

        return (
          <button
            key={option.key}
            type="button"
            className={`onboarding-entity-card ${
              selected ? "onboarding-entity-card-selected" : ""
            }`}
            style={style}
            aria-pressed={selected}
            onClick={() => onToggleEntity(option.key)}
          >
            <span className="onboarding-entity-card-icon">
              <FontAwesomeIcon icon={option.icon} />
            </span>
            <span className="onboarding-entity-card-copy">
              <span className="onboarding-entity-card-title">
                {t(`_entities:entities.${option.entityName}.plural`)}
              </span>
              <span className="onboarding-entity-card-description">
                {t(option.descriptionKey)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
