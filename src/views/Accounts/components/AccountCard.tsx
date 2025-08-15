import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Chip } from "@sito/dashboard";

// components
import { ItemCard } from "components";

// types
import { AccountCardPropsType } from "../types";

// lib
import { AccountType } from "lib";

// views
import { Currency } from "views";

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
    balance,
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
        {description ? description : t("_entities:base.description.empty")}
      </p>
      <div className="chip-container">
        <Chip
          label={t(
            `_entities:account.type.values.${String(AccountType[type])}`
          )}
        />
        <Chip label={currency?.name} />
        <Chip
          label={
            <>
              {`${t("_entities:account.balance.label")}: ${balance}`}{" "}
              <Currency name={currency?.name} symbol={currency?.symbol} />
            </>
          }
        />
      </div>
    </ItemCard>
  );
}
