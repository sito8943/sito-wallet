import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Loading, useNotification } from "@sito/dashboard-app";

import { useManager } from "providers";
import { detectCountry, detectCurrency } from "lib";

import { PREFAB_CURRENCIES } from "./constants";
import { toggleInArray } from "./utils";
import type { PrefabSuggestionPropsType } from "./types";

import "./styles.css";

export function PrefabCurrencySuggestions(props: PrefabSuggestionPropsType) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification } = useNotification();

  const defaultCurrencyCode = useMemo(
    () => detectCurrency(detectCountry()),
    [],
  );

  const [selected, setSelected] = useState<string[]>(() => [
    defaultCurrencyCode,
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleToggle = useCallback((code: string) => {
    setSelected((prev) => toggleInArray(prev, code));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selected.length === 0) return;

    setSubmitting(true);
    const payload = selected.map((code) => {
      const prefab = PREFAB_CURRENCIES.find((c) => c.code === code);
      return {
        name: prefab?.name ?? code,
        symbol: prefab?.symbol ?? code,
        description: "",
        userId: 0,
      };
    });

    try {
      await manager.Currencies.insertMany(payload);
      onComplete?.();
    } catch {
      showErrorNotification({ message: t("_accessibility:errors.500") });
    } finally {
      setSubmitting(false);
    }
  }, [manager.Currencies, onComplete, selected, showErrorNotification, t]);

  return (
    <div className="prefab-suggestions">
      <p className="prefab-suggestions-hint">
        {t("_pages:prefabs.currencies.hint", { code: defaultCurrencyCode })}
      </p>
      <div className="prefab-suggestions-grid">
        {PREFAB_CURRENCIES.map((currency) => {
          const isSelected = selected.includes(currency.code);
          return (
            <button
              key={currency.code}
              type="button"
              className={`prefab-suggestions-card ${
                isSelected ? "prefab-suggestions-card-selected" : ""
              }`}
              aria-pressed={isSelected}
              onClick={() => handleToggle(currency.code)}
            >
              <span className="prefab-suggestions-card-symbol">
                {currency.symbol}
              </span>
              <span className="prefab-suggestions-card-copy">
                <span className="prefab-suggestions-card-title">
                  {currency.code}
                </span>
                <span className="prefab-suggestions-card-description">
                  {currency.name}
                </span>
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
