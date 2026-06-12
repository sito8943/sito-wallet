import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classNames } from "@sito/dashboard-app";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// components
import TypeResume from "./TypeResume";
import { ItemCard } from "components";
import { LastTransactions } from "./LastTransactions";

// types
import type { AccountCardPropsType } from "../types";

// lib
import { AccountType } from "lib";

// views
import { Currency } from "views/Currencies/components/Currency";

// utils
import { icons, getAccountCardTheme } from "./utils";

import "./styles.css";

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
    bankName,
    currency,
    deletedAt,
    balance,
    containerClassName,
    showLastTransactions,
    showTypeResume,
    showCurrency = true,
    hideDescription = false,
    swipeDeleteOpen,
    onSwipeDelete,
  } = props;
  const deleted = !!deletedAt;

  // Branded card visual only for Card-type accounts that name a known bank.
  const theme =
    type === AccountType.Card && !deleted
      ? getAccountCardTheme(bankName)
      : undefined;

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
      swipeDeleteOpen={swipeDeleteOpen}
      onSwipeDelete={onSwipeDelete}
      containerClassName={classNames(
        containerClassName ?? "account-card-container",
        theme && "account-card--branded",
      )}
      containerStyle={
        theme
          ? ({
              background: theme.background,
              color: theme.text,
              borderColor: "transparent",
              "--account-on-brand": theme.text,
              "--account-overlay": theme.overlay,
              "--account-chip-bg": theme.chipBg,
              "--account-chip-text": theme.chipText,
            } as CSSProperties)
          : undefined
      }
    >
      {theme && bankName && (
        <span
          className="account-card-bank"
          style={{ color: theme.subtleText }}
        >
          {bankName}
        </span>
      )}
      {!hideDescription && (
        <p
          className={classNames(
            "account-description",
            !description && "account-description--empty",
            deleted && "account-description--deleted",
          )}
        >
          {description ? description : t("_entities:base.description.empty")}
        </p>
      )}
      <div className="chip-container">
        <Chip
          className="account-card-type-chip"
          text={
            <>
              <span className="account-card-type-text">
                {t(
                  `_entities:account.type.values.${String(AccountType[type])}`,
                )}
              </span>
              <span className="account-card-type-icon">
                <FontAwesomeIcon icon={icons[type]} />
              </span>
            </>
          }
        />
        {showCurrency && (
          <Chip
            className="account-card-currency-chip"
            text={
              <>
                <span className="account-card-currency-name">
                  {currency?.name}
                </span>
                <span className="account-card-currency-symbol">
                  {currency?.symbol}
                </span>
              </>
            }
          />
        )}
        <Chip
          text={
            <>
              <span className="account-card-balance-label">{`${t("_entities:account.balance.label")}: `}</span>
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
