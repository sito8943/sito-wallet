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

  return (
    <ItemCard
      title={name}
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
        {description ? description : t("_entities:base.description.empty")}
      </p>
      <div className="flex gap-2 flex-wrap">
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
