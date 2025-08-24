import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Chip } from "@sito/dashboard";

// lib
import { TransactionType } from "lib";

// utils
import { icons } from "../../../Transactions/components/utils";

// types
import { TypePropsType } from "./types";

export const Type = (props: TypePropsType) => {
  const { type } = props;

  const { t } = useTranslation();

  return (
    <Chip
      className={type === TransactionType.In ? "success" : "error"}
      label={
        <div className="flex gap-2 items-center justify-center">
          <FontAwesomeIcon icon={icons[(type ?? 0) as keyof typeof icons]} />
          {t(
            `_entities:transactionCategory:type.values.${String(
              TransactionType[type ?? 0]
            )}`
          )}
        </div>
      }
    />
  );
};
