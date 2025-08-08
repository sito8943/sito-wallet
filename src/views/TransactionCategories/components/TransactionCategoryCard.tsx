import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard
import { Chip } from "@sito/dashboard";

// components
import { ItemCard } from "components";

// types
import { TransactionCategoryCardPropsType } from "../types";

// lib
import { TransactionType } from "lib";

// utils
import { icons } from "../../Transactions/components/utils";

export function TransactionCategoryCard(
  props: TransactionCategoryCardPropsType
) {
  const { t } = useTranslation();

  const { id, onClick, actions, name, description, type, deleted } = props;

  const parsedDescription = useMemo(() => {
    if (!description?.length) return t("_entities:base.description.empty");
    if (description === "init")
      return t("_entities:transactionCategory.description.init");
    return description;
  }, [description, t]);

  return (
    <ItemCard
      title={
        name === "init" ? t("_entities:transactionCategory.name.init") : name
      }
      deleted={deleted}
      name={t("_pages:transactionCategory.forms.edit")}
      aria-label={t("_pages:transactionCategory.forms.editAria")}
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
          className={type === TransactionType.In ? "success" : "error"}
          label={
            <div className="flex gap-2 items-center justify-center">
              <FontAwesomeIcon
                icon={icons[(type ?? 0) as keyof typeof icons]}
              />
              {t(
                `_entities:transactionCategory.type.values.${String(
                  TransactionType[type]
                )}`
              )}
            </div>
          }
        />
      </div>
    </ItemCard>
  );
}
