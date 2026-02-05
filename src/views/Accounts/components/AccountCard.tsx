import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// components
import { ItemCard } from "components";
import { LastTransactions } from "./LastTransactions";

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
    deletedAt,
    balance,
  } = props;
  const deleted = !!deletedAt;

  return (
    <ItemCard
      title={name}
      deleted={deleted}
      name={t("_pages:accounts.forms.edit")}
      aria-label={t("_pages:accounts.forms.editAria")}
      onClick={() => (!deleted ? onClick(id) : {})}
      actions={actions}
      containerClassName="w-100"
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
          text={t(`_entities:account.type.values.${String(AccountType[type])}`)}
        />
        <Chip text={currency?.name} />
        <Chip
          text={
            <>
              {`${t("_entities:account.balance.label")}: ${balance}`}{" "}
              <Currency name={currency?.name} symbol={currency?.symbol} />
            </>
          }
        />
      </div>
      <LastTransactions accountId={id} currency={currency} />
    </ItemCard>
  );
}
