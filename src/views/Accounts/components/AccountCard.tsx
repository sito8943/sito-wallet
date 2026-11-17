import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classNames } from "@sito/dashboard-app";

// @sito/dashboard-app
import { Chip } from "@sito/dashboard-app";

// components
import TypeResume from "./TypeResume";
import { ItemCard, Money } from "components";
import { LastTransactions } from "./LastTransactions";
import { AccountRewardsChip } from "./AccountRewardsChip";

// types
import type { AccountCardPropsType } from "../types";

// lib
import { AccountType, hasRewardsConfigured, supportsBankName } from "lib";

// views

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
    lastTransactions,
    showTypeResume,
    showCurrency = true,
    hideDescription = false,
    swipeDeleteOpen,
    onSwipeDelete,
    rewardsName,
    rewardsBalance,
  } = props;
  const deleted = !!deletedAt;

  // Branded card visual only for Card/Saving accounts that name a known bank.
  const theme =
    supportsBankName(type) && !deleted
      ? getAccountCardTheme(bankName)
      : undefined;

  // Points only for live Card accounts whose rewards are configured; the
  // balance comes with the account list (no request per card).
  const showRewards =
    !deleted && hasRewardsConfigured(props) && rewardsBalance != null;

  return (
    <ItemCard
      title={name}
      deleted={deleted}
      name={t("_pages:accounts.forms.edit")}
      aria-label={t("_pages:accounts.forms.editAria")}
      // Only wire handlers that exist: inside AccountSlider the card is
      // display-only and must not look clickable.
      onClick={id && onClick ? () => onClick(id) : undefined}
      selectionMode={selectionMode}
      selected={selected}
      onToggleSelection={id && onSelect ? () => onSelect(id) : undefined}
      onLongPressSelection={
        id && onLongPress ? () => onLongPress(id) : undefined
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
              "--account-on-brand": theme.text,
              "--account-overlay": theme.overlay,
              "--account-chip-bg": theme.chipBg,
              "--account-chip-text": theme.chipText,
            } as CSSProperties)
          : undefined
      }
    >
      {theme && bankName && (
        <span className="account-card-bank" style={{ color: theme.subtleText }}>
          {bankName}
        </span>
      )}
      {!hideDescription && description ? (
        <p
          className={classNames(
            "account-description",
            deleted && "account-description--deleted",
          )}
        >
          {description}
        </p>
      ) : null}
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
              <Money amount={balance} currency={currency} />
            </>
          }
        />
        {showRewards && (
          <AccountRewardsChip
            balance={rewardsBalance}
            rewardsName={rewardsName}
          />
        )}
      </div>
      {showLastTransactions && !deleted && lastTransactions?.length ? (
        <LastTransactions transactions={lastTransactions} />
      ) : null}
      {showTypeResume && id && currency && (
        <TypeResume accountId={id} currency={currency} />
      )}
    </ItemCard>
  );
}
