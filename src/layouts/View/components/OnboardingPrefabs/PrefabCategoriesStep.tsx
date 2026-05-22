import { useTranslation } from "react-i18next";

import { PREFAB_CATEGORIES } from "./constants";
import { usePrefabOnboarding } from "./prefabOnboardingContext";

export function PrefabCategoriesStep() {
  const { t } = useTranslation();
  const { state, toggleCategory } = usePrefabOnboarding();

  const income = PREFAB_CATEGORIES.filter((c) => c.type === "income");
  const expense = PREFAB_CATEGORIES.filter((c) => c.type === "expense");

  return (
    <div className="prefab-onboarding-step">
      <div className="prefab-onboarding-section">
        <h3 className="prefab-onboarding-section-title">
          {t("_pages:onboarding.prefabs.categories.incomeTitle")}
        </h3>
        <div className="prefab-onboarding-grid">
          {income.map((category) => (
            <CategoryCard
              key={category.key}
              prefabKey={category.key}
              color={category.color}
              selected={state.selectedCategoryKeys.includes(category.key)}
              onToggle={() => toggleCategory(category.key)}
            />
          ))}
        </div>
      </div>
      <div className="prefab-onboarding-section">
        <h3 className="prefab-onboarding-section-title">
          {t("_pages:onboarding.prefabs.categories.expenseTitle")}
        </h3>
        <div className="prefab-onboarding-grid">
          {expense.map((category) => (
            <CategoryCard
              key={category.key}
              prefabKey={category.key}
              color={category.color}
              selected={state.selectedCategoryKeys.includes(category.key)}
              onToggle={() => toggleCategory(category.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryCard(props: {
  prefabKey: string;
  color: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const { prefabKey, color, selected, onToggle } = props;

  return (
    <button
      type="button"
      className={`prefab-onboarding-card ${
        selected ? "prefab-onboarding-card-selected" : ""
      }`}
      aria-pressed={selected}
      onClick={onToggle}
    >
      <span
        className="prefab-onboarding-card-dot"
        style={{ backgroundColor: color }}
      />
      <span className="prefab-onboarding-card-copy">
        <span className="prefab-onboarding-card-title">
          {t(`_pages:onboarding.prefabs.categories.items.${prefabKey}.name`)}
        </span>
      </span>
    </button>
  );
}
