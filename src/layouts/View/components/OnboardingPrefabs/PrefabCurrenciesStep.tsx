import { useTranslation } from "react-i18next";

import { PREFAB_CURRENCIES } from "./constants";
import { usePrefabOnboarding } from "./prefabOnboardingContext";

export function PrefabCurrenciesStep() {
  const { t } = useTranslation();
  const { state, toggleCurrency, defaultCurrencyCode } = usePrefabOnboarding();

  return (
    <div className="prefab-onboarding-step">
      <p className="prefab-onboarding-hint">
        {t("_pages:onboarding.prefabs.currencies.hint", {
          code: defaultCurrencyCode,
        })}
      </p>
      <div className="prefab-onboarding-grid">
        {PREFAB_CURRENCIES.map((currency) => {
          const selected = state.selectedCurrencyCodes.includes(currency.code);
          return (
            <button
              key={currency.code}
              type="button"
              className={`prefab-onboarding-card ${
                selected ? "prefab-onboarding-card-selected" : ""
              }`}
              aria-pressed={selected}
              onClick={() => toggleCurrency(currency.code)}
            >
              <span className="prefab-onboarding-card-symbol">
                {currency.symbol}
              </span>
              <span className="prefab-onboarding-card-copy">
                <span className="prefab-onboarding-card-title">
                  {currency.code}
                </span>
                <span className="prefab-onboarding-card-description">
                  {currency.name}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
