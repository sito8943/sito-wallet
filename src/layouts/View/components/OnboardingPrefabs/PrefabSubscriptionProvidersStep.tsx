import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Loading } from "@sito/dashboard-app";

import { usePrefabOnboarding } from "./prefabOnboardingContext";
import { FALLBACK_CURRENCY } from "./constants";

export function PrefabSubscriptionProvidersStep() {
  const { t } = useTranslation();
  const {
    state,
    providers,
    providersLoading,
    providersError,
    loadProviders,
    toggleProvider,
    defaultCurrencyCode,
  } = usePrefabOnboarding();

  useEffect(() => {
    void loadProviders();
  }, [loadProviders]);

  if (providersLoading) {
    return (
      <div className="prefab-onboarding-step prefab-onboarding-empty">
        <Loading />
      </div>
    );
  }

  if (providersError) {
    return (
      <div className="prefab-onboarding-step prefab-onboarding-empty">
        <p className="prefab-onboarding-error error">{providersError}</p>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="prefab-onboarding-step prefab-onboarding-empty">
        <p>{t("_pages:onboarding.prefabs.subscriptions.empty")}</p>
      </div>
    );
  }

  return (
    <div className="prefab-onboarding-step">
      <div className="prefab-onboarding-grid">
        {providers.map((provider) => {
          const selected = state.selectedProviderKeys.includes(provider.key);
          const price = provider.suggestedPrices[defaultCurrencyCode];
          const showFallback = price === undefined;
          const displayPrice = showFallback
            ? provider.suggestedPrices[FALLBACK_CURRENCY]
            : price;
          const priceCurrency = showFallback
            ? FALLBACK_CURRENCY
            : defaultCurrencyCode;

          return (
            <button
              key={provider.key}
              type="button"
              className={`prefab-onboarding-card prefab-onboarding-provider ${
                selected ? "prefab-onboarding-card-selected" : ""
              }`}
              aria-pressed={selected}
              onClick={() => toggleProvider(provider.key)}
            >
              {provider.image && (
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="prefab-onboarding-provider-logo"
                />
              )}
              <span className="prefab-onboarding-card-copy">
                <span className="prefab-onboarding-card-title">
                  {provider.name}
                </span>
                {displayPrice !== undefined && (
                  <span className="prefab-onboarding-card-description">
                    {priceCurrency} {displayPrice}
                    {showFallback &&
                      ` ${t("_pages:onboarding.prefabs.subscriptions.convertedHint")}`}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
