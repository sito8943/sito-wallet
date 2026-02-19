import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// components
import { WalletTable } from "components";

// lib
import {
  EntityName,
  ImportPreviewCurrencyDto,
  useParseColumns,
} from "lib";

type CurrencyTableProps = {
  items?: ImportPreviewCurrencyDto[] | null;
};

export const CurrencyTable = (props: CurrencyTableProps) => {
  const { items } = props;
  const { t } = useTranslation();

  const data = useMemo(() => items ?? [], [items]);

  const renderDescription = (value?: string | null) =>
    value && value.length
      ? value
      : t("_entities:base.description.empty", {
          defaultValue: "No description",
        });

  const { columns } = useParseColumns<ImportPreviewCurrencyDto>(
    [
      {
        key: "name",
        renderBody: (value: unknown, entity: ImportPreviewCurrencyDto) => {
          const parsedValue = typeof value === "string" ? value : "";
          return (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{parsedValue}</span>
              {entity.symbol && (
                <span className="text-xs text-gray-500">{entity.symbol}</span>
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
        label: t("_pages:common.actions.import.previewExisting", {
          defaultValue: "Already exists",
        }),
        renderBody: (value: unknown) =>
          value
            ? t("_accessibility:buttons.yes")
            : t("_accessibility:buttons.no"),
      },
    ],
    EntityName.Currency,
    ["id", "createdAt", "updatedAt", "deletedAt"]
  );

  if (!data.length) return null;

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600">
        {t("_pages:common.actions.import.previewCount", {
          count: data.length,
          defaultValue: `Preview: ${data.length} items`,
        })}
      </p>
      <div className="mt-2 rounded border border-gray-200">
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
