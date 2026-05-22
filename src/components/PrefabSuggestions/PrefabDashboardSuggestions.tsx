import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Loading, useNotification } from "@sito/dashboard-app";

import { useManager } from "providers";

import { CARD_LABEL_BY_TYPE, PREFAB_DASHBOARD } from "./constants";
import type { PrefabSuggestionPropsType } from "./types";

import "./styles.css";

export function PrefabDashboardSuggestions(props: PrefabSuggestionPropsType) {
  const { onComplete } = props;
  const { t } = useTranslation();
  const manager = useManager();
  const { showErrorNotification } = useNotification();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    const payload = PREFAB_DASHBOARD.cards.map((card) => ({
      type: card.type,
      config: JSON.stringify({ size: card.size }),
      position: card.position,
      userId: 0,
    }));

    try {
      await manager.Dashboard.insertMany(payload);
      onComplete?.();
    } catch {
      showErrorNotification({ message: t("_accessibility:errors.500") });
    } finally {
      setSubmitting(false);
    }
  }, [manager.Dashboard, onComplete, showErrorNotification, t]);

  return (
    <div className="prefab-suggestions">
      <p className="prefab-suggestions-hint">
        {t("_pages:prefabs.dashboard.hint")}
      </p>
      <div className="prefab-suggestions-dashboard-preview">
        {PREFAB_DASHBOARD.cards.map((card) => (
          <div
            key={`${card.type}-${card.position}`}
            className={`prefab-suggestions-dashboard-card prefab-suggestions-dashboard-card-${card.size}`}
          >
            <span className="prefab-suggestions-card-title">
              {t(CARD_LABEL_BY_TYPE[card.type] ?? "")}
            </span>
            <span className="prefab-suggestions-card-description">
              {t("_pages:prefabs.dashboard.sizeLabel", { size: card.size })}
            </span>
          </div>
        ))}
      </div>
      <div className="prefab-suggestions-actions">
        <Button
          color="primary"
          variant="submit"
          disabled={submitting}
          onClick={() => void handleSubmit()}
        >
          {submitting ? <Loading /> : t("_pages:prefabs.dashboard.apply")}
        </Button>
      </div>
    </div>
  );
}
