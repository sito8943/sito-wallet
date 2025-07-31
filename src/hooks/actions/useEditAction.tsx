import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

// types
import { GlobalActions, UseSingleActionPropTypes } from "hooks";

// lib
import { BaseEntityDto } from "lib";

export const useEditAction = <TRow extends BaseEntityDto>(
  props: UseSingleActionPropTypes<number>
) => {
  const { t } = useTranslation();

  const { onClick, hidden = false } = props;

  const action = useCallback(
    (record: TRow): Action<TRow> => ({
      id: GlobalActions.Edit,
      hidden: record.deleted || hidden,
      disabled: record.deleted,
      icon: <FontAwesomeIcon className="primary" icon={faPencil} />,
      tooltip: t("_pages:common.actions.edit.text"),
      onClick: () => onClick(record?.id),
    }),
    [hidden, onClick, t]
  );

  return {
    action,
  };
};
