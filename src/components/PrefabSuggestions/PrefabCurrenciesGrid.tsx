import { classNames } from "@sito/dashboard-app";

import { PREFAB_CURRENCIES } from "./constants";
import { toggleInArray } from "./utils";
import type { PrefabCurrenciesGridPropsType } from "./types";

import "./styles.css";

export function PrefabCurrenciesGrid(props: PrefabCurrenciesGridPropsType) {
  const { value, onChange, disabled } = props;

  return (
    <div className="prefab-suggestions-grid">
      {PREFAB_CURRENCIES.map((currency) => {
        const isSelected = value.includes(currency.code);
        return (
          <button
            key={currency.code}
            type="button"
            disabled={disabled}
            className={classNames(
              "prefab-suggestions-card",
              isSelected && "prefab-suggestions-card-selected",
            )}
            aria-pressed={isSelected}
            onClick={() => onChange(toggleInArray(value, currency.code))}
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
  );
}
