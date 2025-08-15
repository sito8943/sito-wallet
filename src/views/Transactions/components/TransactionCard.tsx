import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// utils
import { icons } from "./utils";

// components
import { ItemCard } from "components";

// types
import { TransactionCardPropsType } from "../types";
import { Chip } from "@sito/dashboard";

// lib
import { TransactionType } from "lib";

// hooks
import { useTimeAge } from "hooks";
import { Currency } from "views";

export function TransactionCard(props: TransactionCardPropsType) {
  const { t } = useTranslation();

  const {
    id,
    onClick,
    actions,
    description,
    date,
    type,
    amount,
    category,
    account,
    deleted,
  } = props;

  const { timeAge } = useTimeAge();

  const parsedDescription = useMemo(() => {
    if (!description?.length) return t("_entities:base.description.empty");
    if (description === "init")
      return t("_entities:transactionCategory.description.init");
    return description;
  }, [description, t]);

  return (
    <ItemCard
      title={
        category?.name === "init"
          ? t("_entities:transactionCategory.name.init")
          : category?.name
      }
      deleted={deleted}
      name={t("_pages:accounts.forms.edit")}
      aria-label={t("_pages:accounts.forms.editAria")}
      onClick={() => (!deleted ? onClick(id) : {})}
      actions={actions}
    >
      <p
        className={`${description ? "" : "!text-xs italic"} text-start mb-2 ${
          deleted ? "!text-secondary" : ""
        }`}
      >
        {parsedDescription}
      </p>
      <div className="chip-container">
        <Chip
          className={
            category?.type === TransactionType.In ? "success" : "error"
          }
          label={
            <div className="flex gap-2 items-center justify-center">
              <FontAwesomeIcon
                icon={icons[(type ?? 0) as keyof typeof icons]}
              />
              {t(
                `_entities:transactionCategory.type.values.${String(
                  TransactionType[category?.type ?? 0]
                )}`
              )}
            </div>
          }
        />
        <Chip
          label={
            <>
              {amount}{" "}
              <Currency
                name={account?.currency?.name}
                symbol={account?.currency?.symbol}
              />
            </>
          }
        />
        <Chip label={timeAge(new Date(date))} />
      </div>
    </ItemCard>
  );
}
