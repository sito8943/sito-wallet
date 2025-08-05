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
import { TransactionCategoriesActions } from "../types";

// lib
import { BaseEntityDto } from "lib";

// sitemap
import { getPathByKey, PageId } from "../../sitemap";

export const useViewTransactionsAction = <TRow extends BaseEntityDto>(
  props: Omit<UseSingleActionPropTypes<number>, "onClick">
) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { hidden = false } = props;

  const action = useCallback(
    (record: TRow): Action<TRow> => ({
      id: TransactionCategoriesActions.ViewTransactions,
      hidden: record.deleted || hidden,
      disabled: record.deleted,
      icon: <FontAwesomeIcon className="text-bg-primary" icon={faClock} />,
      tooltip: t("_pages:accounts.actions.viewTransactions.text"),
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
