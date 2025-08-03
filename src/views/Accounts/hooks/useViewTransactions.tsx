import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

// types
import { UseSingleActionPropTypes } from "hooks";
import { AccountActions } from "../types";

// lib
import { BaseEntityDto } from "lib";
import { getPathByKey, PageId } from "../../sitemap";

export const useViewTransactions = <TRow extends BaseEntityDto>(
  props: Omit<UseSingleActionPropTypes<number>, "onClick">
) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { hidden = false } = props;

  const action = useCallback(
    (record: TRow): Action<TRow> => ({
      id: AccountActions.ViewTransactions,
      hidden: record.deleted || hidden,
      disabled: record.deleted,
      icon: <FontAwesomeIcon className="primary" icon={faClock} />,
      tooltip: t("_pages:common.actions.edit.text"),
      onClick: () => {
        const url = getPathByKey(PageId.Transactions) ?? "";
        navigate(`${url}#${record.id}`);
      },
    }),
    [hidden, navigate, t]
  );

  return {
    action,
  };
};
