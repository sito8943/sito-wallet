import { useTranslation } from "react-i18next";

import { classNames } from "@sito/dashboard-app";

import { PREFAB_CATEGORIES } from "./constants";
import { toggleInArray } from "./utils";
import type { PrefabCategoriesGridPropsType, PrefabCategory } from "./types";

import "./styles.css";

export function PrefabCategoriesGrid(props: PrefabCategoriesGridPropsType) {
  const { value, onChange, disabled } = props;
  const { t } = useTranslation();

  const income = PREFAB_CATEGORIES.filter((c) => c.type === "income");
  const expense = PREFAB_CATEGORIES.filter((c) => c.type === "expense");

  const handleToggle = (key: string) => onChange(toggleInArray(value, key));

  return (
    <div className="prefab-suggestions">
      <PrefabCategoriesSection
        title={t("_pages:prefabs.categories.incomeTitle")}
        items={income}
        value={value}
        disabled={disabled}
        onToggle={handleToggle}
      />
      <PrefabCategoriesSection
        title={t("_pages:prefabs.categories.expenseTitle")}
        items={expense}
        value={value}
        disabled={disabled}
        onToggle={handleToggle}
      />
    </div>
  );
}

type SectionProps = {
  title: string;
  items: PrefabCategory[];
  value: string[];
  disabled?: boolean;
  onToggle: (key: string) => void;
};

function PrefabCategoriesSection(props: SectionProps) {
  const { title, items, value, disabled, onToggle } = props;
  const { t } = useTranslation();

  return (
    <div className="prefab-suggestions-section">
      <h3 className="prefab-suggestions-section-title">{title}</h3>
      <div className="prefab-suggestions-grid">
        {items.map((item) => {
          const isSelected = value.includes(item.key);
          return (
            <button
              key={item.key}
              type="button"
              disabled={disabled}
              className={classNames(
                "prefab-suggestions-card",
                isSelected && "prefab-suggestions-card-selected",
              )}
              aria-pressed={isSelected}
              onClick={() => onToggle(item.key)}
            >
              <span
                className="prefab-suggestions-card-dot"
                style={{ backgroundColor: item.color }}
              />
              <span className="prefab-suggestions-card-copy">
                <span className="prefab-suggestions-card-title">
                  {t(`_pages:prefabs.categories.items.${item.key}.name`)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
