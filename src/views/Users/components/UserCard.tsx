import { useTranslation } from "react-i18next";
import { classNames } from "@sito/dashboard-app";

import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ItemCard, ItemCardTitle } from "components";

import type { UserCardPropsType } from "../types";

import "./styles.css";

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
        <div className="user-card-title-row">
          <ItemCardTitle>{username || email}</ItemCardTitle>
          {admin ? (
            <span className="user-card-admin-badge">
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
      className="user-card-content"
      containerClassName="user-card-container"
    >
      <p
        className={classNames(
          "user-card-email",
          deleted && "user-card-email--deleted",
        )}
      >
        {email}
      </p>
    </ItemCard>
  );
}
