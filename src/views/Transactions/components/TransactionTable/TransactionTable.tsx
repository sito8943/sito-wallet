import { Link } from "react-router-dom";
import { useCallback } from "react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard
import { Chip, FilterTypes, Option } from "@sito/dashboard";

// components
import { ConfirmationDialog, Error, WalletTable } from "components";
import {
  AddTransactionDialog,
  EditTransactionDialog,
} from "../TransactionDialog";

// hooks
import {
  useTransactionsList,
  useDeleteDialog,
  TransactionsQueryKeys,
  useRestoreDialog,
  useTimeAge,
} from "hooks";
import { useAddTransaction, useEditTransaction } from "../../hooks";

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

// providers
import { useManager } from "providers";

// utils
import { icons } from "../utils";

// types
import { TransactionTablePropsType } from "./types";

export const TransactionTable = (props: TransactionTablePropsType) => {
  const { accountId, accounts } = props;

  const { timeAge } = useTimeAge();

  const manager = useManager();

  const { data, isLoading, error } = useTransactionsList({
    filters: { accountId },
  });

  // #region actions

  const deleteTransaction = useDeleteDialog({
    mutationFn: (data) => manager.Transactions.softDelete(data),
    ...TransactionsQueryKeys.all(),
  });

  const restoreTransaction = useRestoreDialog({
    mutationFn: (data) => manager.Transactions.restore(data),
    ...TransactionsQueryKeys.all(),
  });

  const addTransaction = useAddTransaction();

  const editTransaction = useEditTransaction();

  // #endregion

  const getActions = useCallback(
    (record: TransactionDto) => [
      editTransaction.action(record),
      deleteTransaction.action(record),
      restoreTransaction.action(record),
    ],
    [deleteTransaction, editTransaction, restoreTransaction]
  );

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
              editTransaction.onClick(entity.id);
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className="truncate">{name}</span>
          </Link>
        ),
      },
      {
        key: "account",
        filterOptions: {
          type: FilterTypes.autocomplete,
          options: accounts,
          defaultValue: [],
        },
        sortable: false,
        renderBody: (_, transaction: TransactionDto) => (
          <div className="w-fit">
            <Chip
              label={transaction?.account?.name}
              spanClassName="text-xs"
              className="!py-2"
            />
          </div>
        ),
      },
      {
        key: "amount",
        filterOptions: { type: FilterTypes.number },
      },
      {
        key: "date",
        filterOptions: { type: FilterTypes.date },
        renderBody: (value) => (
          <p
            data-tooltip-id="tooltip"
            data-tooltip-content={getFormattedDateTime(value)}
          >
            {timeAge(new Date(value))}
          </p>
        ),
      },
      {
        key: "type",
        filterOptions: {
          type: FilterTypes.select,
          options: enumToKeyValueArray(TransactionType)?.map((item) => ({
            id: item.key,
            value: item.value,
          })) as Option[],
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
    <>
      <WalletTable
        data={data?.items ?? []}
        actions={getActions}
        isLoading={isLoading}
        entity={EntityName.Transaction}
        columns={columns}
      />
      {/* Dialogs */}
      <AddTransactionDialog {...addTransaction} />
      <EditTransactionDialog {...editTransaction} />
      <ConfirmationDialog {...deleteTransaction} />
      <ConfirmationDialog {...restoreTransaction} />
    </>
  );
};
