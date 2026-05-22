import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Loading, useNotification } from "@sito/dashboard-app";

import { useManager } from "providers";
import type { AddTransactionCategoryDto } from "lib";
import { TransactionType } from "lib";

import { PREFAB_CATEGORIES } from "./constants";
import { toggleInArray } from "./utils";
import type { PrefabSuggestionPropsType } from "./types";

import "./styles.css";

export function PrefabCategorySuggestions(props: PrefabSuggestionPropsType) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification } = useNotification();

  const [selected, setSelected] = useState<string[]>(() =>
    PREFAB_CATEGORIES.map((c) => c.key),
  );
  const [submitting, setSubmitting] = useState(false);

  const handleToggle = useCallback((key: string) => {
    setSelected((prev) => toggleInArray(prev, key));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (selected.length === 0) return;

    setSubmitting(true);
    const payload: AddTransactionCategoryDto[] = selected
      .map((key) => {
        const prefab = PREFAB_CATEGORIES.find((c) => c.key === key);
        if (!prefab) return null;
        return {
          name: t(`_pages:prefabs.categories.items.${key}.name`),
          description: "",
          color: prefab.color,
          userId: 0,
          type:
            prefab.type === "income" ? TransactionType.In : TransactionType.Out,
        };
      })
      .filter((v): v is AddTransactionCategoryDto => v !== null);

    try {
      await manager.TransactionCategories.insertMany(payload);
      onComplete?.();
    } catch {
      showErrorNotification({ message: t("_accessibility:errors.500") });
    } finally {
      setSubmitting(false);
    }
  }, [
    manager.TransactionCategories,
    onComplete,
    selected,
    showErrorNotification,
    t,
  ]);

  const income = PREFAB_CATEGORIES.filter((c) => c.type === "income");
  const expense = PREFAB_CATEGORIES.filter((c) => c.type === "expense");

  return (
    <div className="prefab-suggestions">
      <PrefabCategorySection
        title={t("_pages:prefabs.categories.incomeTitle")}
        items={income}
        selected={selected}
        onToggle={handleToggle}
      />
      <PrefabCategorySection
        title={t("_pages:prefabs.categories.expenseTitle")}
        items={expense}
        selected={selected}
        onToggle={handleToggle}
      />
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

function PrefabCategorySection(props: {
  title: string;
  items: { key: string; color: string }[];
  selected: string[];
  onToggle: (key: string) => void;
}) {
  const { t } = useTranslation();
  const { title, items, selected, onToggle } = props;

  return (
    <div className="prefab-suggestions-section">
      <h3 className="prefab-suggestions-section-title">{title}</h3>
      <div className="prefab-suggestions-grid">
        {items.map((item) => {
          const isSelected = selected.includes(item.key);
          return (
            <button
              key={item.key}
              type="button"
              className={`prefab-suggestions-card ${
                isSelected ? "prefab-suggestions-card-selected" : ""
              }`}
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
