import { useTranslation } from "react-i18next";

import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ItemCard, ItemCardTitle } from "components";

import type { UserCardPropsType } from "../types";

export function UserCard(props: UserCardPropsType) {
  const { t } = useTranslation();

  const {
    id,
    username,
    email,
    admin,
    deletedAt,
    actions,
    onClick,
    selectionMode,
    selected,
    onSelect,
    onLongPress,
  } = props;

  const deleted = !!deletedAt;

  return (
    <ItemCard
      title={
        <div className="flex w-full items-start justify-between gap-2">
          <ItemCardTitle>{username || email}</ItemCardTitle>
          {admin ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-bg-primary px-2 py-0.5 text-xs text-base">
              <FontAwesomeIcon icon={faShieldHalved} />
              {t("_entities:user.admin.label")}
            </span>
          ) : null}
        </div>
      }
      deleted={deleted}
      name={t("_pages:users.forms.edit")}
      aria-label={t("_pages:users.forms.editAria")}
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
        className={`text-start text-sm text-text-muted ${deleted ? "!text-bg-error" : ""}`}
      >
        {email}
      </p>
    </ItemCard>
  );
}
