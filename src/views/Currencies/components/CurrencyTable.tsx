import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// components
import { WalletTable } from "components";

// lib
import type { ImportPreviewCurrencyDto } from "lib";
import { EntityName, useParseColumns } from "lib";
import type { CurrencyTableProps } from "./types";

import "./styles.css";

export const CurrencyTable = (props: CurrencyTableProps) => {
  const { items } = props;
  const { t } = useTranslation();

  const data = useMemo(() => items ?? [], [items]);

  const renderDescription = (value?: string | null) =>
    value && value.length ? value : t("_entities:base.description.empty");

  const { columns } = useParseColumns<ImportPreviewCurrencyDto>(
    [
      {
        key: "name",
        label: t("_entities:base.name.label"),
        renderBody: (value: unknown, entity: ImportPreviewCurrencyDto) => {
          const parsedValue = typeof value === "string" ? value : "";
          return (
            <div className="currency-table-name-cell">
              <span className="currency-table-name">{parsedValue}</span>
              {entity.symbol && (
                <span className="currency-table-symbol">{entity.symbol}</span>
              )}
            </div>
          );
        },
      },
      {
        key: "symbol",
        renderBody: (value: unknown) =>
          typeof value === "string" && value.length ? value : "—",
      },
      {
        key: "description",
        renderBody: (value: unknown) =>
          renderDescription(typeof value === "string" ? value : null),
      },
      {
        key: "existing",
        label: t("_pages:common.actions.import.previewExisting"),
        renderBody: (value: unknown) =>
          value
            ? t("_accessibility:buttons.yes")
            : t("_accessibility:buttons.no"),
      },
    ],
    EntityName.Currency,
    ["id", "createdAt", "updatedAt", "deletedAt"],
  );

  if (!data.length) return null;

  return (
    <div className="currency-table">
      <p className="currency-table-count">
        {t("_pages:common.actions.import.previewCount", {
          count: data.length,
        })}
      </p>
      <div className="currency-table-shell">
        <WalletTable
          total={data.length}
          data={data}
          entity={EntityName.Currency}
          columns={columns}
          isLoading={false}
          filterOptions={{
            button: {
              hide: true,
            },
          }}
        />
      </div>
    </div>
  );
};
