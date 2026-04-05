import { useTranslation } from "react-i18next";

// components
import { ItemCard, ItemCardTitle } from "components";

// types
import { CurrencyCardPropsType } from "../types";

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
        <div className="flex w-full items-start justify-between gap-2">
          <div className="min-w-0 flex items-baseline gap-1">
            <ItemCardTitle>{name}</ItemCardTitle>
            {hasSymbol ? (
              <span className="text-sm text-text-muted max-xs:hidden">
                ({symbol})
              </span>
            ) : null}
          </div>
          {hasSymbol ? (
            <span className="hidden max-xs:inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-base-light px-2 py-0.5 text-xs text-text-muted">
              {symbol}
            </span>
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
      className="gap-2 max-xs:gap-1"
      containerClassName="max-xs:min-h-0 max-xs:rounded-xl max-xs:p-2.5"
    >
      <p
        className={`${description ? "" : "!text-xs italic"} text-start max-xs:w-full max-xs:overflow-hidden max-xs:text-ellipsis max-xs:whitespace-nowrap max-xs:text-sm max-xs:text-text-muted ${
          deleted ? "!text-bg-error" : ""
        }`}
      >
        {parsedDescription}
      </p>
    </ItemCard>
  );
}
