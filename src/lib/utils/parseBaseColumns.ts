import { useMemo } from "react";
import { t } from "i18next";

// @sito/dashboard-app
import type { BaseEntityDto, ColumnType } from "@sito/dashboard-app";
import { FilterTypes } from "@sito/dashboard-app";

// lib
import type { EntityName } from "lib";

export const baseColumns = [
  "id",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "softDeleteScope",
];

/**
 *
 * @param {string} column - column to evaluate
 * @returns true is the column is a base column
 */
export const isBaseColumn = (column: string) => baseColumns.includes(column);

const toColumnKey = <TDto extends BaseEntityDto>(
  key: string,
): Extract<keyof TDto, string> => key as Extract<keyof TDto, string>;

const softDeleteScopeFilterOptions = () => [
  {
    id: "ACTIVE",
    name: t("_entities:base.deleted.scope.values.active"),
  },
  {
    id: "DELETED",
    name: t("_entities:base.deleted.scope.values.deleted"),
  },
  {
    id: "ALL",
    name: t("_entities:base.deleted.scope.values.all"),
  },
];

/**
 *
 * @returns array of prefab
 */
export const prefabBaseColumns = <
  TDto extends BaseEntityDto,
>(): ColumnType<TDto>[] => [
  {
    key: toColumnKey<TDto>("id"),
    filterOptions: { type: FilterTypes.number, defaultValue: "" },
    pos: 1,
  },
  {
    key: toColumnKey<TDto>("updatedAt"),
    className: "w-56",
    filterOptions: { type: FilterTypes.date, defaultValue: "" },
    renderBody: (value: unknown) => {
      const dateValue = value instanceof Date ? value : new Date(String(value));
      return Number.isNaN(dateValue.getTime())
        ? ""
        : dateValue.toLocaleDateString(navigator.language || "es-ES");
    },
    pos: -1,
  },
  {
    key: toColumnKey<TDto>("createdAt"),
    filterOptions: { type: FilterTypes.date, defaultValue: "" },
    renderBody: (value: unknown) => {
      const dateValue = value instanceof Date ? value : new Date(String(value));
      return Number.isNaN(dateValue.getTime())
        ? ""
        : dateValue.toLocaleDateString(navigator.language || "es-ES");
    },
    pos: -2,
  },
  {
    key: toColumnKey<TDto>("softDeleteScope"),
    label: t("_entities:base.deleted.scope.label"),
    filterOptions: {
      defaultValue: "ACTIVE",
      type: FilterTypes.select,
      options: softDeleteScopeFilterOptions(),
      label: t("_entities:base.deleted.scope.label"),
    },
    display: "none",
    renderBody: () => "",
    pos: -3,
  },
  {
    key: toColumnKey<TDto>("deletedAt"),
    filterOptions: {
      defaultValue: { start: "", end: "" },
      type: FilterTypes.date,
      label: t("_entities:base.deleted.range"),
    },
    display: "none",
    renderBody: (value: unknown) => {
      const dateValue = value instanceof Date ? value : new Date(String(value));
      return Number.isNaN(dateValue.getTime())
        ? ""
        : dateValue.toLocaleDateString(navigator.language || "es-ES");
    },
    pos: -4,
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
  toIgnore: string[] = [],
) => {
  const parsedColumns = useMemo(
    () =>
      [
        ...prefabBaseColumns<TDto>().filter(
          (base) => toIgnore.indexOf(base.key) === -1,
        ),
        ...columns,
      ].map(({ key, renderBody, label, pos, ...rest }) => {
        return {
          key,
          label:
            label ??
            t(`_entities:${isBaseColumn(key) ? "base" : entity}.${key}.label`),
          renderBody,
          pos: pos ?? 0,
          ...rest,
        };
      }),
    [columns, entity, toIgnore],
  );

  return { columns: parsedColumns };
};
