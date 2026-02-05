import { useMemo } from "react";
import { t } from "i18next";

// @sito/dashboard-app
import { BaseEntityDto, ColumnType, FilterTypes } from "@sito/dashboard-app";

// lib
import { EntityName } from "lib";

export const baseColumns = ["id", "createdAt", "updatedAt", "deletedAt"];

/**
 *
 * @param {string} column - column to evaluate
 * @returns true is the column is a base column
 */
export const isBaseColumn = (column: string) => baseColumns.includes(column);

/**
 *
 * @returns array of prefab
 */
export const prefabBaseColumns = <
  TDto extends BaseEntityDto
>(): ColumnType<TDto>[] => [
  {
    key: "id",
    filterOptions: { type: FilterTypes.number, defaultValue: "" },
    pos: 1,
  },
  {
    key: "updatedAt",
    className: "w-56",
    filterOptions: { type: FilterTypes.date, defaultValue: "" },
    renderBody: (updatedAt: string) =>
      new Date(updatedAt).toLocaleDateString(navigator.language || "es-ES"),
    pos: -1,
  },
  {
    key: "createdAt",
    filterOptions: { type: FilterTypes.date, defaultValue: "" },
    renderBody: (createdAt: string) =>
      new Date(createdAt).toLocaleDateString(navigator.language || "es-ES"),
    pos: -2,
  },
  {
    key: "deletedAt",
    filterOptions: {
      defaultValue: false,
      type: FilterTypes.check,
      label: t("_entities:base.deleted.filter"),
    },
    display: "none",
    renderBody: (deletedAt: string | null) =>
      deletedAt
        ? t("_accessibility:buttons.yes")
        : t("_accessibility:buttons.no"),
    pos: -3,
  },
];

/**
 *
 * @param {object[]} columns - columns to parse
 * @param {string} entity - entity to evaluate
 * @param {string[]} toIgnore - base columns to ignore
 * @returns parsed columns
 */
export const useParseColumns = <TDto extends BaseEntityDto>(
  columns: ColumnType<TDto>[],
  entity: EntityName,
  toIgnore: string[] = []
) => {
  const parsedColumns = useMemo(
    () =>
      [
        ...prefabBaseColumns().filter(
          (base) => toIgnore.indexOf(base.key) === -1
        ),
        ...columns,
      ].map(({ key, renderBody, label, pos, ...rest }) => {
        return {
          key,
          label:
            label ??
            t(
              `_entities:${isBaseColumn(key as string) ? "base" : entity}.${
                key as string
              }.label`
            ),
          renderBody,
          pos: pos ?? 0,
          ...rest,
        };
      }),
    [columns, entity, toIgnore]
  );

  return { columns: parsedColumns };
};
