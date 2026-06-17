import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Chip, classNames } from "@sito/dashboard-app";

// lib
import { TransactionType } from "lib";

// utils
import { icons } from "../../../Transactions/components/utils";

// types
import type { TypePropsType } from "./types";

import "./styles.css";

export const Type = (props: TypePropsType) => {
  const {
    type,
    noText = false,
    filled = true,
    className = "",
    contentClassName = "",
    iconClassName = "",
    textClassName = "",
  } = props;

  const { t } = useTranslation();

  const chipClassName = useMemo(() => {
    if (filled) return type === TransactionType.In ? "success" : "error";
    return `${
      type === TransactionType.In ? "!text-bg-success" : "!text-bg-error"
    } !p-0 !bg-transparent`;
  }, [filled, type]);

  return (
    <Chip
      className={chipClassName}
      text={
        <div
          className={classNames(
            "transaction-category-type-text",
            contentClassName,
          )}
        >
          <FontAwesomeIcon
            className={classNames(className, iconClassName)}
            icon={icons[(type ?? 0) as keyof typeof icons]}
          />
          {!noText && (
            <span className={textClassName}>
              {t(
                `_entities:transactionCategory:type.values.${String(
                  TransactionType[type ?? 0],
                )}`,
              )}
            </span>
          )}
        </div>
      }
    />
  );
};
