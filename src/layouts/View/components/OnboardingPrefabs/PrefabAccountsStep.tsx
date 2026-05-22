import { useTranslation } from "react-i18next";

import { PREFAB_ACCOUNTS, PREFAB_CURRENCIES } from "./constants";
import { usePrefabOnboarding } from "./prefabOnboardingContext";

export function PrefabAccountsStep() {
  const { t } = useTranslation();
  const { state, toggleAccount, setAccountConfig } = usePrefabOnboarding();

  const availableCurrencies = PREFAB_CURRENCIES.filter((c) =>
    state.selectedCurrencyCodes.includes(c.code),
  );

  return (
    <div className="prefab-onboarding-step">
      <div className="prefab-onboarding-grid">
        {PREFAB_ACCOUNTS.map((account) => {
          const selected = state.selectedAccountKeys.includes(account.key);
          const cfg = state.accountConfig[account.key];

          return (
            <div
              key={account.key}
              className={`prefab-onboarding-account-card ${
                selected ? "prefab-onboarding-card-selected" : ""
              }`}
            >
              <button
                type="button"
                className="prefab-onboarding-account-toggle"
                aria-pressed={selected}
                onClick={() => toggleAccount(account.key)}
              >
                <span
                  className="prefab-onboarding-card-dot"
                  style={{ backgroundColor: account.color }}
                />
                <span className="prefab-onboarding-card-copy">
                  <span className="prefab-onboarding-card-title">
                    {t(
                      `_pages:onboarding.prefabs.accounts.items.${account.key}.name`,
                    )}
                  </span>
                </span>
              </button>

              {selected && cfg && (
                <div className="prefab-onboarding-account-fields">
                  <label className="prefab-onboarding-field">
                    <span>
                      {t("_pages:onboarding.prefabs.accounts.balance")}
                    </span>
                    <input
                      type="number"
                      className="input"
                      value={cfg.balance}
                      onChange={(event) =>
                        setAccountConfig(account.key, {
                          ...cfg,
                          balance: Number(event.target.value) || 0,
                        })
                      }
                    />
                  </label>
                  <label className="prefab-onboarding-field">
                    <span>
                      {t("_pages:onboarding.prefabs.accounts.currency")}
                    </span>
                    <select
                      className="input"
                      value={cfg.currencyCode}
                      onChange={(event) =>
                        setAccountConfig(account.key, {
                          ...cfg,
                          currencyCode: event.target.value,
                        })
                      }
                    >
                      {availableCurrencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code}
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
    </div>
  );
}
