import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// components
import TypeResume from "./TypeResume";
import { ItemCard } from "components";
import { LastTransactions } from "./LastTransactions";

// types
import { AccountCardPropsType } from "../types";

// lib
import { AccountType } from "lib";

// views
import { Currency } from "views/Currencies/components/Currency";

// utils
import { icons } from "./utils";

export function AccountCard(props: AccountCardPropsType) {
  const { t } = useTranslation();

  const {
    id,
    onClick,
    onSelect,
    onLongPress,
    selectionMode,
    selected,
    actions,
    name,
    description,
    type = AccountType.Card,
    currency,
    deletedAt,
    balance,
    containerClassName,
    showLastTransactions,
    showTypeResume,
    showCurrency = true,
    hideDescription = false,
  } = props;
  const deleted = !!deletedAt;

  return (
    <ItemCard
      title={name}
      deleted={deleted}
      name={t("_pages:accounts.forms.edit")}
      aria-label={t("_pages:accounts.forms.editAria")}
      onClick={() => {
        if (!id) return;
        onClick?.(id);
      }}
      selectionMode={selectionMode}
      selected={selected}
      onToggleSelection={
        id
          ? () => {
              onSelect?.(id);
            }
          : undefined
      }
      onLongPressSelection={
        id
          ? () => {
              onLongPress?.(id);
            }
          : undefined
      }
      actions={actions}
      containerClassName={containerClassName ?? "md:w-100 max-md:w-full"}
    >
      {!hideDescription && (
        <p
          className={`${description ? "" : "!text-xs italic"} text-start mb-2 ${
            deleted ? "!text-bg-error" : ""
          }`}
        >
          {description ? description : t("_entities:base.description.empty")}
        </p>
      )}
      <div className="chip-container">
        <Chip
          className="max-sm:!px-2"
          text={
            <>
              <span className="max-sm:hidden">
                {t(
                  `_entities:account.type.values.${String(AccountType[type])}`,
                )}
              </span>
              <span className="sm:hidden">
                <FontAwesomeIcon icon={icons[type]} />
              </span>
            </>
          }
        />
        {showCurrency && (
          <Chip
            className="max-sm:!px-3"
            text={
              <>
                <span className="max-sm:hidden">{currency?.name}</span>
                <span className="sm:hidden">{currency?.symbol}</span>
              </>
            }
          />
        )}
        <Chip
          text={
            <>
              <span className="max-sm:hidden">{`${t("_entities:account.balance.label")}: `}</span>
              <span>{balance} </span>
              <Currency name={currency?.name} symbol={currency?.symbol} />
            </>
          }
        />
      </div>
      {showLastTransactions && id && currency && (
        <LastTransactions accountId={id} currency={currency} />
      )}
      {showTypeResume && id && currency && (
        <TypeResume accountId={id} currency={currency} />
      )}
    </ItemCard>
  );
}
