import { useState } from "react";

// components
import { ProviderPhoto } from "components";

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
  const { type, purchaseProvider } = props;

  const photo = getProviderPhoto(purchaseProvider);
  // Keyed by photo so a new photo gets a fresh attempt.
  const [failedPhoto, setFailedPhoto] = useState<string | null>(null);

  if (!photo || failedPhoto === photo)
    return (
      <Type
        className="transaction-card-type"
        type={type}
        filled={false}
        noText
      />
    );

  return (
    <span className="transaction-card-avatar">
      <ProviderPhoto
        className="transaction-card-avatar-image"
        photo={photo}
        alt={purchaseProvider?.name ?? ""}
        onError={() => setFailedPhoto(photo)}
      />
      <span className="transaction-card-avatar-badge">
        <Type type={type} filled={false} noText />
      </span>
    </span>
  );
}
