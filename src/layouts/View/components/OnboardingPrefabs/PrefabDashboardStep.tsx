import { useTranslation } from "react-i18next";

import { CARD_LABEL_BY_TYPE, PREFAB_DASHBOARD } from "./constants";

export function PrefabDashboardStep() {
  const { t } = useTranslation();

  return (
    <div className="prefab-onboarding-step">
      <p className="prefab-onboarding-hint">
        {t("_pages:onboarding.prefabs.dashboard.hint")}
      </p>
      <div className="prefab-onboarding-dashboard-preview">
        {PREFAB_DASHBOARD.cards.map((card) => (
          <div
            key={`${card.type}-${card.position}`}
            className={`prefab-onboarding-dashboard-card prefab-onboarding-dashboard-card-${card.size}`}
          >
            <span className="prefab-onboarding-card-title">
              {t(CARD_LABEL_BY_TYPE[card.type] ?? "")}
            </span>
            <span className="prefab-onboarding-card-description">
              {t("_pages:onboarding.prefabs.dashboard.sizeLabel", {
                size: card.size,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
