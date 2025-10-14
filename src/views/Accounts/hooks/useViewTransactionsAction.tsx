import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

// types
import { UseSingleActionPropTypes } from "@sito/dashboard-app";
import { AccountActions } from "../types";

// lib
import { AccountDto } from "lib";

// sitemap
import { getPathByKey, PageId } from "../../sitemap";

export const useViewTransactionsAction = (
  props: Omit<UseSingleActionPropTypes<number>, "onClick">
) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { hidden = false } = props;

  const action = useCallback(
    (record: AccountDto): Action<AccountDto> => ({
      id: AccountActions.ViewTransactions,
      hidden: record.deleted || hidden,
      disabled: record.deleted,
      icon: <FontAwesomeIcon className="text-bg-primary" icon={faClock} />,
      tooltip: t("_pages:accounts.actions.viewTransactions.text"),
      onClick: () => {
        const url = getPathByKey(PageId.Transactions) ?? "";
        navigate(`${url}?accountId=${record.id}`);
      },
    }),
    [hidden, navigate, t]
  );

  return {
    action,
  };
};
