import { useTranslation } from "react-i18next";

import { classNames } from "@sito/dashboard-app";

import { FALLBACK_CURRENCY } from "./constants";
import { toggleInArray } from "./utils";
import type { PrefabSubscriptionProvidersGridPropsType } from "./types";

import "./styles.css";

export function PrefabSubscriptionProvidersGrid(
  props: PrefabSubscriptionProvidersGridPropsType,
) {
  const { value, onChange, disabled, providers, defaultCurrencyCode } = props;
  const { t } = useTranslation();

  return (
    <div className="prefab-suggestions-grid">
      {providers.map((provider) => {
        const isSelected = value.includes(provider.key);
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
            disabled={disabled}
            className={classNames(
              "prefab-suggestions-card",
              isSelected && "prefab-suggestions-card-selected",
            )}
            aria-pressed={isSelected}
            onClick={() => onChange(toggleInArray(value, provider.key))}
          >
            <span className="prefab-suggestions-card-copy">
              <span className="prefab-suggestions-card-title">
                {provider.name}
              </span>
              {displayPrice !== undefined && (
                <span className="prefab-suggestions-card-description">
                  {priceCurrency} {displayPrice}
                  {showFallback &&
                    ` ${t("_pages:prefabs.subscriptions.convertedHint")}`}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
