import { Link } from "react-router-dom";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard
import { Chip, FilterTypes, Option } from "@sito/dashboard";

// components
import { Error, WalletTable } from "components";

// hooks
import { useTransactionsList } from "hooks";

// lib
import {
  BaseEntityDto,
  EntityName,
  enumToKeyValueArray,
  getFormattedDateTime,
  TransactionDto,
  TransactionType,
  useParseColumns,
} from "lib";

// utils
import { icons } from "../utils";

// types
import { TransactionContainerPropsType } from "./types";

export const TransactionTable = (props: TransactionContainerPropsType) => {
  const { accountId, getActions, editAction, showFilters, setShowFilters } =
    props;

  const { data, isLoading, error } = useTransactionsList({
    filters: { accountId },
  });

  // #region columns

  const { columns } = useParseColumns<TransactionDto>(
    [
      {
        key: "name",
        filterOptions: { type: FilterTypes.text, defaultValue: "" },
        renderBody: (name: string, entity: BaseEntityDto) => (
          <Link
            to="/"
            className={`underline ${
              entity.deleted ? "text-base" : "primary"
            } flex`}
            onClick={(e) => {
              editAction.onClick(entity.id);
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className="truncate">{name}</span>
          </Link>
        ),
      },
      {
        key: "amount",
        filterOptions: { type: FilterTypes.number },
      },
      {
        key: "date",
        filterOptions: { type: FilterTypes.date },
        renderBody: (value) => <p>{getFormattedDateTime(value)}</p>,
      },
      {
        key: "type",
        filterOptions: {
          type: FilterTypes.select,
          options: enumToKeyValueArray(TransactionType)?.map((item) => ({
            id: item.value,
            value: item.key,
          })) as Option[],
          customFilter: (value) => String(TransactionType[value]),
        },

        renderBody: (type: TransactionType) => (
          <div className="w-fit">
            <Chip
              className={type === TransactionType.In ? "success" : "error"}
              label={
                <div className="flex gap-2 items-center justify-center">
                  <FontAwesomeIcon
                    icon={icons[(type ?? 0) as keyof typeof icons]}
                  />
                  {String(TransactionType[type])}
                </div>
              }
            />
          </div>
        ),
      },
    ],
    EntityName.Transaction,
    ["createdAt", "updatedAt"]
  );

  // #endregion

  return error ? (
    <Error message={error?.message} />
  ) : (
    <WalletTable
      data={data?.items ?? []}
      actions={getActions}
      isLoading={isLoading}
      entity={EntityName.Transaction}
      columns={columns}
      filterOptions={{
        button: {
          hide: true,
        },
        dropdown:
          setShowFilters && !!showFilters
            ? {
                opened: showFilters,
                setOpened: setShowFilters,
              }
            : undefined,
      }}
    />
  );
};
