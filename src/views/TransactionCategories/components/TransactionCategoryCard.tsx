import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Chip } from "@sito/dashboard";

// components
import { ItemCard } from "components";

// types
import { TransactionCategoryCardPropsType } from "../types";

// lib
import { TransactionType } from "lib";

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
        {description ? description : t("_entities:account.description.empty")}
      </p>
      <div className="flex gap-2 flex-wrap">
        <Chip
          label={t(
            `_entities:transactionCategory.type.values.${String(TransactionType[type])}`
          )}
        />
      </div>
    </ItemCard>
  );
}
