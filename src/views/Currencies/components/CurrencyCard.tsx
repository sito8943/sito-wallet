import { useTranslation } from "react-i18next";

// components
import { ItemCard } from "components";

// types
import { CurrencyCardPropsType } from "../types";

export function CurrencyCard(props: CurrencyCardPropsType) {
  const { t } = useTranslation();

  const { id, onClick, actions, name, description, deleted } = props;

  return (
    <ItemCard
      title={name}
      deleted={deleted}
      name={t("_pages:currencies.forms.edit")}
      aria-label={t("_pages:currencies.forms.editAria")}
      onClick={() => (!deleted ? onClick(id) : {})}
      actions={actions}
    >
      <p
        className={`${description ? "" : "!text-xs italic"} text-start ${
          deleted ? "!text-secondary" : ""
        }`}
      >
        {description ? description : t("_entities:account.description.empty")}
      </p>
    </ItemCard>
  );
}
