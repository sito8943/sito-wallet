import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFieldArray, useFormState, useWatch } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faPlus } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// components
import { TransactionProductsDialog } from "../TransactionProductsDialog";

// utils
import {
  getTransactionProductsTotal,
  isTransactionProductComplete,
} from "../../utils";

// types
import type { TransactionProductsFieldPropsType } from "./types";

import "./styles.css";

/**
 * Products summary inside the transaction form. The rows are edited in their
 * own dialog so a long list doesn't stretch the form; the field array lives
 * here because this component is always mounted.
 */
export function TransactionProductsField(
  props: TransactionProductsFieldPropsType,
) {
  const { control, isLoading } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
    rules: {
      validate: (items) =>
        items.every(isTransactionProductComplete) ||
        t("_entities:transaction.products.incomplete"),
    },
  });

  const watchedProducts = useWatch({ control, name: "products" });
  const total = getTransactionProductsTotal(watchedProducts);
  const { errors } = useFormState({ control, name: "products" });
  const hasError = !!errors.products;

  return (
    <div className="transaction-products">
      <div className="transaction-products-info">
        <span className="transaction-products-title">
          {t("_entities:transaction.products.label")}
        </span>
        <span className="transaction-products-summary">
          {fields.length
            ? t("_entities:transaction.products.summary", {
                count: fields.length,
                total,
              })
            : t("_entities:transaction.products.empty")}
        </span>
        {hasError && (
          <span className="transaction-products-error">
            {t("_entities:transaction.products.incomplete")}
          </span>
        )}
      </div>
      <Button
        type="button"
        variant="outlined"
        disabled={isLoading}
        onClick={() => setOpen(true)}
      >
        <FontAwesomeIcon icon={fields.length ? faPencil : faPlus} />{" "}
        {t(
          fields.length
            ? "_entities:transaction.products.edit"
            : "_entities:transaction.products.add",
        )}
      </Button>
      <TransactionProductsDialog
        open={open}
        onClose={() => setOpen(false)}
        control={control}
        isLoading={isLoading}
        fields={fields}
        append={append}
        remove={remove}
      />
    </div>
  );
}
