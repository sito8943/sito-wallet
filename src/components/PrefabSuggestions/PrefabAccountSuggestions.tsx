import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Loading, useNotification } from "@sito/dashboard-app";

import { useManager } from "providers";
import { useCurrenciesCommon } from "hooks";

import { PREFAB_ACCOUNTS } from "./constants";
import { mapAccountType, toggleInArray } from "./utils";
import type { AccountConfigEntry, PrefabSuggestionPropsType } from "./types";

import "./styles.css";

export function PrefabAccountSuggestions(props: PrefabSuggestionPropsType) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification } = useNotification();

  const { data: currencies, isLoading: currenciesLoading } =
    useCurrenciesCommon();

  const defaultCurrencyId = useMemo(() => currencies?.[0]?.id, [currencies]);

  const [selected, setSelected] = useState<string[]>([]);
  const [config, setConfig] = useState<Record<string, AccountConfigEntry>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleToggle = useCallback(
    (key: string) => {
      if (defaultCurrencyId === undefined) return;

      setSelected((prev) => toggleInArray(prev, key));
      setConfig((prev) => {
        if (prev[key]) {
          const next = { ...prev };
          delete next[key];
          return next;
        }
        return {
          ...prev,
          [key]: { balance: 0, currencyId: defaultCurrencyId },
        };
      });
    },
    [defaultCurrencyId],
  );

  const handleConfigChange = useCallback(
    (key: string, entry: AccountConfigEntry) => {
      setConfig((prev) => ({ ...prev, [key]: entry }));
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (selected.length === 0) return;

    setSubmitting(true);
    const payload = selected
      .map((key) => {
        const prefab = PREFAB_ACCOUNTS.find((a) => a.key === key);
        const cfg = config[key];
        if (!prefab || !cfg) return null;
        return {
          name: t(`_pages:prefabs.accounts.items.${key}.name`),
          description: "",
          balance: cfg.balance,
          type: mapAccountType(prefab.type),
          currencyId: cfg.currencyId,
          userId: 0,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);

    if (payload.length === 0) {
      setSubmitting(false);
      return;
    }

    try {
      await manager.Accounts.insertMany(payload);
      onComplete?.();
    } catch {
      showErrorNotification({ message: t("_accessibility:errors.500") });
    } finally {
      setSubmitting(false);
    }
  }, [
    config,
    manager.Accounts,
    onComplete,
    selected,
    showErrorNotification,
    t,
  ]);

  if (currenciesLoading) {
    return (
      <div className="prefab-suggestions-empty">
        <Loading />
      </div>
    );
  }

  if (!currencies || currencies.length === 0) {
    return (
      <div className="prefab-suggestions-empty">
        <p>{t("_pages:prefabs.accounts.requiresCurrencies")}</p>
      </div>
    );
  }

  return (
    <div className="prefab-suggestions">
      <div className="prefab-suggestions-grid">
        {PREFAB_ACCOUNTS.map((account) => {
          const isSelected = selected.includes(account.key);
          const cfg = config[account.key];

          return (
            <div
              key={account.key}
              className={`prefab-suggestions-account-card ${
                isSelected ? "prefab-suggestions-card-selected" : ""
              }`}
            >
              <button
                type="button"
                className="prefab-suggestions-account-toggle"
                aria-pressed={isSelected}
                onClick={() => handleToggle(account.key)}
              >
                <span
                  className="prefab-suggestions-card-dot"
                  style={{ backgroundColor: account.color }}
                />
                <span className="prefab-suggestions-card-copy">
                  <span className="prefab-suggestions-card-title">
                    {t(`_pages:prefabs.accounts.items.${account.key}.name`)}
                  </span>
                </span>
              </button>

              {isSelected && cfg && (
                <div className="prefab-suggestions-account-fields">
                  <label className="prefab-suggestions-field">
                    <span>{t("_pages:prefabs.accounts.balance")}</span>
                    <input
                      type="number"
                      className="input"
                      value={cfg.balance}
                      onChange={(event) =>
                        handleConfigChange(account.key, {
                          ...cfg,
                          balance: Number(event.target.value) || 0,
                        })
                      }
                    />
                  </label>
                  <label className="prefab-suggestions-field">
                    <span>{t("_pages:prefabs.accounts.currency")}</span>
                    <select
                      className="input"
                      value={cfg.currencyId}
                      onChange={(event) =>
                        handleConfigChange(account.key, {
                          ...cfg,
                          currencyId: Number(event.target.value),
                        })
                      }
                    >
                      {currencies.map((currency) => (
                        <option key={currency.id} value={currency.id}>
                          {currency.symbol} {currency.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              )}
            </div>
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
