import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  Button,
  Dialog,
  IconButton,
  TextInput,
} from "@sito/dashboard-app";

// lib
import { Tables } from "lib";

// hooks
import { useProductsCommon } from "../../../../hooks/queries/useProductsCommon";

// utils
import {
  emptyTransactionProduct,
  getTransactionProductsTotal,
} from "../../utils";

// types
import type { TransactionProductsDialogPropsType } from "./types";

import "./styles.css";

export function TransactionProductsDialog(
  props: TransactionProductsDialogPropsType,
) {
  const { open, onClose, control, isLoading, fields, append, remove } = props;
  const { t } = useTranslation();

  const products = useProductsCommon();
  const productOptions = useMemo(
    () => [...(products.data ?? [])] as Option[],
    [products.data],
  );

  const watchedProducts = useWatch({ control, name: "products" });
  const total = getTransactionProductsTotal(watchedProducts);

  return (
    <Dialog
      open={open}
      handleClose={onClose}
      mobileFullScreen
      title={t("_entities:transaction.products.label")}
      containerClassName="!z-60"
      className="transaction-products-dialog"
    >
      <div className="transaction-products-dialog-list">
        {fields.length === 0 && (
          <span className="transaction-products-dialog-empty">
            {t("_entities:transaction.products.empty")}
          </span>
        )}
        {fields.map((field, index) => (
          <div key={field.id} className="transaction-products-dialog-row">
            <Controller
              control={control}
              name={`products.${index}.product`}
              disabled={isLoading}
              rules={{
                validate: (value) =>
                  !!value ||
                  t("_entities:transaction.products.product.required"),
              }}
              render={({ field: { value, onChange, ...rest } }) => (
                <AutocompleteInput
                  required
                  options={productOptions}
                  value={value}
                  onChange={(next) => onChange(next)}
                  label={t("_entities:transaction.products.product.label")}
                  autoComplete={`${Tables.Transactions}-${t(
                    "_entities:transaction.products.product.label",
                  )}`}
                  multiple={false}
                  {...rest}
                />
              )}
            />
            <Controller
              control={control}
              name={`products.${index}.quantity`}
              disabled={isLoading}
              render={({ field: { value, ...rest } }) => (
                <TextInput
                  type="number"
                  min={0}
                  step="any"
                  value={value ?? ""}
                  label={t("_entities:transaction.products.quantity.label")}
                  {...rest}
                />
              )}
            />
            <Controller
              control={control}
              name={`products.${index}.unitPrice`}
              disabled={isLoading}
              rules={{
                required: t(
                  "_entities:transaction.products.unitPrice.required",
                ),
                min: {
                  value: 0,
                  message: t(
                    "_entities:transaction.products.unitPrice.required",
                  ),
                },
              }}
              render={({ field: { value, ...rest } }) => (
                <TextInput
                  required
                  type="number"
                  min={0}
                  step="any"
                  value={value ?? ""}
                  label={t("_entities:transaction.products.unitPrice.label")}
                  {...rest}
                />
              )}
            />
            <IconButton
              type="button"
              icon={faTrash}
              disabled={isLoading}
              onClick={() => remove(index)}
              aria-label={t("_entities:transaction.products.remove")}
              data-tooltip-id="tooltip"
              data-tooltip-content={t("_entities:transaction.products.remove")}
            />
          </div>
        ))}
      </div>
      <div className="transaction-products-dialog-footer">
        <Button
          type="button"
          variant="outlined"
          disabled={isLoading}
          onClick={() => append(emptyTransactionProduct())}
        >
          <FontAwesomeIcon icon={faPlus} />{" "}
          {t("_entities:transaction.products.add")}
        </Button>
        <span className="transaction-products-dialog-total">
          {t("_entities:transaction.products.total", { total })}
        </span>
      </div>
      <div className="transaction-products-dialog-footer">
        <span />
        <Button
          type="button"
          variant="submit"
          color="primary"
          onClick={onClose}
        >
          {t("_entities:transaction.products.done")}
        </Button>
      </div>
    </Dialog>
  );
}
