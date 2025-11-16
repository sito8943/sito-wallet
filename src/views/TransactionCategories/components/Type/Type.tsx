import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// lib
import { TransactionType } from "lib";

// utils
import { icons } from "../../../Transactions/components/utils";

// types
import { TypePropsType } from "./types";

export const Type = (props: TypePropsType) => {
  const { type, noText = false, filled = true, className = "" } = props;

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
      label={
        <div className="flex gap-2 items-center justify-center">
          <FontAwesomeIcon
            className={className}
            icon={icons[(type ?? 0) as keyof typeof icons]}
          />
          {!noText &&
            t(
              `_entities:transactionCategory:type.values.${String(
                TransactionType[type ?? 0]
              )}`
            )}
        </div>
      }
    />
  );
};
