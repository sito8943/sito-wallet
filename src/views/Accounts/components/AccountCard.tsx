import { useTranslation } from "react-i18next";

// components
import { ItemCard } from "components";

// types
import { AccountCardPropsType } from "../types";
import { Chip } from "@sito/dashboard";
import { AccountType } from "lib";

export function AccountCard(props: AccountCardPropsType) {
  const { t } = useTranslation();

  const {
    id,
    onClick,
    actions,
    name,
    description,
    type,
    currency,
    deleted,
    amount,
  } = props;

  return (
    <ItemCard
      title={name}
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
        {description ? description : t("_entities:account.description.empty")}
      </p>
      <div className="flex gap-2">
        <Chip label={String(AccountType[type])} />
        <Chip label={currency?.name} />
        <Chip label={`${t("_entities:account.balance.label")}: ${amount}`} />
      </div>
    </ItemCard>
  );
}
