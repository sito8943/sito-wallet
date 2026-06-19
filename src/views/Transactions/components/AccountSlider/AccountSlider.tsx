import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { IconButton, classNames } from "@sito/dashboard-app";

// icons
import { faFilter } from "@fortawesome/free-solid-svg-icons";

// components
import { AccountCard } from "views/Accounts";
import { Currency } from "views/Currencies/components/Currency";

// constants
import { SLIDE_GAP } from "./constants";

// hooks
import { useAccountSlider } from "./useAccountSlider";

// types
import type { AccountSliderPropsType } from "./types";

import "./styles.css";

export function AccountSlider(props: AccountSliderPropsType) {
  const {
    className,
    accounts,
    selectedAccount,
    onAccountChange,
    getActions,
    onOpenFilters,
  } = props;
  const { t } = useTranslation();

  const activeIndex = useMemo(() => {
    const index = accounts.findIndex(
      (account) => account.id === selectedAccount?.id,
    );
    return index < 0 ? 0 : index;
  }, [accounts, selectedAccount]);
  const activeAccount = selectedAccount ?? accounts[activeIndex] ?? null;

  const goTo = useCallback(
    (index: number) => {
      const account = accounts[index];
      if (account?.id != null && account.id !== selectedAccount?.id) {
        onAccountChange(account.id);
      }
    },
    [accounts, onAccountChange, selectedAccount],
  );

  const {
    viewportRef,
    stickyTriggerRef,
    bind,
    slideWidth,
    translateX,
    dragging,
    showSticky,
    consumeMoved,
  } = useAccountSlider({
    count: accounts.length,
    activeIndex,
    onIndexChange: goTo,
  });

  const renderDots = () =>
    accounts.length > 1 && (
      <div className="account-slider-dots" role="tablist">
        {accounts.map((account, index) => (
          <button
            key={account.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={account.name}
            className={classNames(
              "account-slider-dot",
              index === activeIndex && "account-slider-dot--active",
            )}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    );

  return (
    <div className={classNames("account-slider", className)}>
      <div ref={viewportRef} className="account-slider-viewport" {...bind()}>
        <div
          className={classNames(
            "account-slider-track",
            dragging && "account-slider-track--dragging",
          )}
          style={{
            transform: `translate3d(${translateX}px, 0, 0)`,
            gap: SLIDE_GAP,
          }}
        >
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className={classNames(
                "account-slider-slide",
                index === activeIndex && "account-slider-slide--active",
              )}
              style={{ width: slideWidth || undefined }}
              onClick={() => {
                if (consumeMoved()) return;
                if (index !== activeIndex) goTo(index);
              }}
            >
              <AccountCard
                {...account}
                actions={getActions(account)}
                showCurrency={false}
                hideDescription
                containerClassName="account-slider-card"
              />
            </div>
          ))}
        </div>
      </div>
      <div
        ref={stickyTriggerRef}
        className="account-slider-sticky-trigger"
        aria-hidden="true"
      />

      <div className="account-slider-toolbar">
        {!showSticky && renderDots()}
        {onOpenFilters && (
          <IconButton
            icon={faFilter}
            onClick={onOpenFilters}
            name={t("_accessibility:buttons.filters")}
            aria-label={t("_accessibility:ariaLabels.filters")}
            className="account-slider-filter"
          />
        )}
      </div>

      {showSticky && activeAccount && (
        <div
          className={classNames(
            "account-slider-sticky",
            dragging && "account-slider-sticky--dragging",
          )}
          {...bind()}
        >
          <div className="account-slider-sticky-summary">
            <p className="account-slider-sticky-meta">
              <span className="account-slider-sticky-name">
                {activeAccount.name}
              </span>
              {activeAccount.currency && (
                <>
                  <span aria-hidden="true">-</span>
                  <span>{activeAccount.currency.name}</span>
                  <span aria-hidden="true">-</span>
                  <Currency
                    name={activeAccount.currency.name}
                    symbol={activeAccount.currency.symbol}
                  />
                </>
              )}
            </p>
            <p className="account-slider-sticky-balance">
              {activeAccount.balance}{" "}
              <Currency
                name={activeAccount.currency?.name}
                symbol={activeAccount.currency?.symbol}
              />
            </p>
          </div>
          {renderDots()}
        </div>
      )}
    </div>
  );
}
