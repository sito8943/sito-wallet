import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Action } from "@sito/dashboard";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

// types
import { UseSingleActionPropTypes } from "hooks";
import { TransactionCategoriesActions } from "../types";

// lib
import { BaseEntityDto } from "lib";

export const useAddTransactionAction = <TRow extends BaseEntityDto>(
  props: UseSingleActionPropTypes<TRow>
) => {
  const { t } = useTranslation();

  const { onClick, hidden = false } = props;

  const action = useCallback(
    (record: TRow): Action<TRow> => ({
      id: TransactionCategoriesActions.AddTransaction,
      hidden: record.deleted || hidden,
      disabled: record.deleted,
      icon: <FontAwesomeIcon className="primary" icon={faAdd} />,
      tooltip: t("_pages:accounts.actions.addTransaction.text"),
      onClick: () => onClick(record),
    }),
    [hidden, onClick, t]
  );

  return {
    action,
  };
};
