import { useTranslation } from "react-i18next";
import { classNames } from "@sito/dashboard-app";

// icons
import {
  faArrowUpRightFromSquare,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { EntityAvatar, ItemCard, ItemCardTitle } from "components";

// types
import type { SubscriptionProviderCardPropsType } from "../types";

import "./styles.css";

const ensureAbsoluteUrl = (value: string): string => {
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

export function SubscriptionProviderCard(
  props: SubscriptionProviderCardPropsType,
) {
  const { t } = useTranslation();

  const {
    id,
    name,
    description,
    website,
    photo,
    deletedAt,
    actions,
    onClick,
    selectionMode,
    selected,
    onSelect,
    onLongPress,
    swipeDeleteOpen,
    onSwipeDelete,
  } = props;

  const deleted = !!deletedAt;
  const parsedWebsite = website?.trim() ?? "";

  return (
    <ItemCard
      title={
        <div className="subscription-provider-card-title-row">
          <div className="subscription-provider-card-heading">
            <EntityAvatar photo={photo} fallbackIcon={faImage} />
            <ItemCardTitle>
              {name}{" "}
              {parsedWebsite ? (
                <a
                  href={ensureAbsoluteUrl(parsedWebsite)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(event) => event.stopPropagation()}
                  className="subscription-provider-card-link"
                >
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                </a>
              ) : null}
            </ItemCardTitle>
          </div>
        </div>
      }
      deleted={deleted}
      name={t("_pages:subscriptionProviders.forms.edit")}
      aria-label={t("_pages:subscriptionProviders.forms.editAria")}
      onClick={() => onClick(id)}
      selectionMode={selectionMode}
      selected={selected}
      onToggleSelection={() => onSelect?.(id)}
      onLongPressSelection={() => onLongPress?.(id)}
      actions={actions}
      swipeDeleteOpen={swipeDeleteOpen}
      onSwipeDelete={onSwipeDelete}
      className="subscription-provider-card-content"
      containerClassName="subscription-provider-card-container"
    >
      {description ? (
        <p
          className={classNames(
            "subscription-provider-card-description",
            deleted && "subscription-provider-card-description--deleted",
          )}
        >
          {description}
        </p>
      ) : null}
    </ItemCard>
  );
}
