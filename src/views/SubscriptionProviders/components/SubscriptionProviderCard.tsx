import { useTranslation } from "react-i18next";
import { classNames } from "@sito/dashboard-app";

// icons
import { faExternalLink, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { ItemCard, ItemCardTitle } from "components";

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
  const parsedDescription =
    description || t("_entities:base.description.empty");
  const parsedWebsite = website?.trim() ?? "";
  const hasPhoto = !!photo?.trim();

  return (
    <ItemCard
      title={
        <div className="subscription-provider-card-title-row">
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
                <FontAwesomeIcon icon={faExternalLink} />
              </a>
            ) : null}
          </ItemCardTitle>
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
      <p
        className={classNames(
          "subscription-provider-card-description",
          !description && "subscription-provider-card-description--empty",
          deleted && "subscription-provider-card-description--deleted",
        )}
      >
        {parsedDescription}
      </p>

      {hasPhoto ? (
        <p className="subscription-provider-card-photo">
          <FontAwesomeIcon icon={faImage} />
          {t("_entities:subscriptionProvider.photo.label")}
        </p>
      ) : null}
    </ItemCard>
  );
}
