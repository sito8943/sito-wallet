import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  ActionType,
  BaseEntityDto,
  TableSelectionBar,
} from "@sito/dashboard-app";

// icons
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// types
import { MobileSelectionBarPropsType } from "./types";

// constants
import { MOBILE_SELECTION_CANCEL_ACTION_ID } from "./constants";

export function MobileSelectionBar<TRow extends BaseEntityDto>(
  props: MobileSelectionBarPropsType<TRow>,
) {
  const { t } = useTranslation();

  const { count, multiActions, onActionClick, onCancel, className } = props;

  const actions = useMemo<ActionType<TRow>[]>(
    () => [
      ...multiActions,
      {
        id: MOBILE_SELECTION_CANCEL_ACTION_ID,
        tooltip: t("_accessibility:buttons.cancel"),
        icon: <FontAwesomeIcon icon={faXmark} />,
        onClick: () => undefined,
      },
    ],
    [multiActions, t],
  );

  const handleActionClick = useCallback(
    (action: ActionType<TRow>) => {
      if (action.id === MOBILE_SELECTION_CANCEL_ACTION_ID) {
        onCancel();
        return;
      }

      onActionClick(action);
    },
    [onActionClick, onCancel],
  );

  if (!count) return null;

  return (
    <div className={className}>
      <TableSelectionBar
        count={count}
        multiActions={actions}
        onActionClick={handleActionClick}
      />
    </div>
  );
}
