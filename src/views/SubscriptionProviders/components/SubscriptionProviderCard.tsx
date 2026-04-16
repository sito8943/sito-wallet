import { useTranslation } from "react-i18next";

// icons
import { faExternalLink, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { ItemCard, ItemCardTitle } from "components";

// types
import { SubscriptionProviderCardPropsType } from "../types";

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
  } = props;

  const deleted = !!deletedAt;
  const parsedDescription =
    description || t("_entities:base.description.empty");
  const parsedWebsite = website?.trim() ?? "";
  const hasPhoto = !!photo?.trim();

  return (
    <ItemCard
      title={
        <div className="flex w-full items-start justify-between gap-2">
          <ItemCardTitle>
            {name}{" "}
            {parsedWebsite ? (
              <a
                href={ensureAbsoluteUrl(parsedWebsite)}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-bg-primary underline"
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
      className="gap-2"
      containerClassName="max-xs:min-h-0 max-xs:rounded-xl max-xs:p-2.5"
    >
      <p
        className={`${description ? "" : "!text-xs italic"} text-start text-sm text-text-muted ${
          deleted ? "!text-bg-error" : ""
        }`}
      >
        {parsedDescription}
      </p>

      {hasPhoto ? (
        <p className="inline-flex items-center gap-1 text-xs text-text-muted">
          <FontAwesomeIcon icon={faImage} />
          {t("_entities:subscriptionProvider.photo.label")}
        </p>
      ) : null}
    </ItemCard>
  );
}
