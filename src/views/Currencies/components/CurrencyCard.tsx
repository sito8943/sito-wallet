import { useTranslation } from "react-i18next";

// components
import { ItemCard } from "components";

// types
import { CurrencyCardPropsType } from "../types";

export function CurrencyCard(props: CurrencyCardPropsType) {
  const { t } = useTranslation();

  const { id, onClick, actions, name, description, symbol, deletedAt } = props;
  const deleted = !!deletedAt;

  return (
    <ItemCard
      title={`${name} ${symbol?.length ? `(${symbol})` : ""}`}
      deleted={deleted}
      name={t("_pages:currencies.forms.edit")}
      aria-label={t("_pages:currencies.forms.editAria")}
      onClick={() => (!deleted ? onClick(id) : {})}
      actions={actions}
    >
      <p
        className={`${description ? "" : "!text-xs italic"} text-start ${
          deleted ? "!text-bg-error" : ""
        }`}
      >
        {description ? description : t("_entities:base.description.empty")}
      </p>
    </ItemCard>
  );
}
