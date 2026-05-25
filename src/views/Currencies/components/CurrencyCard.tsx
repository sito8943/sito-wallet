import { useTranslation } from "react-i18next";
import { classNames } from "@sito/dashboard-app";

// components
import { ItemCard, ItemCardTitle } from "components";

// types
import type { CurrencyCardPropsType } from "../types";

import "./styles.css";

export function CurrencyCard(props: CurrencyCardPropsType) {
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
    symbol,
    deletedAt,
  } = props;
  const deleted = !!deletedAt;
  const parsedDescription =
    description || t("_entities:base.description.empty");
  const hasSymbol = !!symbol?.length;

  return (
    <ItemCard
      title={
        <div className="currency-card-title-row">
          <div className="currency-card-title-main">
            <ItemCardTitle>{name}</ItemCardTitle>
            {hasSymbol ? (
              <span className="currency-card-symbol-inline">({symbol})</span>
            ) : null}
          </div>
          {hasSymbol ? (
            <span className="currency-card-symbol-badge">{symbol}</span>
          ) : null}
        </div>
      }
      deleted={deleted}
      name={t("_pages:currencies.forms.edit")}
      aria-label={t("_pages:currencies.forms.editAria")}
      onClick={() => onClick(id)}
      selectionMode={selectionMode}
      selected={selected}
      onToggleSelection={() => onSelect?.(id)}
      onLongPressSelection={() => onLongPress?.(id)}
      actions={actions}
      className="currency-card-content"
      containerClassName="currency-card-container"
    >
      <p
        className={classNames(
          "currency-card-description",
          !description && "currency-card-description--empty",
          deleted && "currency-card-description--deleted",
        )}
      >
        {parsedDescription}
      </p>
    </ItemCard>
  );
}
