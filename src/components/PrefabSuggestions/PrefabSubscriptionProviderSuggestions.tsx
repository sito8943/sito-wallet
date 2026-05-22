import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Loading, useNotification } from "@sito/dashboard-app";

import { useManager } from "providers";
import { detectCountry, detectCurrency } from "lib";
import type { PrefabSubscriptionProviderDto } from "lib";

import { FALLBACK_CURRENCY } from "./constants";
import { toggleInArray } from "./utils";
import type { PrefabSuggestionPropsType } from "./types";

import "./styles.css";

export function PrefabSubscriptionProviderSuggestions(
  props: PrefabSuggestionPropsType,
) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification } = useNotification();

  const country = useMemo(() => detectCountry(), []);
  const defaultCurrencyCode = useMemo(() => detectCurrency(country), [country]);

  const [providers, setProviders] = useState<PrefabSubscriptionProviderDto[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    if (!("SubscriptionProviders" in manager)) {
      setError(t("_pages:prefabs.subscriptions.loadError"));
      setLoading(false);
      return;
    }

    manager.SubscriptionProviders.getPrefabs({ country })
      .then((data) => {
        setProviders(data);
      })
      .catch(() => {
        setError(t("_pages:prefabs.subscriptions.loadError"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [country, manager, t]);

  const handleToggle = useCallback((key: string) => {
    setSelected((prev) => toggleInArray(prev, key));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selected.length === 0) return;
    if (!("SubscriptionProviders" in manager)) return;

    setSubmitting(true);
    const payload = selected
      .map((key) => {
        const prefab = providers.find((p) => p.key === key);
        if (!prefab) return null;
        return {
          name: prefab.name,
          description: prefab.description ?? null,
          website: prefab.website ?? null,
          photo: prefab.image ?? null,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    if (payload.length === 0) {
      setSubmitting(false);
      return;
    }

    try {
      await manager.SubscriptionProviders.insertMany(payload);
      onComplete?.();
    } catch {
      showErrorNotification({ message: t("_accessibility:errors.500") });
    } finally {
      setSubmitting(false);
    }
  }, [manager, onComplete, providers, selected, showErrorNotification, t]);

  if (loading) {
    return (
      <div className="prefab-suggestions-empty">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="prefab-suggestions-empty">
        <p className="prefab-suggestions-error error">{error}</p>
      </div>
    );
  }

  if (providers.length === 0) {
    return (
      <div className="prefab-suggestions-empty">
        <p>{t("_pages:prefabs.subscriptions.empty")}</p>
      </div>
    );
  }

  return (
    <div className="prefab-suggestions">
      <div className="prefab-suggestions-grid">
        {providers.map((provider) => {
          const isSelected = selected.includes(provider.key);
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
              className={`prefab-suggestions-card ${
                isSelected ? "prefab-suggestions-card-selected" : ""
              }`}
              aria-pressed={isSelected}
              onClick={() => handleToggle(provider.key)}
            >
              {provider.image && (
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="prefab-suggestions-provider-logo"
                />
              )}
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
      <div className="prefab-suggestions-actions">
        <Button
          color="primary"
          variant="submit"
          disabled={selected.length === 0 || submitting}
          onClick={() => void handleSubmit()}
        >
          {submitting ? <Loading /> : t("_pages:prefabs.addSelected")}
        </Button>
      </div>
    </div>
  );
}
