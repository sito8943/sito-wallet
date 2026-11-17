// @sito/dashboard-app
import { classNames } from "@sito/dashboard-app";

// components
import { EntityAvatar } from "components";

// views
import { Type } from "views/TransactionCategories/components/Type";

// utils
import { getProviderPhoto } from "./utils";

// types
import type { TransactionCardAvatarPropsType } from "./types";

// styles
import "./styles.css";

/**
 * Seller photo with the transaction type as a corner badge; falls back to the
 * plain type icon when there is no photo or it fails to load.
 */
export function TransactionCardAvatar(props: TransactionCardAvatarPropsType) {
  const { type, purchaseProvider, compact = false } = props;

  return (
    <EntityAvatar
      photo={getProviderPhoto(purchaseProvider)}
      alt={purchaseProvider?.name ?? ""}
      size={compact ? "sm" : "lg"}
      shape="circle"
      className={classNames(
        "transaction-card-avatar",
        compact && "transaction-card-avatar--compact",
      )}
      imageClassName="transaction-card-avatar-image"
      fallback={
        <Type
          className={classNames(
            "transaction-card-type",
            compact && "transaction-card-type--compact",
          )}
          type={type}
          filled={false}
          noText
        />
      }
      badge={
        <span className="transaction-card-avatar-badge">
          <Type type={type} filled={false} noText />
        </span>
      }
    />
  );
}
