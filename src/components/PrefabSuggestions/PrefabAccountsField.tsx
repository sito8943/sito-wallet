import { useTranslation } from "react-i18next";

import { PREFAB_ACCOUNTS } from "./constants";
import type { PrefabAccountsFieldPropsType } from "./types";

import "./styles.css";

export function PrefabAccountsField(props: PrefabAccountsFieldPropsType) {
  const { value, onChange, disabled, currencies, defaultCurrencyId } = props;
  const { t } = useTranslation();

  const handleToggle = (key: string) => {
    const next = { ...value };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = { balance: 0, currencyId: defaultCurrencyId };
    }
    onChange(next);
  };

  const handleField = (
    key: string,
    patch: Partial<{ balance: number; currencyId: number }>,
  ) => {
    const current = value[key];
    if (!current) return;
    onChange({ ...value, [key]: { ...current, ...patch } });
  };

  return (
    <div className="prefab-suggestions-grid">
      {PREFAB_ACCOUNTS.map((account) => {
        const cfg = value[account.key];
        const isSelected = Boolean(cfg);

        return (
          <div
            key={account.key}
            className={`prefab-suggestions-account-card ${
              isSelected ? "prefab-suggestions-card-selected" : ""
            }`}
          >
            <button
              type="button"
              disabled={disabled}
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
                    disabled={disabled}
                    value={cfg.balance}
                    onChange={(event) =>
                      handleField(account.key, {
                        balance: Number(event.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label className="prefab-suggestions-field">
                  <span>{t("_pages:prefabs.accounts.currency")}</span>
                  <select
                    className="input"
                    disabled={disabled}
                    value={cfg.currencyId}
                    onChange={(event) =>
                      handleField(account.key, {
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
  );
}
