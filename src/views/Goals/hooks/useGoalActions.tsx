import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { ActionType } from "@sito/dashboard-app";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheckCircle,
  faPencil,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

// lib
import type { GoalDto } from "lib";
import { GoalStatus } from "lib";

// types
import { GoalAction } from "../types";
import type { UseGoalActionsProps } from "../types";

/** Edit and status actions of a goal card (delete/restore come from the lib). */
export function useGoalActions(props: UseGoalActionsProps) {
  const { onEdit, onComplete, onCancel, onReopen, busy = false } = props;
  const { t } = useTranslation();

  return useCallback(
    (record: GoalDto): ActionType<GoalDto>[] => {
      const deleted = !!record.deletedAt;
      const active = record.status === GoalStatus.Active;

      return [
        {
          id: GoalAction.Edit,
          hidden: deleted,
          icon: <FontAwesomeIcon icon={faPencil} />,
          tooltip: t("_pages:goals.actions.edit.text"),
          onClick: () => onEdit(record.id),
        },
        {
          id: GoalAction.Complete,
          hidden: deleted || !active,
          disabled: busy,
          icon: <FontAwesomeIcon icon={faCheckCircle} />,
          tooltip: t("_pages:goals.actions.complete.text"),
          onClick: () => onComplete(record.id),
        },
        {
          id: GoalAction.Cancel,
          hidden: deleted || !active,
          disabled: busy,
          icon: <FontAwesomeIcon icon={faBan} />,
          tooltip: t("_pages:goals.actions.cancel.text"),
          onClick: () => onCancel(record.id),
        },
        {
          id: GoalAction.Reopen,
          hidden: deleted || active,
          disabled: busy,
          icon: <FontAwesomeIcon icon={faRotateLeft} />,
          tooltip: t("_pages:goals.actions.reopen.text"),
          onClick: () => onReopen(record.id),
        },
      ];
    },
    [busy, onCancel, onComplete, onEdit, onReopen, t],
  );
}
