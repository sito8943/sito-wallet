import { useMemo, useState } from "react";
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
  getTransactionProductErrorKeys,
  formatTransactionAmount,
  getTransactionProductsTotal,
  newProductOption,
} from "../../utils";

// types
import type { TransactionProductsDialogPropsType } from "./types";

import "./styles.css";

export function TransactionProductsDialog(
  props: TransactionProductsDialogPropsType,
) {
  const { open, onClose, control, isLoading, fields, append, remove } = props;
  const { t, i18n } = useTranslation();

  const products = useProductsCommon();
  const productOptions = useMemo(
    () => [...(products.data ?? [])] as Option[],
    [products.data],
  );

  const watchedProducts = useWatch({ control, name: "products" });
  const total = getTransactionProductsTotal(watchedProducts);

  // Row errors only show after trying to add or finish with incomplete rows.
  const [showErrors, setShowErrors] = useState(false);
  const rowErrors = (watchedProducts ?? []).map(getTransactionProductErrorKeys);
  const hasIncomplete = rowErrors.some((keys) => keys.length > 0);

  const whenComplete = (action: () => void) => {
    setShowErrors(hasIncomplete);
    if (!hasIncomplete) action();
  };

  return (
    <Dialog
      open={open}
      handleClose={onClose}
      mobileFullScreen
      title={t("_entities:transaction.products.label")}
      containerClassName="!z-60"
    >
      <div className="transaction-products-dialog-list">
        {fields.length === 0 && (
          <span className="transaction-products-dialog-empty">
            {t("_entities:transaction.products.empty")}
          </span>
        )}
        {fields.map((field, index) => (
          <div key={field.id} className="transaction-products-dialog-row">
            <div className="transaction-products-dialog-row-main">
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
                    createOption={{
                      onCreate: (name) => onChange(newProductOption(name)),
                      renderLabel: (name) =>
                        t("_entities:transaction.products.product.create", {
                          name,
                        }),
                    }}
                    {...rest}
                  />
                )}
              />
              <IconButton
                type="button"
                icon={faTrash}
                color="error"
                disabled={isLoading}
                onClick={() => remove(index)}
                aria-label={t("_entities:transaction.products.remove")}
                data-tooltip-id="tooltip"
                data-tooltip-content={t(
                  "_entities:transaction.products.remove",
                )}
              />
            </div>
            <div className="transaction-products-dialog-row-details">
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
            </div>
            {showErrors &&
              rowErrors[index]?.map((key) => (
                <span key={key} className="transaction-products-dialog-error">
                  {t(key)}
                </span>
              ))}
          </div>
        ))}
      </div>
      <div className="transaction-products-dialog-actions">
        <div className="transaction-products-dialog-footer">
          <Button
            type="button"
            variant="outlined"
            disabled={isLoading}
            onClick={() =>
              whenComplete(() => append(emptyTransactionProduct()))
            }
          >
            <FontAwesomeIcon icon={faPlus} />{" "}
            {t("_entities:transaction.products.add")}
          </Button>
          <span className="transaction-products-dialog-total">
            {t("_entities:transaction.products.total", {
              total: formatTransactionAmount(total, i18n.language),
            })}
          </span>
        </div>
        <div className="transaction-products-dialog-footer">
          <span />
          <Button
            type="button"
            variant="submit"
            color="primary"
            onClick={() => whenComplete(onClose)}
          >
            {t("_entities:transaction.products.done")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
